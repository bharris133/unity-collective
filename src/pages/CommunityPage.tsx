import React from "react";
import {
  MessageCircle,
  MapPin,
  Users,
  BookOpen,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import communityBanner from "../assets/community_hub_banner.png";

const colors = {
  red: "#CC0000",
  black: "#1A1A1A",
  green: "#228B22",
  gold: "#FFD700",
  white: "#FAFAFA",
  gray: "#333333",
};

const featuredBusinesses = [
  {
    id: 1,
    name: "Sankofa Consulting",
    category: "Business Services",
    location: "Atlanta, GA",
    rating: 4.9,
    description: "Strategic business consulting for Black entrepreneurs",
    image: "/api/placeholder/300/200",
    verified: true,
  },
  {
    id: 2,
    name: "Heritage Foods Market",
    category: "Food & Beverage",
    location: "Detroit, MI",
    rating: 4.8,
    description: "Authentic African and Caribbean cuisine and groceries",
    image: "/api/placeholder/300/200",
    verified: true,
  },
  {
    id: 3,
    name: "Unity Tech Solutions",
    category: "Technology",
    location: "Oakland, CA",
    rating: 5.0,
    description: "Custom software development and IT services",
    image: "/api/placeholder/300/200",
    verified: true,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Economic Empowerment Webinar",
    date: "2025-08-25",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 234,
  },
  {
    id: 2,
    title: "Black Business Networking Mixer",
    date: "2025-09-02",
    time: "6:00 PM EST",
    type: "In-Person",
    location: "Atlanta, GA",
    attendees: 89,
  },
  {
    id: 3,
    title: "Financial Literacy Workshop",
    date: "2025-09-10",
    time: "2:00 PM EST",
    type: "Virtual",
    attendees: 156,
  },
];

const communityStats = {
  members: "15,247",
  businesses: "3,892",
  events: "156",
  impact: "$2.3M",
};

function CommunityPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: colors.black }}
          >
            Community Hub
          </h1>
          <p className="text-xl text-gray-600">
            Connect, collaborate, and build together as one unified community
          </p>
        </div>

        {/* Hero Banner */}
        <div
          className="relative h-64 rounded-lg mb-12 flex items-center justify-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${communityBanner})`,
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Building Stronger Communities Together
            </h2>
            <Button className="bg-red-600 hover:bg-red-700">
              Join Discussion
            </Button>
          </div>
        </div>

        {/* Community Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: MessageCircle,
              title: "Discussion Forums",
              description:
                "Engage in meaningful conversations about community issues and opportunities",
              color: colors.red,
            },
            {
              icon: MapPin,
              title: "Local Chapters",
              description:
                "Find and connect with Unity Collective members in your area",
              color: colors.green,
            },
            {
              icon: Users,
              title: "Mentorship Program",
              description:
                "Connect with experienced community leaders and entrepreneurs",
              color: colors.gold,
            },
            {
              icon: BookOpen,
              title: "Resource Library",
              description:
                "Access educational materials, guides, and community resources",
              color: colors.black,
            },
            {
              icon: Calendar,
              title: "Event Calendar",
              description:
                "Stay updated on community events, workshops, and networking opportunities",
              color: colors.red,
            },
            {
              icon: Star,
              title: "Success Stories",
              description:
                "Celebrate achievements and learn from community success stories",
              color: colors.green,
            },
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div
                    className="p-3 rounded-full mr-4"
                    style={{ backgroundColor: feature.color + "20" }}
                  >
                    <feature.icon size={24} style={{ color: feature.color }} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: feature.color, color: feature.color }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
