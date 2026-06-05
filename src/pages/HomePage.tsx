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
  ArrowRight,
  ShoppingBag,
  Building2,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { businessService, eventService } from "../services";
import { Input } from "../components/ui/input.jsx";
import heroBanner from "../assets/hero_banner.png";
import communityHubBanner from "../assets/community_hub_banner.png";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  red: "#CC0000",
  redBright: "#E53935",
  black: "#0D0D0D",
  darkBg: "#111111",
  cardBg: "#1A1A1A",
  cardBorder: "#2A2A2A",
  gold: "#FFD700",
  goldDim: "#C9A800",
  green: "#228B22",
  greenBright: "#2ECC71",
  white: "#FAFAFA",
  muted: "#888888",
  purple: "#9B59B6",
};

const communityStats = {
  members: "5,000+",
  businesses: "1,200+",
  events: "250+",
  impact: "$2.5M+",
};

// ─── Pillar data ──────────────────────────────────────────────────────────────
const pillars = [
  { icon: Users,      title: "Unity",            description: "Building strong community bonds that transcend geography and generation.", color: C.red },
  { icon: TrendingUp, title: "Economic Control", description: "Circulating dollars within the community and supporting Black-owned businesses.", color: C.gold },
  { icon: Target,     title: "Self-Sufficiency", description: "Creating sustainable systems that reduce dependency on outside resources.", color: C.green },
  { icon: Shield,     title: "Protection",       description: "Safeguarding our community through knowledge, law, and collective action.", color: C.purple },
  { icon: Mic,        title: "Our Narrative",    description: "Controlling our story through media, education, and cultural expression.", color: C.redBright },
];

// ─── Quick-access feature tiles ───────────────────────────────────────────────
const quickLinks = [
  { icon: ShoppingBag, label: "Marketplace",        sub: "Shop Black-owned",        to: "/marketplace", color: C.red },
  { icon: Building2,   label: "Business Directory", sub: "Find local businesses",   to: "/directory",   color: C.gold },
  { icon: MessageSquare, label: "Community Hub",    sub: "Connect & collaborate",   to: "/community",   color: C.green },
  { icon: BookOpen,    label: "Education",          sub: "Learn & grow",            to: "/education",   color: C.purple },
];

// ─── Component ────────────────────────────────────────────────────────────────
function HomePage() {
  const [email, setEmail] = useState("");
  const { currentUser } = useAuth();

  const [featuredBusinesses, setFeaturedBusinesses] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents]         = useState<any[]>([]);
  const [loading, setLoading]                       = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [businesses, events] = await Promise.all([
          businessService.getAll(),
          eventService.getUpcoming(3),
        ]);
        setFeaturedBusinesses(businesses.slice(0, 3));
        setUpcomingEvents(events);
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing! We'll keep you updated on community events and opportunities.");
    setEmail("");
  };

  return (
    <div style={{ background: C.darkBg, color: C.white, minHeight: "100vh" }}>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center text-white"
        style={{
          minHeight: "100vh",
          background: `linear-gradient(rgba(10,10,10,0.82), rgba(10,10,10,0.92)), url(${heroBanner}) center/cover no-repeat`,
        }}
      >
        {/* Pan-African accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1" style={{ background: C.red }} />
          <div className="flex-1" style={{ background: C.black }} />
          <div className="flex-1" style={{ background: C.green }} />
        </div>

        <div className="text-center max-w-5xl mx-auto px-6 pt-32 pb-24">
          <div
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-6"
            style={{ background: "rgba(255,215,0,0.15)", color: C.gold, border: `1px solid ${C.gold}` }}
          >
            Community Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Empowering Our Community{" "}
            <span style={{ color: C.gold }}>Through Unity</span> and Economic
            Strength
          </h1>

          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
            Building a stronger Black community through the five pillars: Unity,
            Economic Control, Self-Sufficiency, Protection, and Control of Our
            Narrative.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to={currentUser ? "/community" : "/community"}>
              <button
                className="px-10 py-4 text-lg font-bold rounded-lg transition-all duration-200"
                style={{ background: C.red, color: C.white }}
                onMouseEnter={e => (e.currentTarget.style.background = C.redBright)}
                onMouseLeave={e => (e.currentTarget.style.background = C.red)}
              >
                {currentUser ? "Explore Community" : "Join Our Community"}
              </button>
            </Link>
            <Link to="/directory">
              <button
                className="px-10 py-4 text-lg font-bold rounded-lg transition-all duration-200"
                style={{ background: "transparent", color: C.gold, border: `2px solid ${C.gold}` }}
                onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.black; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gold; }}
              >
                Explore Businesses
              </button>
            </Link>
          </div>

          {/* Quick-access tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {quickLinks.map(({ icon: Icon, label, sub, to, color }) => (
              <Link to={to} key={label}>
                <div
                  className="rounded-xl p-4 text-left transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  <Icon size={24} style={{ color }} className="mb-2" />
                  <div className="font-bold text-sm">{label}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center opacity-60">
          <div className="text-xs tracking-widest uppercase mb-2">Scroll to explore</div>
          <div className="w-px h-8 mx-auto" style={{ background: C.gold }} />
        </div>
      </section>

      {/* ── COMMUNITY STATS ─────────────────────────────────────────────────── */}
      <section style={{ background: C.black, borderTop: `3px solid ${C.gold}`, borderBottom: `3px solid ${C.gold}` }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Community Members",    value: communityStats.members },
              { label: "Black-Owned Businesses", value: communityStats.businesses },
              { label: "Events Hosted",        value: communityStats.events },
              { label: "Economic Impact",      value: communityStats.impact },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-black mb-1" style={{ color: C.gold }}>
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider" style={{ color: C.muted }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIVE PILLARS ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.darkBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.gold }}>
              Our Foundation
            </div>
            <h2 className="text-4xl md:text-5xl font-black">Our Five Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 text-center transition-all duration-200"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = pillar.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.cardBorder)}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${pillar.color}22` }}
                  >
                    <Icon size={28} style={{ color: pillar.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED BUSINESSES ─────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#0A0A0A" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.red }}>
                Community Spotlight
              </div>
              <h2 className="text-4xl md:text-5xl font-black">Featured Businesses</h2>
            </div>
            <Link to="/directory">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200"
                style={{ border: `1px solid ${C.red}`, color: C.red }}
                onMouseEnter={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.red; }}
              >
                View All <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="text-lg" style={{ color: C.muted }}>Loading businesses...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.gold)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.cardBorder)}
                >
                  <div className="aspect-video overflow-hidden" style={{ background: "#222" }}>
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                        style={{ background: `${C.red}22`, color: C.red }}
                      >
                        {business.category}
                      </span>
                      {business.verified && (
                        <CheckCircle size={18} style={{ color: C.greenBright }} />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{business.name}</h3>
                    <div className="flex items-center gap-3 mb-3" style={{ color: C.muted }}>
                      <span className="flex items-center gap-1">
                        <Star size={14} style={{ color: C.gold, fill: C.gold }} />
                        <span className="font-semibold" style={{ color: C.white }}>{business.rating}</span>
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin size={13} />
                        {business.location}
                      </span>
                    </div>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: C.muted }}>
                      {business.description}
                    </p>
                    <Link to={`/directory/${business.id}`}>
                      <button
                        className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-200"
                        style={{ background: C.red, color: C.white }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.redBright)}
                        onMouseLeave={e => (e.currentTarget.style.background = C.red)}
                      >
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── UPCOMING EVENTS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: C.darkBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.green }}>
                What's Coming Up
              </div>
              <h2 className="text-4xl md:text-5xl font-black">Upcoming Events</h2>
            </div>
            <Link to="/community">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200"
                style={{ border: `1px solid ${C.green}`, color: C.green }}
                onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.green; }}
              >
                View All Events <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="text-lg" style={{ color: C.muted }}>Loading events...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl p-6 transition-all duration-200"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.green)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.cardBorder)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{
                        background: event.type === "Virtual" ? `${C.green}22` : `${C.gold}22`,
                        color: event.type === "Virtual" ? C.greenBright : C.gold,
                      }}
                    >
                      {event.type}
                    </span>
                    <span className="flex items-center gap-1 text-sm" style={{ color: C.muted }}>
                      <Users size={13} />
                      {event.attendees}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <div className="space-y-2 mb-6" style={{ color: C.muted }}>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} style={{ color: C.gold }} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} style={{ color: C.gold }} />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} style={{ color: C.gold }} />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <button
                    className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-200"
                    style={{ background: C.green, color: C.white }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    Register
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COMMUNITY CTA BANNER ────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-6 text-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(13,13,13,0.92) 0%, rgba(34,139,34,0.6) 100%), url(${communityHubBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: C.gold }}>
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Together We Build{" "}
            <span style={{ color: C.gold }}>Generational Wealth</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
            Every purchase, every connection, every event strengthens the
            collective. Join thousands of community members already building a
            better future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <button
                className="px-10 py-4 text-lg font-bold rounded-lg transition-all duration-200"
                style={{ background: C.gold, color: C.black }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Shop the Marketplace
              </button>
            </Link>
            <Link to="/directory">
              <button
                className="px-10 py-4 text-lg font-bold rounded-lg transition-all duration-200"
                style={{ background: "transparent", color: C.white, border: `2px solid ${C.white}` }}
                onMouseEnter={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.black; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.white; }}
              >
                Browse Businesses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: C.black, borderTop: `1px solid ${C.cardBorder}` }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: C.red }}>
            Stay in the Loop
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Stay Connected</h2>
          <p className="text-lg mb-8" style={{ color: C.muted }}>
            Get updates on community events, new businesses, and opportunities.
          </p>
          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="flex-1 max-w-md"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.white }}
            />
            <button
              type="submit"
              className="px-8 py-3 font-bold rounded-lg transition-all duration-200 whitespace-nowrap"
              style={{ background: C.red, color: C.white }}
              onMouseEnter={e => (e.currentTarget.style.background = C.redBright)}
              onMouseLeave={e => (e.currentTarget.style.background = C.red)}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
