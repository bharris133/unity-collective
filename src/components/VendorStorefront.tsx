import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Mail, Globe, Star, ShoppingCart, Search, Filter } from 'lucide-react';

// Local mock interfaces — will be replaced with Vendor/Product types when Firestore is wired
interface MockVendor {
  id: string;
  businessName: string;
  description: string;
  category: string;
  location: string;
  contact: { email: string; phone?: string; website?: string };
  verified: boolean;
  rating: number;
  reviewCount: number;
  foundingMember?: boolean;
}

interface MockProduct {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
}

const mockVendors: Record<string, MockVendor> = {
  'vendor-1': {
    id: 'vendor-1',
    businessName: 'Afrocentric Books & Gifts',
    description: 'Premier destination for African-American literature, cultural artifacts, and educational materials. Supporting Black authors and artists since 2010.',
    category: 'Retail',
    location: 'Atlanta, GA',
    contact: { email: 'contact@afrocentricbooks.com', phone: '(555) 123-4567', website: 'https://afrocentricbooks.com' },
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    foundingMember: true,
  },
  'vendor-2': {
    id: 'vendor-2',
    businessName: 'Soul Food Kitchen',
    description: 'Authentic soul food restaurant serving traditional recipes passed down through generations. Catering available for events.',
    category: 'Food & Beverage',
    location: 'Chicago, IL',
    contact: { email: 'info@soulfoodkitchen.com', phone: '(555) 234-5678' },
    verified: true,
    rating: 4.9,
    reviewCount: 203,
  },
};

const mockProducts: MockProduct[] = [
  { id: 'prod-1', vendorId: 'vendor-1', name: 'The Autobiography of Malcolm X', description: 'Classic autobiography detailing the life and transformation of Malcolm X, as told to Alex Haley.', price: 1899, category: 'Books', images: ['/api/placeholder/400/400'], inStock: true, featured: true },
  { id: 'prod-2', vendorId: 'vendor-1', name: 'African Art Print Collection', description: 'Set of 5 beautiful prints featuring traditional African art and symbolism. Perfect for home or office.', price: 4999, category: 'Art & Decor', images: ['/api/placeholder/400/400'], inStock: true },
  { id: 'prod-3', vendorId: 'vendor-1', name: 'Black History Educational Cards', description: 'Interactive flashcards featuring important figures and events in Black history. Great for students.', price: 1299, category: 'Education', images: ['/api/placeholder/400/400'], inStock: true },
  { id: 'prod-4', vendorId: 'vendor-1', name: 'Kwanzaa Celebration Set', description: 'Complete Kwanzaa celebration kit including kinara, candles, and educational materials.', price: 5999, category: 'Cultural Items', images: ['/api/placeholder/400/400'], inStock: true, featured: true },
];

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const VendorStorefront: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<MockVendor | null>(null);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with Firestore query
        setVendor(vendorId ? mockVendors[vendorId] ?? null : null);
        setProducts(mockProducts.filter(p => p.vendorId === vendorId));
      } catch (err) {
        console.error('Error fetching vendor data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [vendorId]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      (selectedCategory === 'all' || p.category === selectedCategory);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading vendor storefront...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/business-directory')} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Back to Business Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div className="bg-gradient-to-r from-red-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Store className="h-10 w-10" />
                <div>
                  <h1 className="text-4xl font-bold">{vendor.businessName}</h1>
                  {vendor.foundingMember && (
                    <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                      Founding Member
                    </span>
                  )}
                </div>
              </div>
              <p className="text-lg text-white/90 mb-6 max-w-3xl">{vendor.description}</p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{vendor.location}</span></div>
                {vendor.contact.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{vendor.contact.phone}</span></div>}
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{vendor.contact.email}</span></div>
                {vendor.contact.website && (
                  <a href={vendor.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Globe className="h-4 w-4" /><span>Visit Website</span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} />
                ))}
                <span className="text-white/90">{vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)</span>
              </div>
            </div>
            {vendor.verified && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-400 rounded-full" />
                  <span className="text-sm font-semibold">Verified Business</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filter criteria.' : "This vendor hasn't added any products yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link key={product.id} to={`/products/${product.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square bg-gray-200 relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  {product.featured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">Featured</span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                    <button
                      onClick={e => { e.preventDefault(); console.log('Add to cart:', product.id); }}
                      disabled={!product.inStock}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorStorefront;
