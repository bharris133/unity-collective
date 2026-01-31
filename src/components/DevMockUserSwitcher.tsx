import { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { 
  isMockAuthEnabled, 
  setMockAuthEnabled, 
  switchMockUser, 
  getAvailableMockUsers,
  getCurrentMockUser
} from '../services/authService';
import { mockUsers } from '../data/mockUsers';

/**
 * Developer Mock User Switcher
 * 
 * A floating UI component for developers to:
 * - Enable/disable mock authentication
 * - Switch between different mock users
 * - See current authentication status
 * 
 * Only visible in development mode when mock data is enabled
 */

export function DevMockUserSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMockMode, setIsMockMode] = useState(isMockAuthEnabled());
  const [currentUser, setCurrentUser] = useState(getCurrentMockUser());
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = () => {
      setCurrentUser(getCurrentMockUser());
      setIsMockMode(isMockAuthEnabled());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggleMockMode = () => {
    const newMode = !isMockMode;
    setMockAuthEnabled(newMode);
    setIsMockMode(newMode);
    
    if (!newMode) {
      // Clear mock user when disabling mock mode
      switchMockUser(null);
      setCurrentUser(null);
    }
    
    // Reload page to apply changes
    window.location.reload();
  };

  const handleSwitchUser = (userKey: keyof typeof mockUsers) => {
    switchMockUser(userKey);
    setCurrentUser(getCurrentMockUser());
    setIsOpen(false);
    
    // Reload page to apply changes
    window.location.reload();
  };

  const handleSignOut = () => {
    switchMockUser(null);
    setCurrentUser(null);
    setIsOpen(false);
    
    // Reload page to apply changes
    window.location.reload();
  };

  // Only show in development with mock data enabled
  if (import.meta.env.PROD) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
          title="Open Mock User Switcher"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border-2 border-purple-500 w-80">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={18} />
          <span className="font-semibold text-sm">Mock Auth Control</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="hover:bg-purple-700 p-1 rounded transition-colors"
          title="Minimize"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Mock Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Mock Authentication</span>
          <button
            onClick={handleToggleMockMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isMockMode ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isMockMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {isMockMode && (
          <>
            {/* Current User Display */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-semibold text-gray-500 mb-1">Current User</div>
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={16} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {currentUser.displayName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={16} className="text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Not signed in</div>
              )}
            </div>

            {/* User Switcher */}
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                <span>Switch User</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="mt-2 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                  {getAvailableMockUsers().map((user) => (
                    <button
                      key={user.key}
                      onClick={() => handleSwitchUser(user.key as keyof typeof mockUsers)}
                      className={`w-full text-left px-3 py-2 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        currentUser?.email === user.email ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{user.label}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
              💡 <strong>Tip:</strong> Switching users will reload the page to apply changes.
            </div>
          </>
        )}

        {!isMockMode && (
          <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
            ⚠️ Mock authentication is disabled. Enable it to test with different user types.
          </div>
        )}
      </div>
    </div>
  );
}
