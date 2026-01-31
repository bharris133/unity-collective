import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
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

// Mock offers data - should match OffersPage
const mockOffers = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    title: 'Looking for Web Development Services',
    description: 'Need a professional website for my new business. Willing to trade graphic design services or pay.',
    longDescription: 'I am starting a new consulting business and need a professional website with a clean, modern design. The site should have 5-7 pages including home, about, services, portfolio, and contact. I am willing to trade my graphic design services (logo design, branding, marketing materials) or can discuss payment options. I have experience working with major brands and can provide a strong portfolio.',
    category: 'Services',
    status: 'open',
    responses: 3,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    budget: 'Trade or $1,500-$2,500',
    timeline: '4-6 weeks',
    skills: ['Graphic Design', 'Branding', 'Adobe Creative Suite']
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    title: 'Offering Catering Services',
    description: 'Professional catering for events. Looking for marketing help or photography services in exchange.',
    longDescription: 'I run a professional catering business specializing in soul food and Caribbean cuisine. I can cater events from 20-200 people. Looking for someone who can help with social media marketing, website updates, or professional food photography. I have 10+ years of experience and excellent references.',
    category: 'Food & Beverage',
    status: 'in-progress',
    responses: 5,
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-21'),
    budget: 'Trade only',
    timeline: 'Ongoing partnership',
    skills: ['Catering', 'Event Planning', 'Soul Food', 'Caribbean Cuisine']
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Marcus Williams',
    title: 'Need Logo Design',
    description: 'Starting a new clothing brand and need a professional logo. Can trade social media management or cash.',
    longDescription: 'I am launching a streetwear clothing brand called "Unity Threads" and need a bold, memorable logo that represents Black excellence and community. The logo should work well on clothing tags, website, and social media. I can offer social media management services (I manage accounts for 3 local businesses) or pay $500-$800.',
    category: 'Design',
    status: 'open',
    responses: 8,
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18'),
    budget: 'Trade or $500-$800',
    timeline: '2-3 weeks',
    skills: ['Social Media Management', 'Content Creation', 'Instagram Marketing']
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Lisa Brown',
    title: 'Photography Services Available',
    description: 'Professional photographer offering portrait and event photography. Open to trades or cash.',
    longDescription: 'Award-winning photographer with 8 years of experience specializing in portraits, events, and product photography. I have worked with numerous Black-owned businesses and community organizations. Looking to trade services or take on paid projects. My rates are competitive and I offer package deals.',
    category: 'Services',
    status: 'completed',
    responses: 2,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-22'),
    budget: 'Trade or $200-$500/session',
    timeline: 'Flexible',
    skills: ['Portrait Photography', 'Event Photography', 'Product Photography', 'Photo Editing']
  },
];

function OfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const offer = mockOffers.find(o => o.id === offerId);

  if (!offer) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Offer Not Found</h1>
            <p className="text-gray-600 mb-6">The offer you're looking for doesn't exist.</p>
            <Link to="/offers">
              <Button className="bg-red-600 hover:bg-red-700">
                Back to Offers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5" />;
      case 'in-progress':
        return <Clock className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleContactUser = () => {
    // Navigate to messages page with this user
    navigate('/messages', { state: { startConversation: offer.userName } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/offers')}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Offers
        </Button>

        {/* Offer Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
                    {offer.title}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    {offer.status}
                  </span>
                </div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {offer.category}
                </Badge>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{offer.userName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    Posted {offer.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle size={18} />
                <span className="font-medium">{offer.responses} responses</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: colors.black }}>
                Description
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {offer.longDescription}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Budget</h3>
                <p className="text-lg font-medium">{offer.budget}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Timeline</h3>
                <p className="text-lg font-medium">{offer.timeline}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status</h3>
                <p className="text-lg font-medium capitalize">{offer.status.replace('-', ' ')}</p>
              </div>
            </div>

            {/* Skills/Services */}
            {offer.skills && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3" style={{ color: colors.black }}>
                  Skills/Services Offered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {offer.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-base px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleContactUser}
              >
                <MessageCircle className="mr-2" size={18} />
                Send Message
              </Button>
              <Button variant="outline" className="flex-1">
                Save Offer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Similar Offers */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
            Similar Offers
          </h2>
          <div className="space-y-4">
            {mockOffers
              .filter(o => o.id !== offer.id && o.category === offer.category)
              .slice(0, 3)
              .map((similarOffer) => (
                <Link
                  key={similarOffer.id}
                  to={`/offers/${similarOffer.id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{similarOffer.title}</h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(similarOffer.status)}`}>
                      {getStatusIcon(similarOffer.status)}
                      {similarOffer.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{similarOffer.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">{similarOffer.userName}</span>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {similarOffer.responses}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferDetail;
