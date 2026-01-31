import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, MapPin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Input } from '../components/ui/input.jsx';
import heroBanner from '../assets/hero_banner.png';

const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
};

const featuredBusinesses = [
  {
    id: 1,
    name: "Sankofa Consulting",
    category: "Business Services",
    location: "Atlanta, GA",
    rating: 4.9,
    description: "Strategic business consulting for Black entrepreneurs",
    image: "/api/placeholder/300/200",
    verified: true
  },
  {
    id: 2,
    name: "Heritage Foods Market",
    category: "Food & Beverage",
    location: "Detroit, MI",
    rating: 4.8,
    description: "Authentic African and Caribbean cuisine and groceries",
    image: "/api/placeholder/300/200",
    verified: true
  },
  {
    id: 3,
    name: "Unity Tech Solutions",
    category: "Technology",
    location: "Oakland, CA",
    rating: 5.0,
    description: "Custom software development and IT services",
    image: "/api/placeholder/300/200",
    verified: true
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Economic Empowerment Webinar",
    date: "2025-08-25",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 234
  },
  {
    id: 2,
    title: "Black Business Networking Mixer",
    date: "2025-09-02",
    time: "6:00 PM EST",
    type: "In-Person",
    location: "Atlanta, GA",
    attendees: 89
  },
  {
    id: 3,
    title: "Financial Literacy Workshop",
    date: "2025-09-10",
    time: "2:00 PM EST",
    type: "Virtual",
    attendees: 156
  }
];

const communityStats = {
  members: "15,247",
  businesses: "3,892",
  events: "156",
  impact: "$2.3M"
};

function HomePage() {
  const [email, setEmail] = useState('');
  const { currentUser } = useAuth();

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! We\'ll keep you updated on community events and opportunities.');
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-white bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(204, 0, 0, 0.8) 0%, rgba(26, 26, 26, 0.8) 50%, rgba(34, 139, 34, 0.8) 100%), url(${heroBanner})`
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Empowering Our Community Through Unity and Economic Strength
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Building a stronger Black community through the five pillars: Unity, Economic Control, 
            Self-Sufficiency, Protection, and Control of Our Narrative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              {currentUser ? 'Explore Community' : 'Join Our Community'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
            >
              Explore Businesses
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: colors.red }}>
                {communityStats.members}
              </div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: colors.green }}>
                {communityStats.businesses}
              </div>
              <div className="text-gray-600">Black-Owned Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: colors.gold }}>
                {communityStats.events}
              </div>
              <div className="text-gray-600">Educational Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: colors.black }}>
                {communityStats.impact}
              </div>
              <div className="text-gray-600">Economic Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
              The Five Pillars of Community Empowerment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our foundation is built on five essential pillars that strengthen our community and 
              ensure our collective success and independence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Unity",
                description: "A scattered community is easily broken. We put aside divisions and recognize our shared destiny to stand strong against external pressures.",
                color: colors.red
              },
              {
                icon: TrendingUp,
                title: "Economic Control",
                description: "Support Black-owned businesses, keep money circulating within our community, and own land to ensure our future is not controlled by others.",
                color: colors.green
              },
              {
                icon: Target,
                title: "Self-Sufficiency",
                description: "Learn essential, practical skills like farming, trades, security, and first aid - necessities for survival when established systems collapse.",
                color: colors.gold
              },
              {
                icon: Shield,
                title: "Protection",
                description: "We cannot rely on external forces for safety. We must train, organize, and watch over our own neighborhoods to protect our people from harm.",
                color: colors.black
              },
              {
                icon: Mic,
                title: "Control of Our Narrative",
                description: "Build and support media that portrays our community with dignity and strength, preventing outsiders from twisting our story to justify oppression.",
                color: colors.red
              }
            ].map((pillar, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div 
                      className="p-3 rounded-full mr-4"
                      style={{ backgroundColor: pillar.color + '20' }}
                    >
                      <pillar.icon size={32} style={{ color: pillar.color }} />
                    </div>
                    <CardTitle style={{ color: colors.black }}>{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
                Featured Black-Owned Businesses
              </h2>
              <p className="text-xl text-gray-600">
                Discover and support businesses that strengthen our community
              </p>
            </div>
            <Link to="/directory">
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
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
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
              Upcoming Community Events
            </h2>
            <p className="text-xl text-gray-600">
              Join us for educational webinars, networking events, and community building activities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge 
                        variant={event.type === 'Virtual' ? 'default' : 'secondary'}
                        className="mb-2"
                      >
                        {event.type}
                      </Badge>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {event.attendees} attending
                    </span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Stay Connected with Our Community
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest updates on community events, business opportunities, and empowerment resources
          </p>
          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-black"
              required
            />
            <Button type="submit" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
