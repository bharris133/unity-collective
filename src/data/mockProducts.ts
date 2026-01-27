export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  category: string;
  businessId: string;
  businessName: string;
  image: string[];
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: 'unity-tshirt-001',
    name: 'Unity Collective T-Shirt',
    description: 'Premium cotton t-shirt with Unity Collective logo',
    price: 2499, // $24.99
    category: 'Apparel',
    businessId: 'unity-collective',
    businessName: 'Unity Collective',
    image: ['/api/placeholder/300/300'],
    inStock: true,
    stockQuantity: 50,
    tags: ['apparel', 'merchandise', 'unity'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'heritage-coffee-001',
    name: 'Heritage Blend Coffee',
    description: 'Ethically sourced coffee beans from African farms',
    price: 1899, // $18.99
    category: 'Food & Beverage',
    businessId: 'heritage-foods',
    businessName: 'Heritage Foods Market',
    image: ['/api/placeholder/300/300'],
    inStock: true,
    stockQuantity: 25,
    tags: ['coffee', 'organic', 'fair-trade'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sankofa-book-001',
    name: 'Business Strategy Guide',
    description: 'Comprehensive guide to Black entrepreneurship',
    price: 2999, // $29.99
    category: 'Books & Education',
    businessId: 'sankofa-consulting',
    businessName: 'Sankofa Consulting',
    image: ['/api/placeholder/300/300'],
    inStock: true,
    stockQuantity: 100,
    tags: ['education', 'business', 'entrepreneurship'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'unity-hoodie-001',
    name: 'Unity Collective Hoodie',
    description: 'Comfortable hoodie with embroidered logo',
    price: 4999, // $49.99
    category: 'Apparel',
    businessId: 'unity-collective',
    businessName: 'Unity Collective',
    image: ['/api/placeholder/300/300'],
    inStock: true,
    stockQuantity: 30,
    tags: ['apparel', 'merchandise', 'unity'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'heritage-spices-001',
    name: 'African Spice Collection',
    description: 'Authentic spice blend collection',
    price: 3499, // $34.99
    category: 'Food & Beverage',
    businessId: 'heritage-foods',
    businessName: 'Heritage Foods Market',
    image: ['/api/placeholder/300/300'],
    inStock: true,
    stockQuantity: 40,
    tags: ['spices', 'cooking', 'authentic'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tech-course-001',
    name: 'Web Development Course',
    description: 'Complete web development training program',
    price: 19999, // $199.99
    category: 'Digital Products',
    businessId: 'unity-tech',
    businessName: 'Unity Tech Solutions',
    image: ['/api/placeholder/300/300'],
    inStock: true,
    stockQuantity: 999,
    tags: ['education', 'technology', 'course'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
