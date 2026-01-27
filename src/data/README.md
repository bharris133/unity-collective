# Mock Data Directory

This directory contains all centralized mock data used throughout the Unity Collective application for development, testing, and visual review purposes.

## Purpose

The mock data files in this directory allow the application to run completely standalone without requiring a live Firebase backend connection. This is ideal for:

- **Local Development**: Quickly iterate on UI/UX without backend dependencies
- **Visual Review**: Demonstrate the full application experience to stakeholders
- **Testing**: Provide consistent, predictable data for automated tests
- **Onboarding**: Help new developers understand the data structure

## Files

| File | Description | Usage |
|------|-------------|-------|
| `mockBusinesses.ts` | Black-owned business listings | Homepage, Business Directory |
| `mockEvents.ts` | Community events | Homepage, Events page |
| `mockProducts.ts` | Marketplace products | Marketplace, Product pages |
| `mockOffers.ts` | Community offers/barter listings | Offers page |
| `mockMessages.ts` | Message threads and conversations | Messages page |
| `mockStats.ts` | Community statistics | Homepage dashboard |
| `index.ts` | Central export for all mock data | Import convenience |

## Usage

Import mock data in your components:

```typescript
// Import specific data
import { mockBusinesses } from '@/data/mockBusinesses';
import { mockProducts } from '@/data/mockProducts';

// Or import everything
import { mockBusinesses, mockEvents, mockProducts } from '@/data';
```

## Data Structure

Each mock data file exports:
1. **TypeScript interfaces** defining the data structure
2. **Mock data arrays** with sample records

This ensures type safety and makes it easy to understand what fields are available.

## Replacing with Real Data

When you're ready to connect to Firebase:

1. Keep the interface definitions (they define your data schema)
2. Replace the mock data imports with Firebase queries
3. Update components to fetch from Firestore instead of importing mock data

Example:

```typescript
// Before (mock data)
import { mockBusinesses } from '@/data/mockBusinesses';
const businesses = mockBusinesses;

// After (Firebase)
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
const businessesSnapshot = await getDocs(collection(db, 'businesses'));
const businesses = businessesSnapshot.docs.map(doc => doc.data());
```

## Maintenance

When adding new features:
1. Add new mock data files following the existing pattern
2. Export them from `index.ts`
3. Update this README with the new file information
