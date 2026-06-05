import React from 'react';
import { Link } from 'react-router-dom';
import logoMain from '../assets/logo_main.png';
import heroBanner from '../assets/hero_banner.png';
import communityHubBanner from '../assets/community_hub_banner.png';

// ─── Feature data ────────────────────────────────────────────────────────────

const features = [
  {
    id: 'marketplace',
    icon: '🛒',
    title: 'Marketplace',
    tagline: 'Shop Black-Owned Products',
    description:
      'A fully functional e-commerce marketplace where community members can browse, filter, and purchase products from Black-owned businesses. Features include add-to-cart, real-time price formatting, tax and shipping calculations, and an auth-required checkout flow that keeps every transaction within the community.',
    highlights: [
      'Product grid with images and pricing',
      'Add to cart with quantity management',
      'Subtotal, 8% tax, and free shipping over $50',
      'Auth-required checkout for community integrity',
    ],
    link: '/marketplace',
    linkLabel: 'Browse Marketplace',
    color: '#D22730',
    badge: 'Live',
  },
  {
    id: 'directory',
    icon: '🏪',
    title: 'Business Directory',
    tagline: 'Discover Local Businesses',
    description:
      'A searchable, filterable directory of Black-owned businesses. Each vendor has a dedicated detail page that displays their products directly, enabling community members to discover and shop without leaving the vendor profile.',
    highlights: [
      'Searchable and filterable business listings',
      'Vendor detail pages with product grids',
      'Add to cart directly from vendor pages',
      'Category and rating filters',
    ],
    link: '/directory',
    linkLabel: 'Explore Directory',
    color: '#007A33',
    badge: 'Live',
  },
  {
    id: 'community',
    icon: '🤝',
    title: 'Community Hub',
    tagline: 'Connect & Collaborate',
    description:
      'The heartbeat of the platform. Members can browse upcoming events, connect with fellow community members, and engage with community-driven content. The events feed automatically surfaces the next three upcoming events on the homepage.',
    highlights: [
      'Upcoming events feed (auto-filtered by date)',
      'Community member profiles',
      'Event registration and reminders',
      'Community announcements',
    ],
    link: '/community',
    linkLabel: 'Visit Community Hub',
    color: '#FFD700',
    badge: 'Live',
  },
  {
    id: 'offers',
    icon: '🔄',
    title: 'Community Offers & Barter',
    tagline: 'Trade Skills and Services',
    description:
      'A unique barter and offers board where community members can post services, skills, or goods they are willing to trade. Status badges track open, in-progress, and completed exchanges, and full-text search makes finding the right match easy.',
    highlights: [
      'Post and browse barter offers',
      'Status tracking (Open, In-Progress, Completed)',
      'Full-text search and category filters',
      'Response count and date tracking',
    ],
    link: '/offers',
    linkLabel: 'View Offers Board',
    color: '#9B59B6',
    badge: 'Live',
  },
  {
    id: 'messages',
    icon: '💬',
    title: 'Direct Messages',
    tagline: 'Private Community Conversations',
    description:
      'A real-time-style messaging system that allows authenticated community members to communicate directly with vendors, barter partners, and fellow members. Thread-based conversations with timestamps and sender names.',
    highlights: [
      'Thread-based conversation list',
      'Full conversation view with timestamps',
      'Search across message threads',
      'Visible only to authenticated members',
    ],
    link: '/messages',
    linkLabel: 'Open Messages',
    color: '#2980B9',
    badge: 'Live',
  },
  {
    id: 'auth',
    icon: '🔐',
    title: 'Authentication System',
    tagline: 'Community-First Identity',
    description:
      'A Firebase-compatible authentication system with a full mock mode for development and testing. Supports multiple user roles (buyer, vendor, admin) and dynamically adjusts navigation, features, and permissions based on the logged-in user.',
    highlights: [
      'Mock Auth Control for development testing',
      'Role-based access (buyer, vendor, admin)',
      'Dynamic navigation based on auth state',
      'Firebase-ready for production deployment',
    ],
    link: '/',
    linkLabel: 'Try Mock Auth',
    color: '#E67E22',
    badge: 'Dev Ready',
  },
  {
    id: 'payment',
    icon: '💳',
    title: 'Payment Architecture',
    tagline: 'Stripe-Ready from Day One',
    description:
      'A production-grade payment service abstraction layer built with the Strategy Pattern. The mock payment service enables full checkout testing without real charges, while the Stripe service stub is ready to be activated with a single environment variable change.',
    highlights: [
      'Strategy Pattern payment abstraction',
      'Mock payment service (no real charges)',
      'Stripe service stub pre-wired',
      'Switch environments via .env variable',
    ],
    link: '/checkout',
    linkLabel: 'See Checkout Flow',
    color: '#1ABC9C',
    badge: 'Stripe Ready',
  },
  {
    id: 'education',
    icon: '📚',
    title: 'Education Center',
    tagline: 'Knowledge is Power',
    description:
      'A dedicated education hub providing resources, courses, and content to empower community members with financial literacy, entrepreneurship skills, and cultural knowledge.',
    highlights: [
      'Curated learning resources',
      'Entrepreneurship and financial literacy',
      'Cultural and historical content',
      'Community-contributed knowledge base',
    ],
    link: '/education',
    linkLabel: 'Visit Education Center',
    color: '#D22730',
    badge: 'Live',
  },
];

const stats = [
  { value: '5,000+', label: 'Community Members', icon: '👥' },
  { value: '1,200+', label: 'Black-Owned Businesses', icon: '🏪' },
  { value: '250+', label: 'Events Hosted', icon: '📅' },
  { value: '$2.5M+', label: 'Economic Impact', icon: '💰' },
];

// ─── Component ───────────────────────────────────────────────────────────────

const PlatformShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6"
        style={{
          background: `linear-gradient(rgba(10,10,10,0.82), rgba(10,10,10,0.92)), url(${heroBanner}) center/cover no-repeat`,
        }}
      >
        {/* Pan-African accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-green-700" />
        </div>

        <img src={logoMain} alt="[Unity Collective] logo" className="w-20 h-20 mb-6 rounded-full shadow-2xl" />

        <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/40 rounded-full px-4 py-1 text-red-400 text-sm font-semibold mb-6 tracking-widest uppercase">
          Platform Showcase
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 max-w-4xl">
          <span className="text-white">[Unity Collective]</span>
          <br />
          <span className="text-yellow-400">Platform Features</span>
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          A full-stack community platform empowering Black-owned businesses and community members
          through economic unity, direct trade, and shared knowledge.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#features"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Explore Features
          </a>
          <Link
            to="/"
            className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Visit Platform
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 text-sm animate-bounce">
          <span>Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 border-y border-gray-800 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="text-4xl font-extrabold text-yellow-400 mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Platform <span className="text-red-500">Features</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every feature is built with community-first values — connecting people, empowering
            businesses, and keeping economic power within the collective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 cursor-pointer"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: feature.color,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{feature.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-sm font-medium" style={{ color: feature.color }}>
                      {feature.tagline}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full border"
                  style={{ color: feature.color, borderColor: feature.color, background: `${feature.color}18` }}
                >
                  {feature.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{feature.description}</p>

              {/* Highlights */}
              <ul className="space-y-2 mb-6">
                {feature.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 text-green-500 flex-shrink-0">✓</span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={feature.link}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: feature.color }}
              >
                {feature.linkLabel}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture Callout ─────────────────────────────────────────── */}
      <section className="bg-gray-900 border-y border-gray-800 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">
              Built for <span className="text-green-400">Production</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The platform is architected for a seamless transition from development to production —
              TypeScript-only, Firebase-ready, and Stripe-wired.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'TypeScript-Only',
                desc: 'Zero JavaScript files in the source. Every component, service, and context is fully typed for reliability and maintainability.',
                color: '#3B82F6',
              },
              {
                icon: '🔥',
                title: 'Firebase-Ready',
                desc: 'Authentication is built on a Firebase-compatible interface. Switching from mock auth to production Firebase requires only environment variables.',
                color: '#F97316',
              },
              {
                icon: '💳',
                title: 'Stripe-Wired',
                desc: 'The payment service abstraction is pre-wired for Stripe. Activate real payments by setting VITE_USE_MOCK_DATA=false and adding your Stripe keys.',
                color: '#8B5CF6',
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-950 rounded-xl p-6 border border-gray-800">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: item.color }}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Five Pillars ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          The Five <span className="text-yellow-400">Pillars</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          Every feature maps back to the five foundational pillars of the [Unity Collective] mission.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { pillar: 'Unity', icon: '🤝', color: '#D22730' },
            { pillar: 'Economic Control', icon: '💰', color: '#FFD700' },
            { pillar: 'Self-Sufficiency', icon: '🌱', color: '#007A33' },
            { pillar: 'Protection', icon: '🛡️', color: '#2980B9' },
            { pillar: 'Our Narrative', icon: '📖', color: '#9B59B6' },
          ].map((p) => (
            <div
              key={p.pillar}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col items-center gap-3"
              style={{ borderTopWidth: '3px', borderTopColor: p.color }}
            >
              <span className="text-3xl">{p.icon}</span>
              <span className="text-sm font-semibold text-white text-center">{p.pillar}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-6 text-center"
        style={{
          background: `linear-gradient(rgba(10,10,10,0.88), rgba(10,10,10,0.95)), url(${communityHubBanner}) center/cover no-repeat`,
        }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Ready to <span className="text-red-500">Join</span> the Collective?
        </h2>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
          Every dollar spent is an investment in our shared future. Be part of the movement.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-lg transition-colors text-lg"
          >
            Visit the Platform
          </Link>
          <Link
            to="/directory"
            className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-10 py-4 rounded-lg transition-colors text-lg"
          >
            Browse Businesses
          </Link>
        </div>

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-green-700" />
        </div>
      </section>

    </div>
  );
};

export default PlatformShowcase;
