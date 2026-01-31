import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Users, 
  Building, 
  ShoppingCart as ShoppingCartIcon, 
  GraduationCap, 
  PlayCircle, 
  Info,
  Star,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Target,
  Mic,
  Mail,
  User,
  LogOut,
  Settings,
  Search,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Globe,
  Briefcase,
  BookOpen,
  Phone,
  Play,
  Clock
} from 'lucide-react';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';

// Import navigation component
import Navigation from './components/Navigation';

// Import page components
import MarketplacePage from './components/MarketplacePage';
import AdminPanel from './components/admin/AdminPanel';
import VendorStorefront from './components/VendorStorefront';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import OffersPage from './components/OffersPage';
import CreateOffer from './components/CreateOffer';
import MessagesPage from './components/MessagesPage';
import FavoritesPage from './components/FavoritesPage';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Import hooks
import { useAuth } from './contexts/AuthContext';
import { useMarketplace } from './contexts/MarketplaceContext';

// Import UI components
import { Button } from './components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Badge } from './components/ui/badge.jsx';
import { Input } from './components/ui/input.jsx';
import { Textarea } from './components/ui/textarea.jsx';

// Import assets
import logoMain from './assets/logo_main.png';
import heroBanner from './assets/hero_banner.png';
import businessDirectoryIcon from './assets/business_directory_icon.png';
import communityHubBanner from './assets/community_hub_banner.png';

import './App.css';

// Custom Pan-African color scheme
const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
};

// Sample data
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

// Homepage component
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

// Other page components (simplified for now)
function CommunityPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Community Hub
          </h1>
          <p className="text-xl text-gray-600">
            Connect, collaborate, and build together as one unified community
          </p>
        </div>

        {/* Hero Banner */}
        <div 
          className="relative h-64 rounded-lg mb-12 flex items-center justify-center text-white bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${communityBanner})`
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Building Stronger Communities Together</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              Join Discussion
            </Button>
          </div>
        </div>

        {/* Community Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: MessageCircle,
              title: "Discussion Forums",
              description: "Engage in meaningful conversations about community issues and opportunities",
              color: colors.red
            },
            {
              icon: MapPin,
              title: "Local Chapters",
              description: "Find and connect with Unity Collective members in your area",
              color: colors.green
            },
            {
              icon: Users,
              title: "Mentorship Program",
              description: "Connect with experienced community leaders and entrepreneurs",
              color: colors.gold
            },
            {
              icon: BookOpen,
              title: "Resource Library",
              description: "Access educational materials, guides, and community resources",
              color: colors.black
            },
            {
              icon: Calendar,
              title: "Event Calendar",
              description: "Stay updated on community events, workshops, and networking opportunities",
              color: colors.red
            },
            {
              icon: Star,
              title: "Success Stories",
              description: "Celebrate achievements and learn from community success stories",
              color: colors.green
            }
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div 
                    className="p-3 rounded-full mr-4"
                    style={{ backgroundColor: feature.color + '20' }}
                  >
                    <feature.icon size={24} style={{ color: feature.color }} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  style={{ borderColor: feature.color, color: feature.color }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Business Services', 'Food & Beverage', 'Technology', 'Retail', 'Healthcare', 'Education'];

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

        {/* Business Listings */}
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
                <div className="flex gap-2">
                  <Button className="flex-1 bg-red-600 hover:bg-red-700">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone size={16} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Education & Resources
          </h1>
          <p className="text-xl text-gray-600">
            Empower yourself with knowledge and skills for community building and economic growth
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Educational content and resources coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function MediaCenterPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Media Center
          </h1>
          <p className="text-xl text-gray-600">
            Stay informed with community news, success stories, and empowering content
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Media content coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            About Unity Collective
          </h1>
          <p className="text-xl text-gray-600">
            Our mission, values, and commitment to Black community empowerment
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">About content coming soon...</p>
        </div>
      </div>
    </div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={logoMain} alt="Unity Collective" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Unity Collective</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering the Black community through unity and economic strength.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/community" className="text-gray-400 hover:text-white transition-colors">Community Hub</Link></li>
              <li><Link to="/directory" className="text-gray-400 hover:text-white transition-colors">Business Directory</Link></li>
              <li><Link to="/education" className="text-gray-400 hover:text-white transition-colors">Education</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">Media Center</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <p className="text-gray-400 mb-4">Follow our YouTube channel</p>
            <p className="text-gray-400 mb-4">Join us on TikTok</p>
            <p className="text-gray-400">Subscribe to our newsletter</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Unity Collective. All rights reserved. Built with pride for our community.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main App component with providers
function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <MarketplaceProvider>
        <Router>
          <div className="App">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/directory" element={<BusinessDirectoryPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/vendors/:vendorId" element={<VendorStorefront />} />
                <Route path="/products/:productId" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/offers/create" element={<CreateOffer />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/media" element={<MediaCenterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        </MarketplaceProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;

