import { MessageCircle, MapPin, Users, BookOpen, Calendar, Star } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import communityBanner from "../assets/community_hub_banner.png";

const COLORS = { red: "#CC0000", green: "#228B22", gold: "#FFD700", black: "#1A1A1A" };

const FEATURES = [
  { icon: MessageCircle, title: "Discussion Forums", description: "Engage in meaningful conversations about community issues and opportunities", color: COLORS.red },
  { icon: MapPin, title: "Local Chapters", description: "Find and connect with Unity Collective members in your area", color: COLORS.green },
  { icon: Users, title: "Mentorship Program", description: "Connect with experienced community leaders and entrepreneurs", color: COLORS.gold },
  { icon: BookOpen, title: "Resource Library", description: "Access educational materials, guides, and community resources", color: COLORS.black },
  { icon: Calendar, title: "Event Calendar", description: "Stay updated on community events, workshops, and networking opportunities", color: COLORS.red },
  { icon: Star, title: "Success Stories", description: "Celebrate achievements and learn from community success stories", color: COLORS.green },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen py-8 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Community Hub</h1>
          <p className="text-xl text-gray-400">Connect, collaborate, and build together as one unified community</p>
        </div>

        <div
          className="relative h-64 rounded-lg mb-12 flex items-center justify-center text-white bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${communityBanner})` }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Building Stronger Communities Together</h2>
            <Button className="bg-red-600 hover:bg-red-700" variant="default" size="default">Join Discussion</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-[#1E1E1E] border border-white/10">
              <CardHeader className="pb-0">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full mr-4" style={{ backgroundColor: feature.color + "20" }}>
                    <feature.icon size={24} style={{ color: feature.color }} />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <Button variant="outline" size="default" className="w-full" style={{ borderColor: feature.color, color: feature.color }}>Explore</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
