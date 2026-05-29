import type { User } from '../types/User';

/**
 * Mock users for testing different user types and authentication scenarios
 *
 * All users conform exactly to the User interface so that downstream
 * components (AdminPanel, MemberDashboard, etc.) never receive undefined
 * for required fields when reading from localStorage in mock mode.
 *
 * User Types:
 * - regularUser  : Standard community member (buyer)
 * - vendorUser   : Business owner with marketplace presence
 * - adminUser    : Platform administrator (isAdmin: true)
 * - regularUser2 : Second regular member for multi-user testing
 * - vendorUser2  : Second vendor for multi-vendor testing
 */

export const mockUsers: Record<string, User & { password: string }> = {
  // ── Regular User ────────────────────────────────────────────────────────────
  regularUser: {
    uid: 'mock-user-001',
    email: 'john.doe@example.com',
    password: 'password123',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'buyer',
    businessOwner: false,
    businessName: '',
    location: '123 Main St, Unity City, UC 12345',
    interests: ['community', 'education'],
    favorites: [],
    orderHistory: [],
    joinedAt: new Date('2024-01-15').toISOString(),
    isAdmin: false,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    bio: 'Community member passionate about supporting Black-owned businesses.',
    phone: '(555) 123-4567',
    website: '',
  },

  // ── Vendor User ─────────────────────────────────────────────────────────────
  vendorUser: {
    uid: 'mock-vendor-001',
    email: 'sarah.johnson@greengarden.com',
    password: 'vendor123',
    displayName: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'vendor',
    businessOwner: true,
    businessName: 'Green Garden Organic Farm',
    vendorId: 'vendor-001',
    location: '456 Market St, Unity City, UC 12345',
    interests: ['organic farming', 'sustainability', 'community'],
    favorites: [],
    orderHistory: [],
    joinedAt: new Date('2023-06-10').toISOString(),
    isAdmin: false,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Organic farmer bringing fresh produce to the community.',
    phone: '(555) 234-5678',
    website: 'https://greengarden.example.com',
  },

  // ── Admin User ──────────────────────────────────────────────────────────────
  adminUser: {
    uid: 'mock-admin-001',
    email: 'admin@unitycollective.com',
    password: 'admin123',
    displayName: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    businessOwner: false,
    businessName: '',
    location: '789 Admin Blvd, Unity City, UC 12345',
    interests: ['platform management', 'community growth'],
    favorites: [],
    orderHistory: [],
    joinedAt: new Date('2023-01-01').toISOString(),
    isAdmin: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    bio: 'Platform administrator for Unity Collective.',
    phone: '(555) 999-0000',
    website: '',
  },

  // ── Regular User 2 ──────────────────────────────────────────────────────────
  regularUser2: {
    uid: 'mock-user-002',
    email: 'emily.chen@example.com',
    password: 'password123',
    displayName: 'Emily Chen',
    firstName: 'Emily',
    lastName: 'Chen',
    role: 'buyer',
    businessOwner: false,
    businessName: '',
    location: '321 Oak Ave, Unity City, UC 12345',
    interests: ['education', 'wellness'],
    favorites: [],
    orderHistory: [],
    joinedAt: new Date('2024-03-20').toISOString(),
    isAdmin: false,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    bio: 'Educator and community advocate.',
    phone: '(555) 345-6789',
    website: '',
  },

  // ── Vendor User 2 ───────────────────────────────────────────────────────────
  vendorUser2: {
    uid: 'mock-vendor-002',
    email: 'mike.rodriguez@techrepair.com',
    password: 'vendor123',
    displayName: 'Mike Rodriguez',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    role: 'vendor',
    businessOwner: true,
    businessName: 'Tech Repair Hub',
    vendorId: 'vendor-002',
    location: '654 Tech Lane, Unity City, UC 12345',
    interests: ['technology', 'entrepreneurship'],
    favorites: [],
    orderHistory: [],
    joinedAt: new Date('2023-09-15').toISOString(),
    isAdmin: false,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    bio: 'Tech repair specialist serving the community.',
    phone: '(555) 456-7890',
    website: 'https://techrepairhub.example.com',
  },
};

// Export individual users for easy access
export const {
  regularUser,
  vendorUser,
  adminUser,
  regularUser2,
  vendorUser2,
} = mockUsers;

// Export user list for UI selection
export const mockUsersList = Object.entries(mockUsers).map(([key, user]) => ({
  key,
  label: `${user.displayName} (${user.role})`,
  email: user.email,
  role: user.role,
  user,
}));

// Helper to get user by email
export const getMockUserByEmail = (email: string) => {
  return Object.values(mockUsers).find(user => user.email === email);
};

// Helper to get user by uid
export const getMockUserByUid = (uid: string) => {
  return Object.values(mockUsers).find(user => user.uid === uid);
};
