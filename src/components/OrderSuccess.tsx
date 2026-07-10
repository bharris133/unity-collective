import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import type { Order } from '../types/Order';

export const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    orderService.getOrderById(orderId)
      .then(o => setOrder(o))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading your order...</p>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Order</h2>
          <p className="text-gray-600 mb-6">
            No order information found. Please check your order history.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  const orderRef = `UC-${orderId.slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for supporting Black-owned businesses through Unity Collective
            </p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600 mb-1">Order Reference</p>
              <p className="text-2xl font-bold text-red-600">{orderRef}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {order && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t">
                  <span>Total</span><span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold text-gray-700 mb-1">Shipping to:</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Vendor Notification</h3>
                <p className="text-sm text-gray-600">
                  The vendor has been notified and will begin processing your order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  Your order status will update as the vendor prepares your items. Check your order history anytime.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Shipping Updates</h3>
                <p className="text-sm text-gray-600">
                  Your order status will change to "Shipped" once the vendor dispatches your items.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Impact */}
        <div className="bg-gradient-to-r from-red-600 to-green-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <h2 className="text-xl font-bold mb-3">Your Impact</h2>
          <p className="text-white/90 mb-4">
            By shopping with Unity Collective, you're directly supporting Black entrepreneurs 
            and contributing to economic empowerment in our community. Every purchase makes a difference!
          </p>
          <div className="flex items-center gap-2 text-yellow-300">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Supporting Black-Owned Businesses</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 bg-white border-2 border-red-600 text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <Package className="h-5 w-5" />
            View My Orders
          </Link>
          <Link
            to="/marketplace"
            className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Questions about your order?
          </p>
          <Link
            to="/messages"
            className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
