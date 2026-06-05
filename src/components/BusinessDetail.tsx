import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Mail, MapPin, Phone, Star } from 'lucide-react';
import { businessService, productService } from '../services';
import { formatPrice } from '../utils/formatPrice';
import { useMarketplace } from '../contexts/MarketplaceContext';
import type { Business } from '../data/mockBusinesses';
import type { Product } from '../data/mockProducts';


function BusinessDetail() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [similarBusinesses, setSimilarBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useMarketplace();

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        setLoading(true);

        const businessData = await businessService.getById(parseInt(businessId ?? '0'));
        setBusiness(businessData);

        if (businessData) {
          const similar = await businessService.getByCategory(businessData.category);
          setSimilarBusinesses(
            similar
              .filter((b: Business) => b.id !== businessData.id)
              .slice(0, 3)
          );

          if (businessData.businessId) {
            const businessProducts = await productService.getByBusinessId(businessData.businessId);
            setProducts(businessProducts);
          }
        }
      } catch (error) {
        console.error('Error loading business details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading business details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#111111] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Business Not Found</h2>
            <p className="text-gray-400 mb-6">The business you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/directory')}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/directory')}
          className="inline-flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Directory
        </button>

        {/* Business Header */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl mb-8 overflow-hidden">
          <div className="aspect-[21/9] bg-[#2A2A2A] overflow-hidden">
            {business.image && (
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                {/* Business Name + Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-white">{business.name}</h1>
                  {business.verified && (
                    <div className="flex items-center gap-1 bg-[#228B22]/20 border border-[#228B22]/40 rounded-full px-3 py-1">
                      <CheckCircle size={16} className="text-[#228B22]" />
                      <span className="text-xs font-semibold text-[#228B22]">Verified</span>
                    </div>
                  )}
                  {business.isBlackOwned && (
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 border"
                      style={{
                        background: 'linear-gradient(135deg, #CC0000 0%, #1A1A1A 50%, #228B22 100%)',
                        borderColor: '#D4AF37',
                      }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>✦ Black-Owned</span>
                    </div>
                  )}
                </div>

                {/* Category + Rating */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#2A2A2A] border border-[#3A3A3A] text-gray-300 text-sm rounded-full px-3 py-1">
                    {business.category}
                  </span>
                  <div className="flex items-center bg-[#2A2A2A] border border-[#3A3A3A] rounded-full px-3 py-1">
                    <Star size={16} className="text-[#D4AF37] fill-current mr-1" />
                    <span className="text-sm font-semibold text-white">{business.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">(125 reviews)</span>
                  </div>
                </div>

                {/* Location / Owner / Since */}
                <div className="space-y-1.5 text-gray-400">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-red-500" />
                    <span>{business.location}</span>
                  </div>
                  {business.owner && (
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-300 mr-2">Owner:</span>
                      <span>{business.owner}</span>
                    </div>
                  )}
                  {business.since && (
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-300 mr-2">Established:</span>
                      <span>{business.since}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#228B22] hover:bg-[#1a6b1a] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                )}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="inline-flex items-center justify-center gap-2 border border-[#3A3A3A] text-gray-300 hover:bg-[#2A2A2A] hover:text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-[#3A3A3A] text-gray-300 hover:bg-[#2A2A2A] hover:text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">
                {business.longDescription || business.description}
              </p>
            </div>

            {/* Products Section */}
            {products.length > 0 && (
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-4 hover:border-red-600 transition-colors"
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-white mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#D4AF37]">{formatPrice(product.price)}</span>
                        <button
                          onClick={() => addToCart(product as any)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            {business.services && business.services.length > 0 && (
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg"
                    >
                      <CheckCircle size={16} className="text-[#228B22] mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                {business.phone && (
                  <div className="flex items-start">
                    <Phone size={16} className="mr-3 mt-0.5 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-[#D4AF37] hover:underline text-sm">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-start">
                    <Mail size={16} className="mr-3 mt-0.5 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${business.email}`} className="text-[#D4AF37] hover:underline break-all text-sm">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-start">
                    <Globe size={16} className="mr-3 mt-0.5 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D4AF37] hover:underline break-all text-sm"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
                {business.location && (
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-3 mt-0.5 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-gray-300 text-sm">{business.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Businesses */}
            {similarBusinesses.length > 0 && (
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Similar Businesses</h2>
                <div className="space-y-3">
                  {similarBusinesses.map((similar) => (
                    <Link
                      key={similar.id}
                      to={`/directory/${similar.id}`}
                      className="block p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg hover:border-red-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white text-sm">{similar.name}</h4>
                        <div className="flex items-center">
                          <Star size={12} className="text-[#D4AF37] fill-current mr-1" />
                          <span className="text-xs text-gray-400">{similar.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{similar.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetail;
