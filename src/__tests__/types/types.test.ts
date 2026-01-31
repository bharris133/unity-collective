import { describe, it, expect } from 'vitest';
import type { User, Vendor, Product, CartItem, Order, Offer, Message } from '../../types';

describe('TypeScript Type Definitions', () => {
  describe('User Type', () => {
    it('should create valid User object', () => {
      const user: User = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        role: 'buyer',
        businessOwner: false,
        businessName: '',
        vendorId: undefined,
        location: 'Atlanta, GA',
        interests: ['technology', 'business'],
        favorites: [],
        orderHistory: [],
        joinedAt: new Date().toISOString(),
        isAdmin: false,
        profilePicture: '',
        bio: 'Test bio',
        phone: '555-1234',
        website: 'https://example.com'
      };

      expect(user.uid).toBe('test-uid-123');
      expect(user.role).toBe('buyer');
      expect(user.businessOwner).toBe(false);
    });

    it('should support vendor role', () => {
      const vendor: User = {
        uid: 'vendor-123',
        email: 'vendor@example.com',
        displayName: 'Vendor User',
        firstName: 'Vendor',
        lastName: 'User',
        role: 'vendor',
        businessOwner: true,
        businessName: 'Test Business',
        vendorId: 'vendor-store-123',
        location: 'Detroit, MI',
        interests: [],
        favorites: [],
        orderHistory: [],
        joinedAt: new Date().toISOString(),
        isAdmin: false,
        profilePicture: '',
        bio: '',
        phone: '',
        website: ''
      };

      expect(vendor.role).toBe('vendor');
      expect(vendor.businessOwner).toBe(true);
      expect(vendor.vendorId).toBe('vendor-store-123');
    });
  });

  describe('Vendor Type', () => {
    it('should create valid Vendor object', () => {
      const vendor: Vendor = {
        vendorId: 'vendor-123',
        ownerId: 'user-123',
        businessName: 'Test Business',
        description: 'A test business',
        category: 'Food & Beverage',
        location: 'Atlanta, GA',
        verified: true,
        rating: 4.5,
        reviewCount: 10,
        logo: 'https://example.com/logo.png',
        banner: 'https://example.com/banner.png',
        contact: {
          email: 'business@example.com',
          phone: '555-1234',
          website: 'https://example.com'
        },
        socialMedia: {
          instagram: '@testbusiness',
          facebook: 'testbusiness'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(vendor.vendorId).toBe('vendor-123');
      expect(vendor.verified).toBe(true);
      expect(vendor.rating).toBe(4.5);
    });
  });

  describe('Product Type', () => {
    it('should create valid Product object', () => {
      const product: Product = {
        productId: 'product-123',
        vendorId: 'vendor-123',
        name: 'Test Product',
        description: 'A test product',
        price: 2999, // in cents
        category: 'Apparel',
        images: ['https://example.com/image1.png'],
        inStock: true,
        stockQuantity: 50,
        tags: ['test', 'product'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(product.productId).toBe('product-123');
      expect(product.price).toBe(2999);
      expect(product.inStock).toBe(true);
    });

    it('should handle price in cents correctly', () => {
      const product: Product = {
        productId: 'product-456',
        vendorId: 'vendor-123',
        name: 'Expensive Product',
        description: 'Costs $199.99',
        price: 19999, // $199.99 in cents
        category: 'Digital Products',
        images: [],
        inStock: true,
        stockQuantity: 999,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(product.price).toBe(19999);
      expect(product.price / 100).toBe(199.99);
    });
  });

  describe('CartItem Type', () => {
    it('should create valid CartItem object', () => {
      const cartItem: CartItem = {
        productId: 'product-123',
        quantity: 2,
        price: 2999,
        name: 'Test Product',
        image: 'https://example.com/image.png',
        vendorId: 'vendor-123'
      };

      expect(cartItem.productId).toBe('product-123');
      expect(cartItem.quantity).toBe(2);
      expect(cartItem.price * cartItem.quantity).toBe(5998);
    });
  });

  describe('Order Type', () => {
    it('should create valid Order object', () => {
      const order: Order = {
        orderId: 'order-123',
        userId: 'user-123',
        vendorId: 'vendor-123',
        items: [
          {
            productId: 'product-123',
            name: 'Test Product',
            quantity: 2,
            price: 2999,
            image: 'https://example.com/image.png'
          }
        ],
        subtotal: 5998,
        tax: 480,
        shipping: 999,
        platformFee: 300,
        total: 7777,
        status: 'pending',
        stripeSessionId: 'cs_test_123',
        stripePaymentIntentId: 'pi_test_123',
        shippingAddress: {
          fullName: 'Test User',
          addressLine1: '123 Test St',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30301',
          country: 'US',
          phone: '555-1234'
        },
        createdAt: new Date().toISOString()
      };

      expect(order.orderId).toBe('order-123');
      expect(order.status).toBe('pending');
      expect(order.total).toBe(7777);
    });

    it('should support all order statuses', () => {
      const statuses: Order['status'][] = [
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
      ];

      statuses.forEach(status => {
        const order: Partial<Order> = { status };
        expect(order.status).toBe(status);
      });
    });
  });

  describe('Offer Type', () => {
    it('should create valid Offer object', () => {
      const offer: Offer = {
        offerId: 'offer-123',
        fromUserId: 'user-123',
        toUserId: 'vendor-123',
        productId: 'product-123',
        offerType: 'barter',
        offerDetails: 'I can trade my services for this product',
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      expect(offer.offerId).toBe('offer-123');
      expect(offer.offerType).toBe('barter');
      expect(offer.status).toBe('pending');
    });
  });

  describe('Message Type', () => {
    it('should create valid Message object', () => {
      const message: Message = {
        messageId: 'message-123',
        threadId: 'thread-123',
        senderId: 'user-123',
        text: 'Hello, is this product still available?',
        attachments: [],
        createdAt: new Date().toISOString(),
        read: false
      };

      expect(message.messageId).toBe('message-123');
      expect(message.text).toBeTruthy();
      expect(message.read).toBe(false);
    });
  });
});
