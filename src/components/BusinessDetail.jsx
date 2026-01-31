import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Mail, MapPin, Phone, Star } from 'lucide-react';
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

// Mock data - should match the businesses in BusinessDirectoryPage
const allBusinesses = [
  {
    id: 1,
    name: "Sankofa Consulting",
    category: "Business Services",
    location: "Atlanta, GA",
    rating: 4.9,
    description: "Strategic business consulting for Black entrepreneurs",
    longDescription: "Sankofa Consulting provides comprehensive business strategy and consulting services specifically tailored for Black entrepreneurs and business owners. Our team of experienced consultants helps businesses develop growth strategies, improve operations, and achieve sustainable success.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Dr. Kwame Johnson",
    since: 2015,
    website: "https://sankofaconsulting.com",
    phone: "(404) 555-0123",
    email: "info@sankofaconsulting.com",
    services: ["Business Strategy", "Financial Planning", "Marketing Consulting", "Operations Management"]
  },
  {
    id: 2,
    name: "Heritage Foods Market",
    category: "Food & Beverage",
    location: "Detroit, MI",
    rating: 4.8,
    description: "Authentic African and Caribbean cuisine and groceries",
    longDescription: "Heritage Foods Market is your destination for authentic African and Caribbean ingredients, spices, and prepared foods. We source directly from local farmers and international suppliers to bring you the freshest and most authentic products.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Amara Williams",
    since: 2018,
    website: "https://heritagefoodsmarket.com",
    phone: "(313) 555-0456",
    email: "contact@heritagefoodsmarket.com",
    services: ["Grocery", "Catering", "Meal Prep", "Cooking Classes"]
  },
  {
    id: 3,
    name: "Unity Tech Solutions",
    category: "Technology",
    location: "Oakland, CA",
    rating: 5.0,
    description: "Custom software development and IT services",
    longDescription: "Unity Tech Solutions specializes in custom software development, web applications, mobile apps, and IT consulting services. We help businesses leverage technology to solve problems and achieve their goals.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Marcus Thompson",
    since: 2017,
    website: "https://unitytechsolutions.com",
    phone: "(510) 555-0789",
    email: "hello@unitytechsolutions.com",
    services: ["Web Development", "Mobile Apps", "IT Consulting", "Cloud Solutions"]
  }
];

function BusinessDetail() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const business = allBusinesses.find(b => b.id === parseInt(businessId));

  if (!business) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
            <p className="text-gray-600 mb-6">The business you're looking for doesn't exist.</p>
            <Link to="/directory">
              <Button className="bg-red-600 hover:bg-red-700">
                Back to Directory
              </Button>
            </Link>
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
          className="mb-6"
          onClick={() => navigate('/directory')}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Directory
        </Button>

        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="aspect-[21/9] bg-gray-200">
            <img 
              src={business.image} 
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <h1 className="text-4xl font-bold" style={{ color: colors.black }}>
                    {business.name}
                  </h1>
                  {business.verified && (
                    <CheckCircle size={24} className="ml-3 text-green-600" />
                  )}
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {business.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star size={20} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-lg font-medium">{business.rating}</span>
                    <span className="text-gray-500 ml-1">(128 reviews)</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  {business.location}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="bg-red-600 hover:bg-red-700">
                  Contact Business
                </Button>
                <Button variant="outline">
                  Add to Favorites
                </Button>
              </div>
            </div>

            {/* Business Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Owner</h3>
                <p className="text-lg">{business.owner}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Established</h3>
                <p className="text-lg">{business.since}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6 mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <a 
                  href={`tel:${business.phone}`}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone size={20} className="mr-3 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{business.phone}</p>
                  </div>
                </a>
                <a 
                  href={`mailto:${business.email}`}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail size={20} className="mr-3 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{business.email}</p>
                  </div>
                </a>
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Globe size={20} className="mr-3 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium">Visit Site</p>
                  </div>
                </a>
              </div>
            </div>

            {/* About Section */}
            <div className="border-t pt-6 mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
                About
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {business.longDescription}
              </p>
            </div>

            {/* Services Section */}
            {business.services && (
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
                  Services
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {business.services.map((service, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle size={18} className="mr-3 text-green-600" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Businesses */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
            Similar Businesses
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {allBusinesses
              .filter(b => b.id !== business.id && b.category === business.category)
              .slice(0, 3)
              .map((relatedBusiness) => (
                <Card key={relatedBusiness.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {relatedBusiness.name}
                      {relatedBusiness.verified && (
                        <CheckCircle size={16} className="ml-2 text-green-600" />
                      )}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 w-fit">
                      {relatedBusiness.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{relatedBusiness.description}</p>
                    <Link to={`/directory/${relatedBusiness.id}`}>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetail;
