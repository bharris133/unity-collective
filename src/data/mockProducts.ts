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
    description: 'Premium cotton t-shirt with Unity Collective logo. Available in multiple colors and sizes.',
    price: 2499, // $24.99
    category: 'Apparel',
    businessId: 'unity-collective',
    businessName: 'Unity Collective',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 50,
    tags: ['apparel', 'merchandise', 'unity', 'clothing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'heritage-coffee-001',
    name: 'Heritage Blend Coffee',
    description: 'Ethically sourced coffee beans from African farms. Medium roast with notes of chocolate and caramel.',
    price: 1899, // $18.99
    category: 'Food & Beverage',
    businessId: 'heritage-foods',
    businessName: 'Heritage Foods Market',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 25,
    tags: ['coffee', 'organic', 'fair-trade', 'beverage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sankofa-book-001',
    name: 'Business Strategy Guide',
    description: 'Comprehensive guide to Black entrepreneurship with real-world case studies and actionable strategies.',
    price: 2999, // $29.99
    category: 'Books & Education',
    businessId: 'sankofa-consulting',
    businessName: 'Sankofa Consulting',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 100,
    tags: ['education', 'business', 'entrepreneurship', 'books'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'unity-hoodie-001',
    name: 'Unity Collective Hoodie',
    description: 'Comfortable fleece hoodie with embroidered logo. Perfect for cool weather.',
    price: 4999, // $49.99
    category: 'Apparel',
    businessId: 'unity-collective',
    businessName: 'Unity Collective',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 30,
    tags: ['apparel', 'merchandise', 'unity', 'clothing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'heritage-spices-001',
    name: 'African Spice Collection',
    description: 'Authentic spice blend collection featuring berbere, suya, and peri-peri seasonings.',
    price: 3499, // $34.99
    category: 'Food & Beverage',
    businessId: 'heritage-foods',
    businessName: 'Heritage Foods Market',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 40,
    tags: ['spices', 'cooking', 'authentic', 'food'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tech-course-001',
    name: 'Web Development Course',
    description: 'Complete web development training program covering HTML, CSS, JavaScript, React, and Node.js.',
    price: 19999, // $199.99
    category: 'Digital Products',
    businessId: 'unity-tech',
    businessName: 'Unity Tech Solutions',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 999,
    tags: ['education', 'technology', 'course', 'digital'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'afro-art-print-001',
    name: 'Black Excellence Art Print',
    description: 'Limited edition art print celebrating Black culture and excellence. 18x24 inches, museum-quality.',
    price: 4999, // $49.99
    category: 'Art & Decor',
    businessId: 'afrocentric-books',
    businessName: 'Afrocentric Books & Art',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 15,
    tags: ['art', 'decor', 'print', 'culture'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wellness-oil-001',
    name: 'Essential Oil Blend Set',
    description: 'Curated set of essential oils for relaxation, focus, and energy. Includes lavender, peppermint, and eucalyptus.',
    price: 3999, // $39.99
    category: 'Health & Wellness',
    businessId: 'wellness-imani',
    businessName: 'Wellness by Imani',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 35,
    tags: ['wellness', 'essential-oils', 'health', 'aromatherapy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'academy-workbook-001',
    name: 'STEM Learning Workbook',
    description: 'Engaging STEM workbook for grades 3-5 with hands-on activities and experiments.',
    price: 1999, // $19.99
    category: 'Books & Education',
    businessId: 'black-excellence-academy',
    businessName: 'Black Excellence Academy',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 75,
    tags: ['education', 'STEM', 'workbook', 'learning'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'crown-hair-oil-001',
    name: 'Natural Hair Growth Oil',
    description: 'Nourishing hair oil blend with castor oil, rosemary, and peppermint for healthy hair growth.',
    price: 2499, // $24.99
    category: 'Beauty & Personal Care',
    businessId: 'crown-glory',
    businessName: 'Crown & Glory Hair Salon',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 60,
    tags: ['beauty', 'hair-care', 'natural', 'oil'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'soul-food-cookbook-001',
    name: 'Soul Food Cookbook',
    description: 'Family recipes and Southern cooking traditions passed down through generations.',
    price: 2999, // $29.99
    category: 'Books & Education',
    businessId: 'soul-food-kitchen',
    businessName: 'Soul Food Kitchen',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 45,
    tags: ['cookbook', 'soul-food', 'recipes', 'cooking'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'urban-threads-jacket-001',
    name: 'Designer Denim Jacket',
    description: 'Premium denim jacket from Black designer with unique embroidered details.',
    price: 12999, // $129.99
    category: 'Apparel',
    businessId: 'urban-threads',
    businessName: 'Urban Threads Boutique',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 12,
    tags: ['apparel', 'fashion', 'denim', 'designer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'unity-cap-001',
    name: 'Unity Collective Baseball Cap',
    description: 'Adjustable baseball cap with embroidered Unity logo. One size fits all.',
    price: 1999, // $19.99
    category: 'Apparel',
    businessId: 'unity-collective',
    businessName: 'Unity Collective',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 80,
    tags: ['apparel', 'accessories', 'cap', 'merchandise'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'heritage-hot-sauce-001',
    name: 'Peri-Peri Hot Sauce',
    description: 'Authentic African peri-peri hot sauce made with fresh peppers and spices.',
    price: 899, // $8.99
    category: 'Food & Beverage',
    businessId: 'heritage-foods',
    businessName: 'Heritage Foods Market',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 55,
    tags: ['food', 'hot-sauce', 'spicy', 'condiment'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wellness-yoga-mat-001',
    name: 'Premium Yoga Mat',
    description: 'Eco-friendly yoga mat with excellent grip and cushioning. Includes carrying strap.',
    price: 4999, // $49.99
    category: 'Health & Wellness',
    businessId: 'wellness-imani',
    businessName: 'Wellness by Imani',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 20,
    tags: ['wellness', 'yoga', 'fitness', 'exercise'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'afro-book-001',
    name: 'Black History Collection',
    description: 'Curated collection of 5 essential books on Black history and culture.',
    price: 7999, // $79.99
    category: 'Books & Education',
    businessId: 'afrocentric-books',
    businessName: 'Afrocentric Books & Art',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 25,
    tags: ['books', 'history', 'education', 'collection'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'crown-shampoo-001',
    name: 'Moisturizing Shampoo',
    description: 'Sulfate-free moisturizing shampoo for natural hair. Gentle and nourishing.',
    price: 1899, // $18.99
    category: 'Beauty & Personal Care',
    businessId: 'crown-glory',
    businessName: 'Crown & Glory Hair Salon',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 70,
    tags: ['beauty', 'hair-care', 'shampoo', 'natural'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tech-consultation-001',
    name: 'IT Consultation Package',
    description: '2-hour IT consultation session to assess and improve your business technology.',
    price: 29999, // $299.99
    category: 'Services',
    businessId: 'unity-tech',
    businessName: 'Unity Tech Solutions',
    image: ['https://placehold.co/300x300/e5e5e5/666666?text=Product+Image'],
    inStock: true,
    stockQuantity: 10,
    tags: ['services', 'consultation', 'IT', 'business'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
