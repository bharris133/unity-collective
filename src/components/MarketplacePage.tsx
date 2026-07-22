import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart as ShoppingCartIcon, Star, Plus, Check } from "lucide-react";
import { useMarketplace } from "../contexts/MarketplaceContext";
import { useAuth } from "../contexts/AuthContext";
import ShoppingCartModal from "./marketplace/ShoppingCart";
import CheckoutModal, { type CheckoutResult } from "./marketplace/CheckoutModal";
import { formatPrice } from "../utils/formatPrice";
import { orderService } from '../services/orderService';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Product } from "../types";

export default function MarketplacePage() {
  const { products, addToCart, getCartItemCount, getCartSubtotal, getCartTax, getCartShipping } = useMarketplace();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(p => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesSearch && (selectedCategory === "All" || p.category === selectedCategory);
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCart(prev => ({ ...prev, [product.productId]: true }));
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [product.productId]: false })), 2000);
  };

  const handleCheckoutSuccess = async (result: CheckoutResult) => {
    setShowCheckout(false);
    setShowCart(false);
    try {
      const subtotal = result.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const tax = Math.round(subtotal * 0.08);
      const total = subtotal + tax;
      const orderId = await orderService.createOrder({
        userId: currentUser?.uid ?? 'guest',
        vendorId: result.vendorId,
        items: result.items.map(i => ({
          productId: i.productId,
          name: i.name ?? '',
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        subtotal: getCartSubtotal(),
        tax: getCartTax(),
        shipping: getCartShipping(),
        platformFee: 0,
        total: result.amount,
        stripeSessionId: '',
        stripePaymentIntentId: result.paymentMethodId,
        shippingAddress: {
          fullName: `${result.shippingInfo.firstName} ${result.shippingInfo.lastName}`,
          addressLine1: result.shippingInfo.address,
          city: result.shippingInfo.city,
          state: result.shippingInfo.state,
          zipCode: result.shippingInfo.zipCode,
          country: result.shippingInfo.country,
          phone: result.shippingInfo.phone,
        },
      });
      navigate(`/order-success?orderId=${orderId}`);

      // Fire-and-forget: send order confirmation + vendor notification emails
      try {
        const functions = getFunctions();
        const sendEmails = httpsCallable(functions, 'sendOrderEmailsCallable');
        sendEmails({
          orderId,
          buyerEmail: result.shippingInfo.email,
          vendorId: result.vendorId,
          items: result.items.map(i => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            vendorId: i.vendorId ?? result.vendorId,
          })),
          subtotalCents: subtotal,
          totalCents: total,
        }).catch(err => console.warn('Email notification failed (non-blocking):', err));
      } catch (emailErr) {
        console.warn('Could not invoke email function:', emailErr);
      }
    } catch {
      navigate('/order-success');
    }
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Header */}
      <div className="bg-[#1A1A1A] shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Unity Marketplace</h1>
              <p className="text-gray-400 mt-1">Support Black-owned businesses and find quality products from our community</p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <ShoppingCartIcon size={20} className="mr-2" />
              Cart
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white focus:ring-2 focus:ring-red-500 focus:border-transparent">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-400 mb-6">
          Showing {filteredProducts.length} products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.productId} className="bg-[#1E1E1E] rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-white/8">
              <div className="aspect-square bg-[#2A2A2A] relative">
                <img
                  src={product.images?.[0] ?? "/api/placeholder/300/300"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = "/api/placeholder/300/300"; }}
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <span className="inline-block bg-[#2A2A2A] text-gray-300 text-xs px-2 py-1 rounded mb-2">{product.category}</span>
                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < 4 ? "text-yellow-400 fill-current" : "text-gray-600"} />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                      addedToCart[product.productId]
                        ? "bg-green-600 text-white"
                        : product.inStock
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {addedToCart[product.productId] ? (
                      <><Check size={16} className="mr-1" />Added!</>
                    ) : (
                      <><Plus size={16} className="mr-1" />Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search size={64} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <ShoppingCartModal isOpen={showCart} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />
      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} onSuccess={handleCheckoutSuccess} />
    </div>
  );
}
