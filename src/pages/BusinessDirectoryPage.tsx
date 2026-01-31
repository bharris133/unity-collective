import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Globe, MapPin, Phone, Search, Star } from 'lucide-react';
import { businessService } from '../services';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Input } from '../components/ui/input.jsx';

const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
};

function BusinessDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load businesses from service
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        const data = await businessService.getAll();
        setBusinesses(data);
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBusinesses();
  }, []);

  // Get unique categories from businesses
  const categories = ['All', ...new Set(businesses.map(b => b.category))];

  // Filter businesses based on search and category
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Black Business Directory
          </h1>
          <p className="text-xl text-gray-600">
            Discover and support Black-owned businesses in your community
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No businesses found matching your criteria.</p>
          </div>
        ) : (
          /* Business Listings */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {business.image && (
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {business.name}
                        {business.verified && (
                          <CheckCircle size={16} className="ml-2 text-green-600" />
                        )}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {business.category}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{business.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{business.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin size={16} className="mr-1" />
                    {business.location}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/directory/${business.id}`} className="flex-1">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        View Details
                      </Button>
                    </Link>
                    {business.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${business.phone}`}>
                          <Phone size={16} />
                        </a>
                      </Button>
                    )}
                    {business.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={business.website} target="_blank" rel="noopener noreferrer">
                          <Globe size={16} />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDirectoryPage;
