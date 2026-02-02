import React, { useState } from "react";
import {
  Search,
  Filter,
  ShoppingCart as ShoppingCartIcon,
  Star,
  Plus,
  Check,
} from "lucide-react";
import { useMarketplace } from "../contexts/MarketplaceContext";
import ShoppingCartModal from "./marketplace/ShoppingCart";
import CheckoutModal from "./marketplace/CheckoutModal";
import { formatPrice } from "../utils/formatPrice";

export default function MarketplacePage() {
  const { products, addToCart, getCartItemCount } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.businessName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product.id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product.id]: false });
    }, 2000);
  };

  const handleCheckoutSuccess = (orderDetails) => {
    setShowCheckout(false);
    setShowCart(false);
    alert(
      "Order placed successfully! Thank you for supporting Black-owned businesses.",
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Unity Marketplace
              </h1>
              <p className="text-gray-600 mt-1">
                Support Black-owned businesses and find quality products from
                our community
              </p>
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

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products, businesses, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
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
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/300/300";
                  }}
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  by {product.businessName}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                      addedToCart[product.id]
                        ? "bg-green-600 text-white"
                        : product.inStock
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {addedToCart[product.id] ? (
                      <>
                        <Check size={16} className="mr-1" />
                        Added!
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-1" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Shopping Cart Modal */}
      <ShoppingCartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
