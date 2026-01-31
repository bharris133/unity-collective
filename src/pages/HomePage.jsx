import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Users,
  TrendingUp,
  Target,
  Shield,
  Mic,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { businessService, eventService, productService } from "../services";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Input } from "../components/ui/input.jsx";
import heroBanner from "../assets/hero_banner.png";

const colors = {
  red: "#CC0000",
  black: "#1A1A1A",
  green: "#228B22",
  gold: "#FFD700",
  white: "#FAFAFA",
  gray: "#333333",
};

const communityStats = {
  members: "15,247",
  businesses: "3,892",
  events: "156",
  impact: "$2.3M",
};

function HomePage() {
  const [email, setEmail] = useState("");
  const { currentUser } = useAuth();
  
  // State for data loaded from services
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from services on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load businesses, events, and products in parallel
        const [businesses, events, products] = await Promise.all([
          businessService.getAll(),
          eventService.getUpcoming(3),
          productService.getAll(),
        ]);
        
        // Set featured businesses (first 3)
        setFeaturedBusinesses(businesses.slice(0, 3));
        
        // Set upcoming events
        setUpcomingEvents(events);
        
        // Set featured products (first 4)
        setFeaturedProducts(products.slice(0, 4));
        
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    alert(
      "Thank you for subscribing! We'll keep you updated on community events and opportunities.",
    );
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(204, 0, 0, 0.8) 0%, rgba(26, 26, 26, 0.8) 50%, rgba(34, 139, 34, 0.8) 100%), url(${heroBanner})`,
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Empowering Our Community Through Unity and Economic Strength
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Building a stronger Black community through the five pillars: Unity,
            Economic Control, Self-Sufficiency, Protection, and Control of Our
            Narrative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              {currentUser ? "Explore Community" : "Join Our Community"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
            >
              Explore Businesses
            </Button>
          </div>
        </div>
      </section>

      {/* Five Pillars Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: colors.black }}
          >
            Our Five Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              {
                icon: Users,
                title: "Unity",
                description: "Building strong community bonds",
              },
              {
                icon: TrendingUp,
                title: "Economic Control",
                description: "Supporting Black-owned businesses",
              },
              {
                icon: Target,
                title: "Self-Sufficiency",
                description: "Creating sustainable systems",
              },
              {
                icon: Shield,
                title: "Protection",
                description: "Safeguarding our community",
              },
              {
                icon: Mic,
                title: "Our Narrative",
                description: "Controlling our story",
              },
            ].map((pillar, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <pillar.icon size={48} style={{ color: colors.red }} />
                  </div>
                  <CardTitle>{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-20 px-4" style={{ backgroundColor: colors.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
              Featured Businesses
            </h2>
            <Link to="/directory">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading businesses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBusinesses.map((business) => (
                <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{business.name}</CardTitle>
                      {business.verified && (
                        <CheckCircle size={20} className="text-green-600" />
                      )}
                    </div>
                    <Badge variant="secondary">{business.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <Star size={16} className="text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{business.rating}</span>
                      <MapPin size={14} className="ml-3 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-600">{business.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{business.description}</p>
                    <Link to={`/directory/${business.id}`}>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
              Upcoming Events
            </h2>
            <Link to="/community">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                View All Events
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={event.type === "Virtual" ? "default" : "secondary"}
                      >
                        {event.type}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={14} className="mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>{event.time}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Register
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Stats Section */}
      <section
        className="py-20 px-4 text-white"
        style={{ backgroundColor: colors.black }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Community Members", value: communityStats.members },
              { label: "Black-Owned Businesses", value: communityStats.businesses },
              { label: "Events Hosted", value: communityStats.events },
              { label: "Economic Impact", value: communityStats.impact },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: colors.gold }}
                >
                  {stat.value}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: colors.red }}
      >
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Stay Connected</h2>
          <p className="text-xl mb-8 opacity-90">
            Get updates on community events, new businesses, and opportunities.
          </p>
          <form
            onSubmit={handleNewsletterSignup}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 max-w-md text-black"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
