import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import logoMain from './assets/logo_main.png';
import './App.css';

// Page components
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import EducationPage from './pages/EducationPage';
import MediaCenterPage from './pages/MediaCenterPage';
import AboutPage from './pages/AboutPage';
import PlatformShowcase from './pages/PlatformShowcase';
import OnboardingWizard from './pages/OnboardingWizard';
import MemberDashboard from './pages/MemberDashboard';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Components
import Navigation from './components/Navigation';
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
import { DevMockUserSwitcher } from './components/DevMockUserSwitcher';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={logoMain} alt="Unity Collective" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">[Unity Collective]</span>
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
          <p className="text-gray-400">© 2025 [Unity Collective]. All rights reserved. Built with pride for our community.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
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
                  <Route path="/showcase" element={<PlatformShowcase />} />
                  <Route path="/onboarding" element={<OnboardingWizard />} />
                  <Route path="/dashboard" element={<MemberDashboard />} />
                  <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
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
