export interface Business {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  description: string;
  image: string;
  verified: boolean;
}

export const mockBusinesses: Business[] = [
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
  },
  {
    id: 4,
    name: "Afrocentric Books & Art",
    category: "Retail",
    location: "Chicago, IL",
    rating: 4.7,
    description: "Books, art, and cultural items celebrating Black heritage",
    image: "/api/placeholder/300/200",
    verified: true
  },
  {
    id: 5,
    name: "Wellness by Imani",
    category: "Healthcare",
    location: "Houston, TX",
    rating: 4.9,
    description: "Holistic health and wellness services",
    image: "/api/placeholder/300/200",
    verified: true
  },
  {
    id: 6,
    name: "Black Excellence Academy",
    category: "Education",
    location: "Philadelphia, PA",
    rating: 5.0,
    description: "After-school programs and tutoring services",
    image: "/api/placeholder/300/200",
    verified: true
  }
];
