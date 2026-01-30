import {onCall, HttpsError} from 'firebase-functions/v2/https';
import {onRequest} from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

// Firestore reference
const db = admin.firestore();

interface CartItem {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  vendorId: string;
}

interface CreateCheckoutSessionData {
  cartItems: CartItem[];
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Create Stripe Checkout Session
 * 
 * This function creates a secure Stripe checkout session for the user's cart.
 * It fetches actual product prices from Firestore (never trusts client data),
 * applies founding member benefits and platform fees, then returns a checkout URL.
 * 
 * Security: All price calculations happen server-side
 */
export const createCheckoutSession = onCall(async (request) => {
  // Ensure user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated to create a checkout session.'
    );
  }

  const userId = request.auth.uid;
  const { cartItems, successUrl, cancelUrl } = request.data as CreateCheckoutSessionData;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new HttpsError(
      'invalid-argument',
      'Cart items are required and must be a non-empty array.'
    );
  }

  try {
    // Fetch monetization config
    const configDoc = await db.collection('config').doc('monetization').get();
    const config = configDoc.exists ? configDoc.data() : {
      foundingEnabled: true,
      foundingMaxVendors: 100,
      foundingFreeDays: 90,
      freeSalesThresholdCents: 100000, // $1000
      feePercent: 5,
      feeCapCents: 10000, // $100
      barterFeePercent: 0,
    };

    // Fetch vendor info to check founding status
    const vendorId = cartItems[0].vendorId;
    const vendorDoc = await db.collection('vendors').doc(vendorId).get();
    const vendorData = vendorDoc.data();
    const vendorIsFoundingMember = vendorData?.foundingMember || false;

    // Build line items by fetching actual prices from Firestore
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let subtotalCents = 0;

    for (const item of cartItems) {
      // Fetch product from Firestore to get actual price
      const productDoc = await db.collection('products').doc(item.productId || item.id || '').get();
      
      if (!productDoc.exists) {
        throw new HttpsError(
          'not-found',
          `Product ${item.productId || item.id} not found.`
        );
      }

      const product = productDoc.data();
      const actualPrice = product?.price || 0;
      const quantity = item.quantity || 1;

      subtotalCents += actualPrice * quantity;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product?.name || 'Unknown Product',
            description: product?.description,
            images: product?.images ? [product.images[0]] : undefined,
          },
          unit_amount: actualPrice,
        },
        quantity,
      });
    }

    // Calculate platform fee
    let platformFeeCents = 0;
    
    // Founding members get free transactions for first 90 days or up to $1000
    if (vendorIsFoundingMember && config?.foundingEnabled) {
      const vendorCreatedAt = vendorData?.createdAt?.toDate();
      const daysSinceCreation = vendorCreatedAt 
        ? (Date.now() - vendorCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;

      const vendorTotalSales = vendorData?.totalSalesCents || 0;

      // Check if still within founding benefits
      if (daysSinceCreation <= (config?.foundingFreeDays || 90) && 
          vendorTotalSales < (config?.freeSalesThresholdCents || 100000)) {
        platformFeeCents = 0; // No fee for founding members within limits
      } else {
        // Apply regular fee
        platformFeeCents = Math.min(
          Math.round(subtotalCents * ((config?.feePercent || 5) / 100)),
          config?.feeCapCents || 10000
        );
      }
    } else {
      // Regular vendor - apply platform fee
      platformFeeCents = Math.min(
        Math.round(subtotalCents * ((config?.feePercent || 5) / 100)),
        config?.feeCapCents || 10000
      );
    }

    // Add platform fee as a line item if applicable
    if (platformFeeCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Platform Service Fee',
            description: 'Unity Collective platform fee',
          },
          unit_amount: platformFeeCents,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/cart`,
      client_reference_id: userId,
      metadata: {
        userId,
        vendorId,
        subtotalCents: subtotalCents.toString(),
        platformFeeCents: platformFeeCents.toString(),
        cartItems: JSON.stringify(cartItems),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new HttpsError(
      'internal',
      'Failed to create checkout session: ' + error.message
    );
  }
});

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events, particularly checkout.session.completed.
 * Creates orders in Firestore after successful payment and clears user's cart.
 * 
 * Security: Verifies webhook signature to ensure requests come from Stripe
 */
export const stripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  let event: Stripe.Event;

  try {
    // Get raw body for webhook signature verification
    const rawBody = (req as any).rawBody || req.body;
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Handle successful checkout session
 * Creates order in Firestore and clears user's cart
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const metadata = session.metadata;

  if (!userId || !metadata) {
    console.error('Missing userId or metadata in session');
    return;
  }

  try {
    const cartItems = JSON.parse(metadata.cartItems);
    const vendorId = metadata.vendorId;
    const subtotalCents = parseInt(metadata.subtotalCents);
    const platformFeeCents = parseInt(metadata.platformFeeCents);
    const totalCents = session.amount_total || 0;

    // Create order document
    const orderData = {
      userId,
      vendorId,
      items: cartItems.map((item: CartItem) => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotalCents,
      platformFeeCents,
      totalCents,
      status: 'paid',
      paymentIntentId: session.payment_intent,
      stripeSessionId: session.id,
      customerEmail: session.customer_details?.email,
      shippingAddress: null, // Stripe v2025 removed shipping_details
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save order to Firestore
    const orderRef = await db.collection('orders').add(orderData);
    console.log('Order created:', orderRef.id);

    // Update vendor's total sales
    await db.collection('vendors').doc(vendorId).update({
      totalSalesCents: admin.firestore.FieldValue.increment(subtotalCents),
      orderCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Clear user's cart
    await db.collection('carts').doc(userId).delete();
    console.log('Cart cleared for user:', userId);

    // TODO: Send order confirmation email
    // TODO: Notify vendor of new order

  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}
