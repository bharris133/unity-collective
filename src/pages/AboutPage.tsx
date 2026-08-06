import { Link } from "react-router-dom";
import { Shield, TrendingUp, Users, Target, CheckCircle, ArrowRight } from "lucide-react";

const C = {
  red: "#CC0000",
  redBright: "#E53935",
  black: "#0D0D0D",
  darkBg: "#111111",
  cardBg: "#1A1A1A",
  cardBorder: "#2A2A2A",
  gold: "#FFD700",
  green: "#228B22",
  greenBright: "#2ECC71",
  white: "#FAFAFA",
  muted: "#888888",
};

const values = [
  {
    icon: TrendingUp,
    title: "Cooperative Economics",
    color: C.gold,
    body: "We are rooted in the principle of Ujamaa — cooperative economics. Every dollar redirected to a Black-owned business is a vote for the community's self-determination. We are building the infrastructure that makes conscious consumerism effortless.",
  },
  {
    icon: Shield,
    title: "Verified Trust",
    color: "#4A90D9",
    body: "Trust is not given — it is earned. Our 3-tier verification system ensures that every business on this platform has been held to a standard. Self-declared, community-endorsed, or document-certified: you always know what you're getting.",
  },
  {
    icon: Users,
    title: "Community Accountability",
    color: C.green,
    body: "We are accountable to the community we serve. Businesses can be endorsed by verified members and reported when standards are not met. The community is both the product and the quality control.",
  },
  {
    icon: Target,
    title: "Generational Impact",
    color: C.red,
    body: "We are not building for this quarter. We are building for the next generation. Every verified business, every redirected dollar, every community connection is a brick in the foundation of Black generational wealth.",
  },
];

const timeline = [
  {
    period: "The Movement",
    text: "The Buy Black movement has existed for generations — from the original Black Wall Street in Tulsa to the cooperative economics of the Civil Rights era. The principle is simple: Black dollars should circulate within the Black community before leaving it.",
  },
  {
    period: "The Problem",
    text: "The movement has the people and the purchasing power — projected to exceed $2 trillion. What it has lacked is infrastructure. Existing directories are self-reported, unverified, and difficult to trust. Conscious consumers want to support Black businesses but have no reliable way to know which ones are genuine.",
  },
  {
    period: "The Solution",
    text: "We built this platform to close that gap. A verified, searchable, community-powered directory where every listing has earned its place. Where shoppers can spend with confidence, owners can build with credibility, and the community can hold itself accountable.",
  },
  {
    period: "The Vision",
    text: "A Pan-African network of verified Black businesses — from Chicago to Lagos, from London to Kingston — connected by a shared commitment to community economics and collective uplift. We start local. We scale global.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: C.darkBg, color: C.white, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section
        className="relative py-32 px-6 text-center"
        style={{ background: `linear-gradient(135deg, ${C.black} 0%, #0A1A0A 100%)`, borderBottom: `3px solid ${C.gold}` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1" style={{ background: C.red }} />
          <div className="flex-1" style={{ background: C.black }} />
          <div className="flex-1" style={{ background: C.green }} />
        </div>
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-6"
            style={{ background: "rgba(255,215,0,0.15)", color: C.gold, border: `1px solid ${C.gold}` }}
          >
            Our Mission
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            The Movement Has the Power.{" "}
            <span style={{ color: C.gold }}>We&rsquo;re Building the Infrastructure.</span>
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            We exist to make &ldquo;Buy Black&rdquo; a frictionless daily habit &mdash; not a research project.
            A verified directory for conscious consumers and a credibility platform for Black business owners.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 px-6" style={{ background: C.darkBg }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.gold }}>
              Why We Built This
            </div>
            <h2 className="text-4xl md:text-5xl font-black">From Movement to Infrastructure</h2>
          </div>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-8 pb-12">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: C.gold, color: C.black }}
                  >
                    {i + 1}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: `${C.gold}33` }} />
                  )}
                </div>
                <div className="pt-1 pb-4">
                  <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: C.gold }}>
                    {item.period}
                  </div>
                  <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6" style={{ background: "#0A0A0A" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.red }}>
              What We Stand For
            </div>
            <h2 className="text-4xl md:text-5xl font-black">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-8 transition-all duration-200"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = v.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.cardBorder)}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{ background: `${v.color}22` }}
                  >
                    <Icon size={26} style={{ color: v.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                  <p className="leading-relaxed" style={{ color: C.muted }}>{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VERIFICATION EXPLAINED ── */}
      <section className="py-24 px-6" style={{ background: C.darkBg }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.gold }}>
            Our Standard
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Not Just Listed. <span style={{ color: C.gold }}>Verified.</span>
          </h2>
          <p className="text-lg mb-12 leading-relaxed" style={{ color: C.muted }}>
            The Buy Black movement deserves better than an unverified self-reported list.
            We built a 3-tier verification system that gives consumers confidence and gives
            business owners a credibility credential they can be proud of.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { tier: "Tier 1", label: "Self-Declared", color: C.gold,        detail: "Owner attests to Black ownership. Listed with a Self-Declared badge. The foundation of trust." },
              { tier: "Tier 2", label: "Community Verified", color: "#4A90D9", detail: "Endorsed by verified community members. Trust earned through collective accountability." },
              { tier: "Tier 3", label: "Certified",     color: C.greenBright, detail: "Document-verified by our team or a partner organization. The gold standard." },
            ].map((v) => (
              <div
                key={v.tier}
                className="rounded-xl p-6"
                style={{ background: C.cardBg, border: `1px solid ${v.color}44` }}
              >
                <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: v.color }}>{v.tier}</div>
                <div className="text-lg font-bold mb-2">{v.label}</div>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: `linear-gradient(135deg, rgba(13,13,13,0.95) 0%, rgba(34,139,34,0.5) 100%)`, borderTop: `1px solid ${C.cardBorder}` }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to <span style={{ color: C.gold }}>Redirect Your Dollars?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            Join thousands of conscious consumers and Black business owners already building
            the infrastructure of generational wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/directory">
              <button
                className="flex items-center gap-2 px-10 py-4 text-lg font-bold rounded-lg transition-all duration-200"
                style={{ background: C.gold, color: C.black }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Find a Business <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="/onboarding">
              <button
                className="px-10 py-4 text-lg font-bold rounded-lg transition-all duration-200"
                style={{ background: "transparent", color: C.white, border: `2px solid ${C.white}` }}
                onMouseEnter={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.black; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.white; }}
              >
                List Your Business
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
