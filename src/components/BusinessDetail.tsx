import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Mail, MapPin, Phone, Star } from 'lucide-react';
import { businessService, productService } from '../services';
import { formatPrice } from '../utils/formatPrice';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';

const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
};

function BusinessDetail() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [similarBusinesses, setSimilarBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useMarketplace();

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        setLoading(true);
        
        // Load the specific business
        const businessData = await businessService.getById(parseInt(businessId));
        setBusiness(businessData);
        
        // Load similar businesses (same category)
        if (businessData) {
          const similar = await businessService.getByCategory(businessData.category);
          // Filter out the current business and limit to 3
          setSimilarBusinesses(
            similar
              .filter(b => b.id !== businessData.id)
              .slice(0, 3)
          );
          
          // Load products if business has businessId
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
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading business details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Business Not Found</h2>
            <p className="text-gray-600 mb-6">The business you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/directory')} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft size={16} className="mr-2" />
              Back to Directory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/directory')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Directory
        </Button>

        {/* Business Header */}
        <Card className="mb-8">
          <div className="aspect-[21/9] bg-gray-200 rounded-t-lg overflow-hidden">
            {business.image && (
              <img 
                src={business.image} 
                alt={business.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <CardTitle className="text-3xl">{business.name}</CardTitle>
                  {business.verified && (
                    <CheckCircle size={24} className="ml-3 text-green-600" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-base">
                    {business.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-lg font-semibold">{business.rating}</span>
                    <span className="text-gray-600 ml-1">(125 reviews)</span>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    <span>{business.location}</span>
                  </div>
                  {business.owner && (
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">Owner:</span>
                      <span>{business.owner}</span>
                    </div>
                  )}
                  {business.since && (
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">Established:</span>
                      <span>{business.since}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                {business.phone && (
                  <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <a href={`tel:${business.phone}`}>
                      <Phone size={16} className="mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}
                {business.email && (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${business.email}`}>
                      <Mail size={16} className="mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {business.website && (
                  <Button variant="outline" asChild>
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      <Globe size={16} className="mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {business.longDescription || business.description}
                </p>
              </CardContent>
            </Card>

            {/* Products Section */}
            {products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {product.image && product.image[0] && (
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Section */}
            {business.services && business.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {business.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle size={18} className="text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.phone && (
                  <div className="flex items-start">
                    <Phone size={18} className="mr-3 mt-0.5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-start">
                    <Mail size={18} className="mr-3 mt-0.5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline break-all">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-start">
                    <Globe size={18} className="mr-3 mt-0.5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
                {business.location && (
                  <div className="flex items-start">
                    <MapPin size={18} className="mr-3 mt-0.5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{business.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Similar Businesses */}
            {similarBusinesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Businesses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {similarBusinesses.map((similar) => (
                    <Link
                      key={similar.id}
                      to={`/directory/${similar.id}`}
                      className="block p-3 border rounded-lg hover:border-red-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{similar.name}</h4>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{similar.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{similar.description}</p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetail;
