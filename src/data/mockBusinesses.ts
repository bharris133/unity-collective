export interface Business {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  description: string;
  longDescription?: string;
  image: string;
  verified: boolean;
  owner?: string;
  since?: number;
  website?: string;
  phone?: string;
  email?: string;
  services?: string[];
}

export const mockBusinesses: Business[] = [
  {
    id: 1,
    name: "Sankofa Consulting",
    category: "Business Services",
    location: "Atlanta, GA",
    rating: 4.9,
    description: "Strategic business consulting for Black entrepreneurs",
    longDescription: "Sankofa Consulting provides comprehensive business strategy and consulting services specifically tailored for Black entrepreneurs and business owners. Our team of experienced consultants helps businesses develop growth strategies, improve operations, and achieve sustainable success.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Dr. Kwame Johnson",
    since: 2015,
    website: "https://sankofaconsulting.com",
    phone: "(404) 555-0123",
    email: "info@sankofaconsulting.com",
    services: ["Business Strategy", "Financial Planning", "Marketing Consulting", "Operations Management"]
  },
  {
    id: 2,
    name: "Heritage Foods Market",
    category: "Food & Beverage",
    location: "Detroit, MI",
    rating: 4.8,
    description: "Authentic African and Caribbean cuisine and groceries",
    longDescription: "Heritage Foods Market is your destination for authentic African and Caribbean ingredients, spices, and prepared foods. We source directly from local farmers and international suppliers to bring you the freshest and most authentic products.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Amara Williams",
    since: 2018,
    website: "https://heritagefoodsmarket.com",
    phone: "(313) 555-0456",
    email: "contact@heritagefoodsmarket.com",
    services: ["Grocery", "Catering", "Meal Prep", "Cooking Classes"]
  },
  {
    id: 3,
    name: "Unity Tech Solutions",
    category: "Technology",
    location: "Oakland, CA",
    rating: 5.0,
    description: "Custom software development and IT services",
    longDescription: "Unity Tech Solutions specializes in custom software development, web applications, mobile apps, and IT consulting services. We help businesses leverage technology to solve problems and achieve their goals.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Marcus Thompson",
    since: 2017,
    website: "https://unitytechsolutions.com",
    phone: "(510) 555-0789",
    email: "hello@unitytechsolutions.com",
    services: ["Web Development", "Mobile Apps", "IT Consulting", "Cloud Solutions"]
  },
  {
    id: 4,
    name: "Afrocentric Books & Art",
    category: "Retail",
    location: "Chicago, IL",
    rating: 4.7,
    description: "Books, art, and cultural items celebrating Black heritage",
    longDescription: "Afrocentric Books & Art is an independent bookstore and art gallery celebrating Black culture, history, and creativity. We carry a curated selection of books by Black authors, original artwork, and cultural items.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Zainab Hassan",
    since: 2012,
    website: "https://afrocentricbooksandart.com",
    phone: "(312) 555-0234",
    email: "info@afrocentricbooksandart.com",
    services: ["Books", "Art Gallery", "Cultural Events", "Author Signings"]
  },
  {
    id: 5,
    name: "Wellness by Imani",
    category: "Healthcare",
    location: "Houston, TX",
    rating: 4.9,
    description: "Holistic health and wellness services",
    longDescription: "Wellness by Imani offers holistic health and wellness services including massage therapy, acupuncture, nutrition counseling, and yoga classes. We focus on treating the whole person - mind, body, and spirit.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Imani Carter",
    since: 2019,
    website: "https://wellnessbyimani.com",
    phone: "(713) 555-0567",
    email: "contact@wellnessbyimani.com",
    services: ["Massage Therapy", "Acupuncture", "Nutrition Counseling", "Yoga Classes"]
  },
  {
    id: 6,
    name: "Black Excellence Academy",
    category: "Education",
    location: "Philadelphia, PA",
    rating: 5.0,
    description: "After-school programs and tutoring services",
    longDescription: "Black Excellence Academy provides high-quality after-school programs, tutoring, and enrichment activities for students K-12. Our experienced educators focus on academic excellence, cultural awareness, and character development.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Dr. Jamal Washington",
    since: 2014,
    website: "https://blackexcellenceacademy.org",
    phone: "(215) 555-0890",
    email: "info@blackexcellenceacademy.org",
    services: ["Tutoring", "STEM Programs", "Arts Education", "College Prep"]
  },
  {
    id: 7,
    name: "Crown & Glory Hair Salon",
    category: "Beauty & Personal Care",
    location: "Brooklyn, NY",
    rating: 4.8,
    description: "Natural hair care and styling specialists",
    longDescription: "Crown & Glory specializes in natural hair care, protective styles, and healthy hair practices. Our stylists are experts in working with all hair types and textures, helping you embrace and celebrate your natural beauty.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Tasha Robinson",
    since: 2016,
    website: "https://crownandglorysalon.com",
    phone: "(718) 555-0123",
    email: "book@crownandglorysalon.com",
    services: ["Natural Hair Care", "Braiding", "Locs", "Hair Treatments"]
  },
  {
    id: 8,
    name: "Brothers Construction LLC",
    category: "Construction & Trades",
    location: "Charlotte, NC",
    rating: 4.9,
    description: "Full-service construction and renovation company",
    longDescription: "Brothers Construction LLC is a full-service construction company specializing in residential and commercial renovations, new construction, and property maintenance. We pride ourselves on quality craftsmanship and excellent customer service.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Andre & Michael Davis",
    since: 2010,
    website: "https://brothersconstructionllc.com",
    phone: "(704) 555-0456",
    email: "info@brothersconstructionllc.com",
    services: ["Renovations", "New Construction", "Roofing", "Plumbing"]
  },
  {
    id: 9,
    name: "Soul Food Kitchen",
    category: "Food & Beverage",
    location: "Memphis, TN",
    rating: 4.7,
    description: "Authentic Southern soul food restaurant",
    longDescription: "Soul Food Kitchen serves authentic Southern soul food made from family recipes passed down through generations. From fried chicken to collard greens, every dish is made with love and the finest ingredients.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Mama Jean Williams",
    since: 2005,
    website: "https://soulfoodkitchen.com",
    phone: "(901) 555-0789",
    email: "info@soulfoodkitchen.com",
    services: ["Dine-In", "Takeout", "Catering", "Private Events"]
  },
  {
    id: 10,
    name: "Black Wall Street Investments",
    category: "Financial Services",
    location: "Washington, DC",
    rating: 5.0,
    description: "Wealth management and financial planning for the Black community",
    longDescription: "Black Wall Street Investments provides comprehensive wealth management, financial planning, and investment services tailored to the unique needs of the Black community. We help clients build generational wealth.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Darnell Mitchell, CFP",
    since: 2018,
    website: "https://blackwallstreetinvestments.com",
    phone: "(202) 555-0234",
    email: "info@blackwallstreetinvestments.com",
    services: ["Wealth Management", "Financial Planning", "Investment Advisory", "Retirement Planning"]
  },
  {
    id: 11,
    name: "Urban Threads Boutique",
    category: "Retail",
    location: "Los Angeles, CA",
    rating: 4.6,
    description: "Contemporary fashion and streetwear",
    longDescription: "Urban Threads Boutique offers a curated selection of contemporary fashion, streetwear, and accessories from Black designers and brands. We celebrate Black creativity and style.",
    image: "/api/placeholder/800/400",
    verified: false,
    owner: "Jasmine Lee",
    since: 2020,
    website: "https://urbanthreadsboutique.com",
    phone: "(323) 555-0567",
    email: "shop@urbanthreadsboutique.com",
    services: ["Clothing", "Accessories", "Personal Styling", "Custom Orders"]
  },
  {
    id: 12,
    name: "Community Legal Services",
    category: "Legal Services",
    location: "Baltimore, MD",
    rating: 4.9,
    description: "Affordable legal services for the community",
    longDescription: "Community Legal Services provides affordable and accessible legal services including family law, criminal defense, civil rights, and business law. We are committed to justice and equality for all.",
    image: "/api/placeholder/800/400",
    verified: true,
    owner: "Attorney Malik Johnson",
    since: 2013,
    website: "https://communitylegalservices.org",
    phone: "(410) 555-0890",
    email: "contact@communitylegalservices.org",
    services: ["Family Law", "Criminal Defense", "Civil Rights", "Business Law"]
  }
];
