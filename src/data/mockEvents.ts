export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'Virtual' | 'In-Person';
  location?: string;
  attendees: number;
  description?: string;
  host?: string;
  category?: string;
  image?: string;
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Economic Empowerment Webinar",
    date: "2026-02-15",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 234,
    description: "Learn strategies for building wealth and economic independence in the Black community.",
    host: "Black Wall Street Investments",
    category: "Finance",
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    title: "Black Business Networking Mixer",
    date: "2026-02-20",
    time: "6:00 PM EST",
    type: "In-Person",
    location: "Atlanta, GA",
    attendees: 89,
    description: "Connect with fellow Black business owners and entrepreneurs in your area.",
    host: "Unity Collective",
    category: "Networking",
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    title: "Financial Literacy Workshop",
    date: "2026-02-25",
    time: "2:00 PM EST",
    type: "Virtual",
    attendees: 156,
    description: "Master the fundamentals of personal finance, budgeting, and investing.",
    host: "Black Wall Street Investments",
    category: "Finance",
    image: "/api/placeholder/400/200"
  },
  {
    id: 4,
    title: "Youth Entrepreneurship Summit",
    date: "2026-03-05",
    time: "10:00 AM EST",
    type: "In-Person",
    location: "Detroit, MI",
    attendees: 312,
    description: "Inspiring the next generation of Black entrepreneurs with workshops and mentorship.",
    host: "Black Excellence Academy",
    category: "Education",
    image: "/api/placeholder/400/200"
  },
  {
    id: 5,
    title: "Tech Skills Bootcamp",
    date: "2026-03-10",
    time: "6:00 PM EST",
    type: "Virtual",
    attendees: 178,
    description: "Intensive training in web development, coding, and digital skills.",
    host: "Unity Tech Solutions",
    category: "Technology",
    image: "/api/placeholder/400/200"
  },
  {
    id: 6,
    title: "Natural Hair Care Workshop",
    date: "2026-03-15",
    time: "3:00 PM EST",
    type: "In-Person",
    location: "Brooklyn, NY",
    attendees: 65,
    description: "Learn techniques for healthy natural hair care and styling.",
    host: "Crown & Glory Hair Salon",
    category: "Beauty & Wellness",
    image: "/api/placeholder/400/200"
  },
  {
    id: 7,
    title: "Community Health Fair",
    date: "2026-03-22",
    time: "11:00 AM EST",
    type: "In-Person",
    location: "Houston, TX",
    attendees: 450,
    description: "Free health screenings, wellness information, and community resources.",
    host: "Wellness by Imani",
    category: "Health",
    image: "/api/placeholder/400/200"
  },
  {
    id: 8,
    title: "Soul Food Cooking Class",
    date: "2026-03-28",
    time: "5:00 PM EST",
    type: "In-Person",
    location: "Memphis, TN",
    attendees: 30,
    description: "Learn to cook authentic soul food dishes from Mama Jean herself.",
    host: "Soul Food Kitchen",
    category: "Food & Culture",
    image: "/api/placeholder/400/200"
  },
  {
    id: 9,
    title: "Black History Book Club",
    date: "2026-04-02",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 95,
    description: "Monthly discussion of important books on Black history and culture.",
    host: "Afrocentric Books & Art",
    category: "Education",
    image: "/api/placeholder/400/200"
  },
  {
    id: 10,
    title: "Small Business Legal Clinic",
    date: "2026-04-08",
    time: "1:00 PM EST",
    type: "Virtual",
    attendees: 120,
    description: "Free legal advice for small business owners on contracts, LLC formation, and more.",
    host: "Community Legal Services",
    category: "Legal",
    image: "/api/placeholder/400/200"
  },
  {
    id: 11,
    title: "Fashion Show: Black Designers",
    date: "2026-04-15",
    time: "7:00 PM EST",
    type: "In-Person",
    location: "Los Angeles, CA",
    attendees: 250,
    description: "Celebrating Black fashion designers with a runway show and networking event.",
    host: "Urban Threads Boutique",
    category: "Fashion",
    image: "/api/placeholder/400/200"
  },
  {
    id: 12,
    title: "Home Renovation Workshop",
    date: "2026-04-20",
    time: "10:00 AM EST",
    type: "In-Person",
    location: "Charlotte, NC",
    attendees: 75,
    description: "DIY home improvement tips and tricks from professional contractors.",
    host: "Brothers Construction LLC",
    category: "Home & Garden",
    image: "/api/placeholder/400/200"
  }
];
