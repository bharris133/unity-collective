import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface CheckoutProps {
  onClose?: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
  const { cart, clearCart } = useMarketplace();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!currentUser) {
      setError('You must be logged in to checkout');
      return;
    }

    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call Firebase Cloud Function to create Stripe checkout session
      const functions = getFunctions();
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');

      const result = await createCheckoutSession({
        cartItems: cart.items,
        successUrl: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cart`,
      });

      const data = result.data as { sessionId: string; url: string };

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate checkout. Please try again.');
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08); // 8% tax estimate
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Estimated Tax</span>
            <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span className="text-gray-900">Total</span>
            <span className="text-red-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <Lock className="h-5 w-5" />
          <p className="text-sm font-medium">Secure Checkout via Stripe</p>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Your payment information is encrypted and never stored on our servers.
        </p>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading || cart.items.length === 0}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Proceed to Payment
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Checkout;
