import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Store, MapPin, Globe, Star, ShoppingCart, Search, Filter } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getOnboardingState } from '../services/onboardingService';
import { productService } from '../services/productService';
import type { OnboardingState } from '../data/mockOnboarding';
import type { Product } from '../types/Product';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/** Fields from businesses/{uid} that override onboarding data */
interface BusinessOverride {
  businessName?: string;
  description?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  category?: string;
  foundingMember?: boolean;
}

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const VendorStorefront: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();

  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [override, setOverride] = useState<BusinessOverride | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Load onboarding data (base source of truth)
        const ob = await getOnboardingState(vendorId);
        setOnboarding(ob);

        // Load businesses override doc (if it exists)
        if (!USE_MOCK_DATA) {
          const overrideSnap = await getDoc(doc(db, 'businesses', vendorId));
          if (overrideSnap.exists()) {
            setOverride(overrideSnap.data() as BusinessOverride);
          }
        }

        // Load real products for this vendor
        const prods = await productService.getByBusinessId(vendorId);
        setProducts(prods);
      } catch (err) {
        console.error('Error fetching vendor storefront data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  // Merge: override fields win over onboarding fields
  const bp = onboarding?.businessProfile;
  const businessName = override?.businessName ?? bp?.businessName ?? '';
  const description = override?.description ?? bp?.description ?? '';
  const location = override?.location ?? bp?.location ?? '';
  const website = override?.website ?? bp?.website ?? '';
  const category = override?.category ?? bp?.category ?? '';
  const logoUrl = override?.logoUrl ?? null;
  const isVerified = onboarding?.verificationStatus === 'verified';
  const isFoundingMember = override?.foundingMember ?? false;

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      (selectedCategory === 'all' || p.category === selectedCategory)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto" />
          <p className="mt-4 text-[#888888]">Loading storefront...</p>
        </div>
      </div>
    );
  }

  if (!onboarding || !bp) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-[#555555] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Store Not Found</h2>
          <p className="text-[#888888] mb-6">This store doesn't exist or hasn't been set up yet.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-[#CC0000] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-[#CC0000] via-[#1A1A1A] to-[#228B22] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {logoUrl ? (
                  <img src={logoUrl} alt={businessName} className="h-16 w-16 rounded-full object-cover border-2 border-[#D4AF37]" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center">
                    <Store className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white">{businessName}</h1>
                  <span className="text-[#D4AF37] text-sm font-medium">{category}</span>
                  {isFoundingMember && (
                    <span className="ml-3 inline-block bg-[#D4AF37] text-[#111111] text-xs font-bold px-3 py-1 rounded-full">
                      Founding Member
                    </span>
                  )}
                </div>
              </div>

              <p className="text-white/80 text-base mb-6 max-w-3xl leading-relaxed">{description}</p>

              <div className="flex flex-wrap gap-5 text-sm text-white/70">
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    <span>{location}</span>
                  </div>
                )}
                {website && (
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
                  >
                    <Globe className="h-4 w-4 text-[#D4AF37]" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            {isVerified && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-[#228B22] rounded-full" />
                  <span className="text-sm font-semibold text-white">Verified Business</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#555555]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E1E1E] border border-[#2A2A2A] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder-[#555555]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#888888]" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-[#1E1E1E] border border-[#2A2A2A] text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-[#333333] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-[#888888]">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter.'
                : "This store hasn't added any products yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link
                key={product.productId}
                to={`/products/${product.productId}`}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/10"
              >
                <div className="aspect-square bg-[#2A2A2A] relative">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-12 w-12 text-[#444444]" />
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg font-semibold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-[#888888] mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#D4AF37]">{formatPrice(product.price)}</span>
                    <button
                      onClick={e => { e.preventDefault(); }}
                      disabled={!product.inStock}
                      className="bg-[#228B22] text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:bg-[#333333] disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Rating placeholder — will be replaced with real reviews when review system is built */}
        {products.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2 text-[#888888]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-[#333333]" />
              ))}
              <span className="text-sm">Reviews coming soon</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorStorefront;
