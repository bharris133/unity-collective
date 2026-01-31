import type { User } from '../types/User';

/**
 * Mock users for testing different user types and authentication scenarios
 * 
 * User Types:
 * - Regular User: Standard community member
 * - Vendor: Business owner with marketplace presence
 * - Admin: Platform administrator
 * - Guest: Unauthenticated user
 */

export const mockUsers: Record<string, User & { password: string; role: 'user' | 'vendor' | 'admin' }> = {
  // Regular User - Standard community member
  regularUser: {
    uid: 'mock-user-001',
    email: 'john.doe@example.com',
    password: 'password123',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    phoneNumber: '(555) 123-4567',
    address: '123 Main St, Unity City, UC 12345',
    role: 'user',
    isVendor: false,
    createdAt: new Date('2024-01-15').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },

  // Vendor User - Business owner
  vendorUser: {
    uid: 'mock-vendor-001',
    email: 'sarah.johnson@greengarden.com',
    password: 'vendor123',
    displayName: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    phoneNumber: '(555) 234-5678',
    address: '456 Market St, Unity City, UC 12345',
    role: 'vendor',
    isVendor: true,
    vendorId: 'vendor-001',
    businessName: 'Green Garden Organic Farm',
    createdAt: new Date('2023-06-10').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },

  // Admin User - Platform administrator
  adminUser: {
    uid: 'mock-admin-001',
    email: 'admin@unitycollective.com',
    password: 'admin123',
    displayName: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    phoneNumber: '(555) 999-0000',
    address: '789 Admin Blvd, Unity City, UC 12345',
    role: 'admin',
    isVendor: false,
    createdAt: new Date('2023-01-01').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },

  // Another Regular User
  regularUser2: {
    uid: 'mock-user-002',
    email: 'emily.chen@example.com',
    password: 'password123',
    displayName: 'Emily Chen',
    firstName: 'Emily',
    lastName: 'Chen',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    phoneNumber: '(555) 345-6789',
    address: '321 Oak Ave, Unity City, UC 12345',
    role: 'user',
    isVendor: false,
    createdAt: new Date('2024-03-20').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },

  // Another Vendor User
  vendorUser2: {
    uid: 'mock-vendor-002',
    email: 'mike.rodriguez@techrepair.com',
    password: 'vendor123',
    displayName: 'Mike Rodriguez',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    phoneNumber: '(555) 456-7890',
    address: '654 Tech Lane, Unity City, UC 12345',
    role: 'vendor',
    isVendor: true,
    vendorId: 'vendor-002',
    businessName: 'Tech Repair Hub',
    createdAt: new Date('2023-09-15').toISOString(),
    lastLoginAt: new Date().toISOString(),
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
