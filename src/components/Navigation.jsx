import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart as ShoppingCartIcon, 
  User,
  LogOut,
  Settings,
  ChevronDown,
  MessageCircle,
  Gift,
  Heart,
  Package,
  Store
} from 'lucide-react';

// Import contexts
import { useAuth } from '../contexts/AuthContext';
import { useMarketplace } from '../contexts/MarketplaceContext';

// Import authentication components
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';

// Import UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Import assets
import logoMain from '../assets/logo_main.png';

// Custom Pan-African color scheme
const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
};

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const { getCartItemCount } = useMarketplace();
  const location = useLocation();

  // Main navigation items (public)
  const mainNavigation = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Business Directory', path: '/directory' },
    { name: 'Community Hub', path: '/community' },
    { name: 'Education', path: '/education' },
    { name: 'About', path: '/about' }
  ];

  // Resources dropdown items
  const resourcesItems = [
    { name: 'Articles', path: '/resources/articles' },
    { name: 'Videos', path: '/resources/videos' },
    { name: 'Media Center', path: '/media' },
    { name: 'Press & Updates', path: '/resources/press' },
    { name: 'FAQ', path: '/resources/faq' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Check if user is a vendor
  const isVendor = userProfile?.role === 'vendor' || userProfile?.businessOwner;

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={logoMain} alt="Unity Collective" className="h-10 w-10 mr-2" />
                <span className="text-xl font-bold" style={{ color: colors.black }}>
                  Unity Collective
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-gray-700 hover:text-white hover:bg-red-500'
                  }`}
                  style={{
                    backgroundColor: location.pathname === item.path ? colors.red : 'transparent'
                  }}
                >
                  {item.name}
                </Link>
              ))}

              {/* Resources Dropdown */}
              <DropdownMenu open={showResourcesDropdown} onOpenChange={setShowResourcesDropdown}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-white hover:bg-red-500 transition-all duration-200"
                  >
                    Resources
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {resourcesItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.path}
                        className="w-full cursor-pointer"
                        onClick={() => setShowResourcesDropdown(false)}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <>
                  {/* Cart Icon */}
                  <Link
                    to="/marketplace"
                    className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                    title="Shopping Cart"
                  >
                    <ShoppingCartIcon size={20} />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {getCartItemCount()}
                      </span>
                    )}
                  </Link>

                  {/* Messages Icon (if buyer) */}
                  {!isVendor && (
                    <Link
                      to="/messages"
                      className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                      title="Messages"
                    >
                      <MessageCircle size={20} />
                      {/* Badge for unread messages */}
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">3</span>
                    </Link>
                  )}

                  {/* Offers Icon (if buyer) */}
                  {!isVendor && (
                    <Link
                      to="/offers"
                      className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                      title="Offers & Barter"
                    >
                      <Gift size={20} />
                    </Link>
                  )}

                  {/* My Store Button (if vendor) */}
                  {isVendor && (
                    <Link
                      to={`/vendors/${userProfile?.vendorId || 'my-store'}`}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      <Store size={16} className="mr-1" />
                      My Store
                    </Link>
                  )}

                  {/* User Avatar Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100"
                    >
                      <User size={20} />
                      <span className="text-sm font-medium">
                        {userProfile?.firstName || currentUser.displayName || 'User'}
                      </span>
                      <ChevronDown size={16} />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} className="inline mr-2" />
                          Profile
                        </Link>
                        
                        {isVendor ? (
                          <>
                            <Link
                              to={`/vendors/${userProfile?.vendorId || 'my-store'}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Store size={16} className="inline mr-2" />
                              My Store
                            </Link>
                            <Link
                              to="/vendor/products"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Package size={16} className="inline mr-2" />
                              Products & Listings
                            </Link>
                            <Link
                              to="/vendor/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Package size={16} className="inline mr-2" />
                              Orders
                            </Link>
                            <Link
                              to="/vendor/settings"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings size={16} className="inline mr-2" />
                              Store Settings
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Package size={16} className="inline mr-2" />
                              Orders
                            </Link>
                            <Link
                              to="/favorites"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Heart size={16} className="inline mr-2" />
                              Favorites
                            </Link>
                          </>
                        )}

                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} className="inline mr-2" />
                          Settings
                        </Link>

                        {userProfile?.isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings size={16} className="inline mr-2" />
                            Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200"
                        >
                          <LogOut size={16} className="inline mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Join Our Community
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-red-600 transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                {/* Main nav items */}
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-white bg-red-600'
                        : 'text-gray-700 hover:text-white hover:bg-red-500'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Resources section */}
                <div className="pt-2 pb-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Resources
                  </div>
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* User actions (mobile) */}
                {currentUser ? (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">
                      {userProfile?.firstName || currentUser.displayName || 'User'}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {isVendor ? (
                      <>
                        <Link
                          to={`/vendors/${userProfile?.vendorId || 'my-store'}`}
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Store
                        </Link>
                        <Link
                          to="/vendor/products"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Products & Listings
                        </Link>
                        <Link
                          to="/vendor/orders"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/orders"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/messages"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Messages
                        </Link>
                        <Link
                          to="/offers"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Offers
                        </Link>
                        <Link
                          to="/favorites"
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Favorites
                        </Link>
                      </>
                    )}
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    {userProfile?.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 pb-3 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors border border-gray-300 rounded-md"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowSignup(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center px-3 py-2 text-base font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Join Our Community
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}

export default Navigation;
