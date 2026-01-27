export interface Offer {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'completed';
  responses: number;
  createdAt: Date;
  updatedAt: Date;
}

export const mockOffers: Offer[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    title: 'Looking for Web Development Services',
    description: 'Need a professional website for my new business. Willing to trade graphic design services or pay.',
    category: 'Services',
    status: 'open',
    responses: 3,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    title: 'Offering Catering Services',
    description: 'Professional catering for events. Looking for marketing help or photography services in exchange.',
    category: 'Food & Beverage',
    status: 'in-progress',
    responses: 5,
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-21'),
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Marcus Williams',
    title: 'Need Logo Design',
    description: 'Starting a new clothing brand and need a professional logo. Can trade social media management or cash.',
    category: 'Design',
    status: 'open',
    responses: 8,
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Lisa Brown',
    title: 'Photography Services Available',
    description: 'Professional photographer offering portrait and event photography. Open to trades or cash.',
    category: 'Services',
    status: 'completed',
    responses: 2,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-22'),
  },
];
