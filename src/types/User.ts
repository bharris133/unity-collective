import { type Timestamp } from 'firebase/firestore';

export type UserRole = 'buyer' | 'vendor' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  businessOwner: boolean;
  businessName: string;
  vendorId?: string;
  location: string;
  interests: string[];
  favorites: string[]; // productIds
  orderHistory: string[]; // orderIds
  joinedAt: string | Timestamp;
  isAdmin: boolean;
  profilePicture: string;
  bio: string;
  phone: string;
  website: string;
}

export interface UserProfile extends Omit<User, 'uid'> {
  // Additional profile-specific fields if needed
}

export interface CreateUserData {
  email: string;
  password: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  businessOwner?: boolean;
  businessName?: string;
  location?: string;
  interests?: string[];
  bio?: string;
  phone?: string;
  website?: string;
}

export interface UpdateUserData extends Partial<Omit<User, 'uid' | 'email' | 'joinedAt'>> {
  // Partial update fields
}
