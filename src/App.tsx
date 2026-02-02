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

// Import page components
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import EducationPage from './pages/EducationPage';
import MediaCenterPage from './pages/MediaCenterPage';
import AboutPage from './pages/AboutPage';

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
import BusinessDetail from './components/BusinessDetail';
import OfferDetail from './components/OfferDetail';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { DevMockUserSwitcher } from './components/DevMockUserSwitcher';

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


// Other page components (simplified for now)










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
                <Route path="/directory/:businessId" element={<BusinessDetail />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/vendors/:vendorId" element={<VendorStorefront />} />
                <Route path="/products/:productId" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/offers/:offerId" element={<OfferDetail />} />
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
            <DevMockUserSwitcher />
          </div>
        </Router>
        </MarketplaceProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;

