import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/formatPrice';

export default function ShoppingCart({ isOpen, onClose, onCheckout }) {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartSubtotal,
    getCartTax,
    getCartShipping,
    getCartGrandTotal
  } = useMarketplace();
  const { currentUser } = useAuth();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      alert('Please sign in to checkout');
      return;
    }
    onCheckout();
  };

  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <ShoppingBag className="mr-2 text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-center">
                Add some items from our marketplace to get started
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.image || '/api/placeholder/80/80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.businessName}</p>
                      <p className="text-lg font-semibold text-red-600">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(getCartSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>{formatPrice(getCartTax())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>
                      {getCartShipping() === 0 ? 'FREE' : formatPrice(getCartShipping())}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>{formatPrice(getCartGrandTotal())}</span>
                    </div>
                  </div>
                </div>

                {getCartSubtotal() < 5000 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Add {formatPrice(5000 - getCartSubtotal())} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex space-x-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-2 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
            {!currentUser && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Please sign in to complete your purchase
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

