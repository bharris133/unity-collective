import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { offerService } from '../services';
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

function OfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [similarOffers, setSimilarOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOfferData = async () => {
      try {
        setLoading(true);
        
        // Load the specific offer
        const offerData = await offerService.getById(offerId);
        setOffer(offerData);
        
        // Load similar offers (same category, different id)
        if (offerData) {
          const allOffers = await offerService.getAll();
          const similar = allOffers
            .filter(o => o.category === offerData.category && o.id !== offerData.id)
            .slice(0, 3);
          setSimilarOffers(similar);
        }
      } catch (error) {
        console.error('Error loading offer details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOfferData();
  }, [offerId]);

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
        return <AlertCircle size={18} />;
      case 'in-progress':
        return <Clock size={18} />;
      case 'completed':
        return <CheckCircle size={18} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading offer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Offer Not Found</h2>
            <p className="text-gray-600 mb-6">The offer you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/offers')} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft size={16} className="mr-2" />
              Back to Offers
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
          onClick={() => navigate('/offers')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Offers
        </Button>

        {/* Offer Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <CardTitle className="text-3xl mr-3">{offer.title}</CardTitle>
                  <Badge className={`${getStatusColor(offer.status)} flex items-center gap-1`}>
                    {getStatusIcon(offer.status)}
                    {offer.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <User size={18} className="mr-2" />
                    <span>{offer.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    <span>Posted {new Date(offer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={18} className="mr-2" />
                    <span>{offer.responses} responses</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-base">
                  {offer.category}
                </Badge>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <Button className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
                  <MessageCircle size={16} className="mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {offer.longDescription || offer.description}
                </p>
              </CardContent>
            </Card>

            {/* Skills Offered */}
            {offer.skills && offer.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills / Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {offer.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-base px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Offer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Offer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {offer.budget && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                    <p className="font-semibold text-gray-900">{offer.budget}</p>
                  </div>
                )}
                {offer.timeline && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Timeline</p>
                    <p className="font-semibold text-gray-900">{offer.timeline}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{offer.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge className={getStatusColor(offer.status)}>
                    {offer.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Interested?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Send a message to {offer.userName} to discuss this opportunity.
                </p>
                <Link to="/messages">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle size={16} className="mr-2" />
                    Start Conversation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Similar Offers */}
            {similarOffers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Offers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {similarOffers.map((similar) => (
                    <Link
                      key={similar.id}
                      to={`/offers/${similar.id}`}
                      className="block p-3 border rounded-lg hover:border-red-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{similar.title}</h4>
                        <Badge className={`${getStatusColor(similar.status)} text-xs ml-2`}>
                          {similar.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{similar.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageCircle size={12} className="mr-1" />
                        {similar.responses} responses
                      </div>
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

export default OfferDetail;
