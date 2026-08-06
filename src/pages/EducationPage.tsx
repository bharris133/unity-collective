import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Shield, Users, ArrowRight, Clock, Tag } from "lucide-react";

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
  blue: "#4A90D9",
};

type Article = {
  id: string;
  category: string;
  categoryColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  readTime: string;
  body: React.ReactNode;
};

const articles: Article[] = [
  {
    id: "group-economics",
    category: "Group Economics",
    categoryColor: C.gold,
    icon: TrendingUp,
    title: "What Is Group Economics — And Why Does It Matter?",
    subtitle: "Understanding the principle that has powered every successful community economy in history.",
    readTime: "5 min read",
    body: (
      <>
        <p>Group economics is the practice of a community intentionally circulating its money among its own members before spending it outside. The concept is simple: a dollar that passes through multiple hands within a community creates far more wealth than a dollar that leaves immediately.</p>
        <p>In Japanese-American communities in the early 20th century, a single dollar circulated an average of 28 times before leaving. In Jewish communities, that number has historically been cited as high as 17 times. In the Black community today, the average is less than 6 hours.</p>
        <h3>The $2 Trillion Opportunity</h3>
        <p>Black Americans control an estimated $2 trillion in annual spending power — a figure projected to grow significantly over the next decade. If even 10% of that spending were redirected to Black-owned businesses, it would represent a $200 billion annual economic injection into the community. That is not charity. That is economics.</p>
        <h3>The Principle of Ujamaa</h3>
        <p>The Swahili word <em>Ujamaa</em> — one of the seven principles of Kwanzaa — translates to "cooperative economics." It calls on communities to build and maintain their own stores, shops, and businesses, and to profit from them together. This is not a new idea. It is the oldest economic survival strategy in the world.</p>
        <h3>How to Practice Group Economics Today</h3>
        <ul>
          <li><strong>Search before you spend.</strong> Before buying from a major retailer, spend 60 seconds checking whether a Black-owned business offers the same product or service.</li>
          <li><strong>Redirect one purchase per week.</strong> Research shows that if a quarter of Black Americans redirected just one purchase per week to a Black-owned business, it would permanently alter the racial wealth gap.</li>
          <li><strong>Leave reviews.</strong> Black-owned businesses are disproportionately affected by lack of visibility. A verified review is a form of community investment.</li>
          <li><strong>Endorse and certify.</strong> Use platforms like this one to endorse businesses you trust, helping them reach Tier 2 Community Verified status.</li>
        </ul>
        <p>Group economics is not a boycott. It is a build. The goal is not to punish anyone — it is to strengthen ourselves.</p>
      </>
    ),
  },
  {
    id: "black-wall-street",
    category: "History",
    categoryColor: C.red,
    icon: BookOpen,
    title: "Black Wall Street: What It Was, What Destroyed It, and What We're Rebuilding",
    subtitle: "The story of Greenwood, Oklahoma — and why it is more relevant today than ever.",
    readTime: "7 min read",
    body: (
      <>
        <p>In the early 20th century, the Greenwood District of Tulsa, Oklahoma was the most prosperous Black community in the United States. It was known as Black Wall Street — not as a metaphor, but as a literal description of the economic activity concentrated in a 35-block area.</p>
        <h3>What Made It Work</h3>
        <p>Greenwood was built on a foundation of intentional group economics. The community had its own banks, hospitals, law firms, hotels, theaters, and schools. A dollar circulated within Greenwood an average of 36 to 100 times before leaving the community. Business owners reinvested in each other. Professionals served the community. The community supported the professionals.</p>
        <p>By 1921, Greenwood had produced more Black millionaires per capita than anywhere else in the country. It was not built on charity or outside investment. It was built on the deliberate decision to spend Black dollars with Black businesses.</p>
        <h3>What Destroyed It</h3>
        <p>On May 31–June 1, 1921, a white mob — aided by local law enforcement and the Oklahoma National Guard — burned Greenwood to the ground. Over 35 blocks were destroyed. More than 300 people were killed. Ten thousand residents were left homeless. The Tulsa Race Massacre was one of the worst acts of domestic terrorism in American history, and it was deliberately erased from history books for decades.</p>
        <p>The destruction of Black Wall Street was not random. It was a targeted attack on Black economic independence. The community's prosperity was seen as a threat.</p>
        <h3>What We're Rebuilding</h3>
        <p>The lesson of Greenwood is not that Black economic independence is impossible. It is that it is powerful enough to be worth destroying. The infrastructure we are building today — verified directories, community endorsements, cooperative marketplaces — is the digital continuation of what Greenwood started.</p>
        <p>We cannot rebuild Greenwood in a single generation. But we can build something that serves the same purpose: a trusted, self-reinforcing economic ecosystem where Black dollars build Black wealth.</p>
      </>
    ),
  },
  {
    id: "verification-guide",
    category: "Platform Guide",
    categoryColor: C.blue,
    icon: Shield,
    title: "How Verification Works: A Guide for Business Owners",
    subtitle: "Everything you need to know about getting verified, what each tier means, and why it matters for your business.",
    readTime: "4 min read",
    body: (
      <>
        <p>Verification is the foundation of trust on this platform. Unlike directories where anyone can self-list without accountability, every business here is held to a standard. Here is exactly how it works.</p>
        <h3>Tier 1 — Self-Declared</h3>
        <p>When you complete your business onboarding, you attest to Black ownership. Your listing receives a <strong>Self-Declared</strong> badge (gold star). This is the starting point — you are making a public commitment that your business is Black-owned, and the community can hold you to it.</p>
        <p>Self-Declared status is meaningful. It signals intent and accountability. Most businesses start here.</p>
        <h3>Tier 2 — Community Verified</h3>
        <p>Community Verified status is earned when other verified members of the platform endorse your business. Endorsements come from real accounts — customers, fellow business owners, community members who have interacted with your business and are willing to put their name behind it.</p>
        <p>This tier reflects the cooperative economics principle: trust built through collective accountability, not just self-attestation.</p>
        <h3>Tier 3 — Certified</h3>
        <p>Certified status is the highest level of verification. It requires document submission — proof of Black ownership such as business registration, articles of incorporation, or certification from a recognized partner organization such as the ByBlack network or the National Black Chamber of Commerce.</p>
        <p>Certified businesses receive the highest visibility on the platform and are eligible for featured placement in the directory and marketplace.</p>
        <h3>Why Verification Matters for Your Business</h3>
        <ul>
          <li><strong>Credibility.</strong> Conscious consumers are increasingly sophisticated. A verified badge tells them you have been held to a standard, not just self-listed.</li>
          <li><strong>Visibility.</strong> Higher-tier businesses receive priority placement in search results and featured sections.</li>
          <li><strong>Community trust.</strong> Endorsements from real community members carry more weight than any advertising.</li>
          <li><strong>Protection.</strong> Verification creates a record of your business's legitimacy that protects you from false reports.</li>
        </ul>
        <p>Getting started is free. Complete your onboarding, list your business, and begin building your verification tier today.</p>
      </>
    ),
  },
  {
    id: "conscious-consumerism",
    category: "Consumer Guide",
    categoryColor: C.green,
    icon: Users,
    title: "How to Be a Conscious Consumer: A Practical Guide",
    subtitle: "Making 'Buy Black' a daily habit rather than an occasional gesture.",
    readTime: "4 min read",
    body: (
      <>
        <p>Conscious consumerism is the practice of making purchasing decisions that align with your values. For members of the Black community and allies, that means actively redirecting spending to Black-owned businesses — not as a one-time gesture, but as a sustainable daily practice.</p>
        <h3>Start With Your Recurring Spending</h3>
        <p>The most powerful place to start is not a single large purchase — it is the small recurring purchases that make up the bulk of most people's spending. Coffee. Haircuts. Groceries. Cleaning supplies. Personal care products. These are the categories where a consistent redirect has the most cumulative impact.</p>
        <p>Identify three categories where you spend regularly and find a Black-owned alternative for each. Once the habit is established, expand.</p>
        <h3>Use the Directory Intentionally</h3>
        <p>This platform's Business Directory is designed to make the search frictionless. Use the category filters to find Black-owned businesses in the specific sectors you need. Check the verification tier before you spend — Tier 2 and Tier 3 businesses have been held to a community standard.</p>
        <h3>Leave Reviews and Endorsements</h3>
        <p>One of the most undervalued forms of community investment is a verified review. Black-owned businesses are disproportionately underrepresented in mainstream review platforms. A detailed, honest review on this platform helps other community members make informed decisions and helps the business build its verification tier.</p>
        <p>If you have had a genuinely positive experience with a business, use the Endorse button on their profile. Your endorsement contributes directly to their Community Verified status.</p>
        <h3>Hold the Standard</h3>
        <p>Conscious consumerism is not unconditional support. It is informed support. If a business does not meet the standard, use the Report function. The community's credibility depends on honest accountability, not blind loyalty.</p>
        <h3>The Compound Effect</h3>
        <p>Individual purchasing decisions feel small. But at scale, they are transformative. If 100,000 people redirected $50 per week to Black-owned businesses, that is $260 million per year flowing into the community. That is not a hypothetical — it is arithmetic. The only variable is collective will.</p>
      </>
    ),
  },
];

const categories = ["All", "Group Economics", "History", "Platform Guide", "Consumer Guide"];

export default function EducationPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const currentArticle = articles.find(a => a.id === openArticle);

  if (currentArticle) {
    return (
      <div style={{ background: C.darkBg, color: C.white, minHeight: "100vh" }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <button
            onClick={() => setOpenArticle(null)}
            className="flex items-center gap-2 text-sm mb-10 transition-colors"
            style={{ color: C.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >
            ← Back to Education
          </button>

          <div
            className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: `${currentArticle.categoryColor}22`, color: currentArticle.categoryColor, border: `1px solid ${currentArticle.categoryColor}44` }}
          >
            {currentArticle.category}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{currentArticle.title}</h1>
          <p className="text-lg mb-2" style={{ color: C.muted }}>{currentArticle.subtitle}</p>
          <div className="flex items-center gap-2 mb-10 text-sm" style={{ color: C.muted }}>
            <Clock size={14} />
            {currentArticle.readTime}
          </div>

          <div
            className="prose prose-invert max-w-none text-base leading-relaxed space-y-4"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {currentArticle.body}
          </div>

          <div className="mt-16 pt-8" style={{ borderTop: `1px solid ${C.cardBorder}` }}>
            <p className="text-sm mb-4" style={{ color: C.muted }}>Ready to put this into practice?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/directory">
                <button
                  className="flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition-all duration-200"
                  style={{ background: C.gold, color: C.black }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Find a Business <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/onboarding">
                <button
                  className="flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition-all duration-200"
                  style={{ background: "transparent", color: C.white, border: `1px solid ${C.cardBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.white)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.cardBorder)}
                >
                  List Your Business
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.darkBg, color: C.white, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: `linear-gradient(135deg, ${C.black} 0%, #0A1A0A 100%)`, borderBottom: `3px solid ${C.gold}` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 flex" style={{ position: "relative" }}>
          <div className="flex-1" style={{ background: C.red }} />
          <div className="flex-1" style={{ background: C.black }} />
          <div className="flex-1" style={{ background: C.green }} />
        </div>
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-6"
            style={{ background: "rgba(255,215,0,0.15)", color: C.gold, border: `1px solid ${C.gold}` }}
          >
            Knowledge Is Power
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Education &amp; <span style={{ color: C.gold }}>Resources</span>
          </h1>
          <p className="text-xl" style={{ color: "rgba(255,255,255,0.75)" }}>
            The movement needs informed participants. Learn the history, understand the economics,
            and build the habits that create generational wealth.
          </p>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="py-8 px-6" style={{ background: C.black, borderBottom: `1px solid ${C.cardBorder}` }}>
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
              style={{
                background: activeCategory === cat ? C.gold : "transparent",
                color: activeCategory === cat ? C.black : C.muted,
                border: `1px solid ${activeCategory === cat ? C.gold : C.cardBorder}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map(article => {
              const Icon = article.icon;
              return (
                <div
                  key={article.id}
                  className="rounded-2xl p-8 cursor-pointer transition-all duration-200 flex flex-col"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = article.categoryColor)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.cardBorder)}
                  onClick={() => setOpenArticle(article.id)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${article.categoryColor}22` }}
                    >
                      <Icon size={22} style={{ color: article.categoryColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                          style={{ background: `${article.categoryColor}22`, color: article.categoryColor }}
                        >
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                          <Clock size={11} /> {article.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-xl font-black mb-2 leading-snug">{article.title}</h2>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: C.muted }}>
                    {article.subtitle}
                  </p>
                  <div
                    className="flex items-center gap-2 text-sm font-bold transition-colors"
                    style={{ color: article.categoryColor }}
                  >
                    Read Article <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTE CTA ── */}
      <section className="py-16 px-6 text-center" style={{ background: C.black, borderTop: `1px solid ${C.cardBorder}` }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: C.gold }}>
            More Coming Soon
          </div>
          <h2 className="text-3xl font-black mb-4">Have Knowledge to Share?</h2>
          <p className="mb-8" style={{ color: C.muted }}>
            We are building a library of resources for the community, by the community.
            If you have expertise in Black business, economics, law, or history — we want to hear from you.
          </p>
          <Link to="/community">
            <button
              className="px-8 py-3 font-bold rounded-lg transition-all duration-200"
              style={{ background: C.gold, color: C.black }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Join the Community
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
