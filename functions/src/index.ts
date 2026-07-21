import {onCall, onRequest, HttpsError} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sgMail = require('@sendgrid/mail') as typeof import('@sendgrid/mail');

// Define secrets — these are resolved at runtime from Google Secret Manager
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const frontendUrl = defineSecret('FRONTEND_URL');
const sendgridApiKey = defineSecret('SENDGRID_API_KEY');

// Initialize Firebase Admin
admin.initializeApp();

// Firestore reference
const db = admin.firestore();

const FROM_EMAIL = 'admin@unitycollective.app';
const FROM_NAME = 'Unity Collective';

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

// ─── Email helpers ─────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function buildOrderConfirmationHtml(
  orderId: string,
  items: CartItem[],
  subtotalCents: number,
  totalCents: number,
  frontendBaseUrl: string
): string {
  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #2A2A2A;color:#CCCCCC;">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2A2A2A;color:#CCCCCC;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2A2A2A;color:#D4AF37;text-align:right;">${formatCents(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#111111;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1E1E1E;border:1px solid #2A2A2A;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#CC0000 0%,#1A1A1A 50%,#228B22 100%);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#D4AF37;font-size:24px;font-weight:bold;">[Unity Collective]</h1>
          <p style="margin:8px 0 0;color:#FFFFFF;font-size:16px;">Order Confirmed ✓</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="color:#CCCCCC;margin:0 0 24px;">Thank you for your purchase! Your order has been received and the vendor has been notified.</p>
          <p style="color:#888888;font-size:13px;margin:0 0 24px;">Order ID: <span style="color:#D4AF37;font-family:monospace;">${orderId}</span></p>
          <!-- Items table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <th style="text-align:left;color:#888888;font-size:12px;padding-bottom:8px;border-bottom:1px solid #3A3A3A;">Item</th>
              <th style="text-align:center;color:#888888;font-size:12px;padding-bottom:8px;border-bottom:1px solid #3A3A3A;">Qty</th>
              <th style="text-align:right;color:#888888;font-size:12px;padding-bottom:8px;border-bottom:1px solid #3A3A3A;">Price</th>
            </tr>
            ${itemRows}
          </table>
          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="color:#888888;padding:4px 0;">Subtotal</td>
              <td style="color:#CCCCCC;text-align:right;padding:4px 0;">${formatCents(subtotalCents)}</td>
            </tr>
            <tr>
              <td style="color:#FFFFFF;font-weight:bold;padding:8px 0 0;">Total</td>
              <td style="color:#D4AF37;font-weight:bold;text-align:right;padding:8px 0 0;font-size:18px;">${formatCents(totalCents)}</td>
            </tr>
          </table>
          <!-- CTA -->
          <div style="text-align:center;">
            <a href="${frontendBaseUrl}/orders" style="display:inline-block;background:#D4AF37;color:#000000;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;">View My Orders</a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 32px;border-top:1px solid #2A2A2A;text-align:center;">
          <p style="color:#555555;font-size:12px;margin:0;">© 2025 Unity Collective. Built with pride for our community.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildVendorNotificationHtml(
  orderId: string,
  items: CartItem[],
  subtotalCents: number,
  frontendBaseUrl: string
): string {
  const itemList = items
    .map((item) => `<li style="color:#CCCCCC;padding:4px 0;">${item.name} × ${item.quantity} — ${formatCents(item.price * item.quantity)}</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#111111;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1E1E1E;border:1px solid #2A2A2A;border-radius:12px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#CC0000 0%,#1A1A1A 50%,#228B22 100%);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#D4AF37;font-size:24px;font-weight:bold;">[Unity Collective]</h1>
          <p style="margin:8px 0 0;color:#FFFFFF;font-size:16px;">New Order Received 🎉</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="color:#CCCCCC;margin:0 0 16px;">You have a new order! Here's what was purchased:</p>
          <p style="color:#888888;font-size:13px;margin:0 0 16px;">Order ID: <span style="color:#D4AF37;font-family:monospace;">${orderId}</span></p>
          <ul style="margin:0 0 24px;padding-left:20px;">${itemList}</ul>
          <p style="color:#CCCCCC;margin:0 0 32px;">Order total (your portion): <strong style="color:#D4AF37;">${formatCents(subtotalCents)}</strong></p>
          <div style="text-align:center;">
            <a href="${frontendBaseUrl}/vendor/orders" style="display:inline-block;background:#D4AF37;color:#000000;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;">Manage Orders</a>
          </div>
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid #2A2A2A;text-align:center;">
          <p style="color:#555555;font-size:12px;margin:0;">© 2025 Unity Collective. Built with pride for our community.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Write a structured email log entry to Firestore.
 * Fire-and-forget — never throws.
 */
async function logEmail(
  orderId: string,
  vendorId: string,
  type: 'buyer_confirmation' | 'vendor_notification',
  to: string,
  status: 'sent' | 'failed',
  error?: string
): Promise<void> {
  try {
    await db.collection('emailLogs').add({
      orderId,
      vendorId,
      type,
      to,
      status,
      error: error ?? null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to write email log:', err);
  }
}

/**
 * Send order confirmation to buyer and new-order notification to vendor.
 * Fire-and-forget: logs errors but never throws (order is already saved).
 * Every attempt (success or failure) is recorded in emailLogs collection.
 */
async function sendOrderEmails(
  orderId: string,
  buyerEmail: string | null | undefined,
  vendorId: string,
  items: CartItem[],
  subtotalCents: number,
  totalCents: number,
  frontendBaseUrl: string
): Promise<void> {
  const apiKey = sendgridApiKey.value();
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY not set — skipping order emails');
    return;
  }

  sgMail.setApiKey(apiKey);

  // 1. Buyer confirmation
  if (buyerEmail) {
    try {
      await sgMail.send({
        to: buyerEmail,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: `Your Unity Collective order is confirmed! (#${orderId.slice(-8).toUpperCase()})`,
        html: buildOrderConfirmationHtml(orderId, items, subtotalCents, totalCents, frontendBaseUrl),
      });
      console.log(`Order confirmation sent to ${buyerEmail}`);
      await logEmail(orderId, vendorId, 'buyer_confirmation', buyerEmail, 'sent');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to send buyer confirmation email:', err);
      await logEmail(orderId, vendorId, 'buyer_confirmation', buyerEmail, 'failed', msg);
    }
  }

  // 2. Vendor notification — look up vendor email from Firestore users collection
  try {
    const vendorDoc = await db.collection('users').doc(vendorId).get();
    const vendorEmail = vendorDoc.data()?.email as string | undefined;

    if (vendorEmail) {
      try {
        await sgMail.send({
          to: vendorEmail,
          from: { email: FROM_EMAIL, name: FROM_NAME },
          subject: `New order on Unity Collective! (#${orderId.slice(-8).toUpperCase()})`,
          html: buildVendorNotificationHtml(orderId, items, subtotalCents, frontendBaseUrl),
        });
        console.log(`Vendor notification sent to ${vendorEmail}`);
        await logEmail(orderId, vendorId, 'vendor_notification', vendorEmail, 'sent');
      } catch (sendErr) {
        const msg = sendErr instanceof Error ? sendErr.message : String(sendErr);
        console.error('Failed to send vendor notification email:', sendErr);
        await logEmail(orderId, vendorId, 'vendor_notification', vendorEmail, 'failed', msg);
      }
    } else {
      console.warn(`No email found for vendor ${vendorId} — skipping vendor notification`);
      await logEmail(orderId, vendorId, 'vendor_notification', `vendor:${vendorId}`, 'failed', 'No email address on file for vendor');
    }
  } catch (err) {
    console.error('Failed to look up vendor for email notification:', err);
  }
}

// ─── Cloud Functions ───────────────────────────────────────────────────────────

/**
 * Create Stripe Checkout Session
 * 
 * This function creates a secure Stripe checkout session for the user's cart.
 * It fetches actual product prices from Firestore (never trusts client data),
 * applies founding member benefits and platform fees, then returns a checkout URL.
 * 
 * Security: All price calculations happen server-side
 */
export const createCheckoutSession = onCall(
  { secrets: [stripeSecretKey, frontendUrl] },
  async (request) => {
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

  // Initialize Stripe with secret from Secret Manager
  const stripe = new Stripe(stripeSecretKey.value(), {
    apiVersion: '2025-12-15.clover',
  });

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
      success_url: successUrl || `${frontendUrl.value()}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${frontendUrl.value()}/cart`,
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
  }
);

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events, particularly checkout.session.completed.
 * Creates orders in Firestore after successful payment and clears user's cart.
 * 
 * Security: Verifies webhook signature to ensure requests come from Stripe
 */
export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret, frontendUrl, sendgridApiKey] },
  async (req, res) => {
  // Initialize Stripe with secret from Secret Manager
  const stripe = new Stripe(stripeSecretKey.value(), {
    apiVersion: '2025-12-15.clover',
  });

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
      stripeWebhookSecret.value()
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
  }
);

/**
 * Handle successful checkout session
 * Creates order in Firestore, clears user's cart, and sends email notifications.
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

    // Send order confirmation to buyer and notification to vendor
    await sendOrderEmails(
      orderRef.id,
      session.customer_details?.email,
      vendorId,
      cartItems,
      subtotalCents,
      totalCents,
      frontendUrl.value()
    );

  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}
