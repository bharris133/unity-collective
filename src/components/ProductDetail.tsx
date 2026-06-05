import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Store, ArrowLeft, Heart, Share2, Check, AlertCircle } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';

// Local mock interfaces — will be replaced with Vendor/Product types when Firestore is wired
interface MockProduct {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
}

interface MockVendor {
  id: string;
  businessName: string;
  location: string;
  verified: boolean;
}

const mockProducts: Record<string, MockProduct> = {
  'prod-1': {
    id: 'prod-1',
    vendorId: 'vendor-1',
    name: 'The Autobiography of Malcolm X',
    description: "Classic autobiography detailing the life and transformation of Malcolm X, as told to Alex Haley. This powerful narrative chronicles Malcolm X's evolution from street hustler to national spokesman for the Nation of Islam, and finally to his own unique political and religious philosophy. A must-read for understanding American history and the civil rights movement.",
    price: 1899,
    category: 'Books',
    images: ['/api/placeholder/600/600', '/api/placeholder/600/600', '/api/placeholder/600/600'],
    inStock: true,
    stockQuantity: 45,
    featured: true,
  },
};

const mockVendors: Record<string, MockVendor> = {
  'vendor-1': { id: 'vendor-1', businessName: 'Afrocentric Books & Gifts', location: 'Atlanta, GA', verified: true },
};

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useMarketplace();

  const [product, setProduct] = useState<MockProduct | null>(null);
  const [vendor, setVendor] = useState<MockVendor | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with Firestore query
        const productData = productId ? mockProducts[productId] ?? null : null;
        setProduct(productData);
        if (productData?.vendorId) setVendor(mockVendors[productData.vendorId] ?? null);
      } catch (err) {
        console.error('Error fetching product data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartVendorId = cart.items.length > 0 ? cart.items[0].vendorId : null;
    if (cartVendorId && cartVendorId !== product.vendorId) {
      if (!window.confirm('Your cart contains items from another vendor. Would you like to clear your cart and start a new order?')) return;
      // TODO: Clear cart before adding new item
    }
    addToCart({ productId: product.id, name: product.name, price: product.price, images: product.images, vendorId: product.vendorId, inStock: product.inStock, category: product.category, description: product.description, stockQuantity: product.stockQuantity, tags: [], createdAt: '', updatedAt: '' });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/marketplace')} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="h-4 w-4" />Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <div className="aspect-square bg-gray-200">
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition ${selectedImage === index ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              {product.featured && (
                <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full mb-4">Featured Product</span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{product.category}</span>
              </div>
              <div className="text-4xl font-bold text-red-600 mb-6">{formatPrice(product.price)}</div>
              <p className="text-gray-600 mb-8">{product.description}</p>

              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">In Stock ({product.stockQuantity} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {product.inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition">-</button>
                    <input
                      type="number" min="1" max={product.stockQuantity} value={quantity}
                      onChange={e => setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center border border-gray-300 rounded-lg py-2"
                    />
                    <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition">+</button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addedToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${addedToCart ? 'bg-green-600 text-white' : product.inStock ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                >
                  {addedToCart ? <><Check className="h-5 w-5" />Added to Cart!</> : <><ShoppingCart className="h-5 w-5" />Add to Cart</>}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"><Heart className="h-5 w-5 text-gray-600" /></button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"><Share2 className="h-5 w-5 text-gray-600" /></button>
              </div>

              {vendor && (
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Sold By</h3>
                  <Link to={`/vendors/${vendor.id}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <Store className="h-10 w-10 text-red-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{vendor.businessName}</span>
                        {vendor.verified && <div className="h-2 w-2 bg-green-500 rounded-full" />}
                      </div>
                      <p className="text-sm text-gray-600">{vendor.location}</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
