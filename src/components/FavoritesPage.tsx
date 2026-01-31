import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Store, Package, ShoppingCart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

export const FavoritesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { favoriteVendors, favoriteProducts, toggleFavoriteVendor, toggleFavoriteProduct } = useFavorites();
  const [activeTab, setActiveTab] = useState<'vendors' | 'products'>('vendors');

  // Mock data (will be replaced with Firestore queries)
  const mockVendors = [
    {
      id: '1',
      name: 'Soul Food Kitchen',
      category: 'Food & Beverage',
      rating: 4.8,
      reviewCount: 124,
      image: '/api/placeholder/400/300',
    },
    {
      id: '2',
      name: 'Afrocentric Designs',
      category: 'Art & Design',
      rating: 4.9,
      reviewCount: 89,
      image: '/api/placeholder/400/300',
    },
  ];

  const mockProducts = [
    {
      id: '1',
      name: 'Handcrafted Kente Cloth',
      vendorName: 'Afrocentric Designs',
      price: 12999,
      image: '/api/placeholder/400/300',
      inStock: true,
    },
    {
      id: '2',
      name: 'Organic Shea Butter',
      vendorName: 'Natural Beauty Co',
      price: 1999,
      image: '/api/placeholder/400/300',
      inStock: true,
    },
  ];

  const favoriteVendorsList = mockVendors.filter(v => favoriteVendors.includes(v.id));
  const favoriteProductsList = mockProducts.filter(p => favoriteProducts.includes(p.id));

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view favorites</h2>
          <p className="text-gray-600 mb-6">Create an account to save your favorite vendors and products</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">Vendors and products you've saved for later</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'vendors'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Store className="h-5 w-5" />
                Vendors ({favoriteVendorsList.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'products'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="h-5 w-5" />
                Products ({favoriteProductsList.length})
              </div>
            </button>
          </div>
        </div>

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div>
            {favoriteVendorsList.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorite vendors yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring and save vendors you love
                </p>
                <Link
                  to="/directory"
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Browse Vendors
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteVendorsList.map((vendor) => (
                  <div key={vendor.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="relative h-48">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleFavoriteVendor(vendor.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                      >
                        <Heart className="h-5 w-5 text-red-600 fill-current" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{vendor.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{vendor.category}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold text-gray-900">{vendor.rating}</span>
                          <span className="text-sm text-gray-600">({vendor.reviewCount})</span>
                        </div>
                      </div>
                      <Link
                        to={`/vendors/${vendor.id}`}
                        className="block w-full px-4 py-2 bg-red-600 text-white text-center rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Visit Store
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {favoriteProductsList.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorite products yet</h3>
                <p className="text-gray-600 mb-6">
                  Start shopping and save products you're interested in
                </p>
                <Link
                  to="/marketplace"
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProductsList.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="relative h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleFavoriteProduct(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                      >
                        <Heart className="h-5 w-5 text-red-600 fill-current" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.vendorName}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                        {product.inStock ? (
                          <span className="text-sm text-green-600 font-semibold">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-center rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          View
                        </Link>
                        <button
                          disabled={!product.inStock}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
