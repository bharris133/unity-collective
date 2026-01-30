import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Menu, X, Search, ShoppingCart, Users, BookOpen, Shield, 
  TrendingUp, Star, MapPin, Phone, Mail, Calendar, Play,
  Heart, Share2, MessageCircle, ChevronRight, Globe, Briefcase
} from 'lucide-react'
import './App.css'

// Import assets
import logoMain from './assets/logo_main.png'
import heroBanner from './assets/hero_banner.png'
import businessDirectoryIcon from './assets/business_directory_icon.png'
import communityHubBanner from './assets/community_hub_banner.png'

// Custom Pan-African color scheme
const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
}

// Sample data
const featuredBusinesses = [
  {
    id: 1,
    name: "Sankofa Consulting",
    category: "Business Services",
    location: "Atlanta, GA",
    rating: 4.9,
    description: "Strategic business consulting for Black entrepreneurs",
    image: "/api/placeholder/300/200",
    verified: true
  },
  {
    id: 2,
    name: "Heritage Foods Market",
    category: "Food & Beverage",
    location: "Detroit, MI",
    rating: 4.8,
    description: "Authentic African and Caribbean cuisine and groceries",
    image: "/api/placeholder/300/200",
    verified: true
  },
  {
    id: 3,
    name: "Unity Tech Solutions",
    category: "Technology",
    location: "Oakland, CA",
    rating: 5.0,
    description: "Custom software development and IT services",
    image: "/api/placeholder/300/200",
    verified: true
  }
]

const communityStats = {
  members: "15,247",
  businesses: "3,892",
  events: "156",
  impact: "$2.3M"
}

const upcomingEvents = [
  {
    id: 1,
    title: "Economic Empowerment Webinar",
    date: "2025-08-25",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 234
  },
  {
    id: 2,
    title: "Black Business Networking Mixer",
    date: "2025-09-02",
    time: "6:00 PM EST",
    type: "In-Person",
    location: "Atlanta, GA",
    attendees: 89
  },
  {
    id: 3,
    title: "Financial Literacy Workshop",
    date: "2025-09-10",
    time: "2:00 PM EST",
    type: "Virtual",
    attendees: 156
  }
]

// Navigation Component
function Navigation({ isMenuOpen, setIsMenuOpen }) {
  const location = useLocation()
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Community Hub', path: '/community' },
    { name: 'Business Directory', path: '/directory' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Education', path: '/education' },
    { name: 'Media Center', path: '/media' },
    { name: 'About', path: '/about' }
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logoMain} alt="Unity Collective" className="h-10 w-10" />
              <span className="text-xl font-bold" style={{ color: colors.black }}>
                Unity Collective
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-gray-700 hover:text-white hover:bg-opacity-75'
                  }`}
                  style={{
                    backgroundColor: location.pathname === item.path ? colors.red : 'transparent',
                    ':hover': { backgroundColor: colors.red }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-gray-700 hover:text-white'
                }`}
                style={{
                  backgroundColor: location.pathname === item.path ? colors.red : 'transparent'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

// Home Page Component
function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Empowering Our Community Through Unity and Economic Strength
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Building a stronger Black community through the five pillars: Unity, Economic Control, 
            Self-Sufficiency, Protection, and Control of Our Narrative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-white px-8 py-3"
              style={{ backgroundColor: colors.red }}
            >
              Join Our Community
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
            >
              Explore Businesses
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: colors.red }}>
                {communityStats.members}
              </div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: colors.green }}>
                {communityStats.businesses}
              </div>
              <div className="text-gray-600">Black-Owned Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: colors.gold }}>
                {communityStats.events}
              </div>
              <div className="text-gray-600">Educational Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: colors.black }}>
                {communityStats.impact}
              </div>
              <div className="text-gray-600">Economic Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
              The Five Pillars of Community Empowerment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our foundation is built on five essential pillars that strengthen our community 
              and ensure our collective success and independence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Unity",
                icon: <Users className="h-8 w-8" />,
                description: "A scattered community is easily broken. We put aside divisions and recognize our shared destiny to stand strong against external pressures.",
                color: colors.red
              },
              {
                title: "Economic Control",
                icon: <TrendingUp className="h-8 w-8" />,
                description: "Support Black-owned businesses, keep money circulating within our community, and own land to ensure our future is not controlled by others.",
                color: colors.green
              },
              {
                title: "Self-Sufficiency",
                icon: <BookOpen className="h-8 w-8" />,
                description: "Learn essential, practical skills like farming, trades, security, and first aid - necessities for survival when established systems collapse.",
                color: colors.gold
              },
              {
                title: "Protection",
                icon: <Shield className="h-8 w-8" />,
                description: "We cannot rely on external forces for safety. We must train, organize, and watch over our own neighborhoods to protect our people from harm.",
                color: colors.black
              },
              {
                title: "Control of Our Narrative",
                icon: <Globe className="h-8 w-8" />,
                description: "Build and support media that portrays our community with dignity and strength, preventing outsiders from twisting our story to justify oppression.",
                color: colors.red
              }
            ].map((pillar, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="p-3 rounded-full text-white"
                      style={{ backgroundColor: pillar.color }}
                    >
                      {pillar.icon}
                    </div>
                    <CardTitle className="text-xl">{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
                Featured Black-Owned Businesses
              </h2>
              <p className="text-xl text-gray-600">
                Discover and support businesses that strengthen our community
              </p>
            </div>
            <Link to="/directory">
              <Button 
                variant="outline" 
                className="hidden md:flex items-center space-x-2"
                style={{ borderColor: colors.red, color: colors.red }}
              >
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{business.name}</span>
                        {business.verified && (
                          <Badge 
                            variant="secondary" 
                            className="text-white"
                            style={{ backgroundColor: colors.green }}
                          >
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span>{business.category}</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{business.location}</span>
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{business.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{business.description}</p>
                  <Button 
                    className="w-full text-white"
                    style={{ backgroundColor: colors.red }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
              Upcoming Community Events
            </h2>
            <p className="text-xl text-gray-600">
              Join us for educational webinars, networking events, and community building activities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge 
                      variant={event.type === 'Virtual' ? 'secondary' : 'outline'}
                      style={{ 
                        backgroundColor: event.type === 'Virtual' ? colors.green : 'transparent',
                        color: event.type === 'Virtual' ? 'white' : colors.green,
                        borderColor: colors.green
                      }}
                    >
                      {event.type}
                    </Badge>
                    <div className="text-right text-sm text-gray-500">
                      <div>{event.date}</div>
                      <div>{event.time}</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  {event.location && (
                    <CardDescription className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                    <Button 
                      size="sm"
                      style={{ backgroundColor: colors.red }}
                      className="text-white"
                    >
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16" style={{ backgroundColor: colors.black }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Stay Connected with Our Community
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest updates on community events, business opportunities, and empowerment resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1"
            />
            <Button 
              className="text-white px-8"
              style={{ backgroundColor: colors.red }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Business Directory Component
function BusinessDirectory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Business Services', 'Food & Beverage', 'Technology', 'Retail', 'Healthcare', 'Education']
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Black Business Directory
          </h1>
          <p className="text-xl text-gray-600">
            Discover and support Black-owned businesses in your community
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Business Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{business.name}</span>
                      {business.verified && (
                        <Badge 
                          variant="secondary" 
                          className="text-white"
                          style={{ backgroundColor: colors.green }}
                        >
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span>{business.category}</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{business.location}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{business.description}</p>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 text-white"
                    style={{ backgroundColor: colors.red }}
                  >
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Community Hub Component
function CommunityHub() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Community Hub
          </h1>
          <p className="text-xl text-gray-600">
            Connect, collaborate, and build together as one unified community
          </p>
        </div>
        
        {/* Community Banner */}
        <div className="mb-12">
          <div 
            className="relative h-64 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${communityHubBanner})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Building Stronger Communities Together</h2>
                <Button 
                  className="text-white px-8"
                  style={{ backgroundColor: colors.red }}
                >
                  Join Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Discussion Forums",
              description: "Engage in meaningful conversations about community issues and opportunities",
              icon: <MessageCircle className="h-8 w-8" />,
              color: colors.red
            },
            {
              title: "Local Chapters",
              description: "Find and connect with Unity Collective members in your area",
              icon: <MapPin className="h-8 w-8" />,
              color: colors.green
            },
            {
              title: "Mentorship Program",
              description: "Connect with experienced community leaders and entrepreneurs",
              icon: <Users className="h-8 w-8" />,
              color: colors.gold
            },
            {
              title: "Resource Library",
              description: "Access educational materials, templates, and community resources",
              icon: <BookOpen className="h-8 w-8" />,
              color: colors.black
            },
            {
              title: "Event Calendar",
              description: "Stay updated on community events, workshops, and networking opportunities",
              icon: <Calendar className="h-8 w-8" />,
              color: colors.red
            },
            {
              title: "Success Stories",
              description: "Celebrate community achievements and learn from others' experiences",
              icon: <Star className="h-8 w-8" />,
              color: colors.green
            }
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="p-3 rounded-full text-white"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
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
  )
}

// About Page Component
function AboutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            About Unity Collective
          </h1>
          <p className="text-xl text-gray-600">
            Empowering the Black community through unity, economic strength, and collective action
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.red }}>Our Mission</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Unity Collective is dedicated to bringing together, organizing, and empowering the Black community 
              economically and socially to move as a unified group. We believe in the power of community, 
              the importance of supporting Black-owned businesses, and the necessity of working together to 
              build a strong, supportive network that advances initiatives important to the collective Black 
              and Pan-African communities.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.green }}>Our Foundation</h2>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Our work is built upon five essential pillars that form the foundation of community empowerment:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Unity", description: "Building cohesion and shared purpose within our community" },
                { title: "Economic Control", description: "Supporting Black-owned businesses and community wealth circulation" },
                { title: "Self-Sufficiency", description: "Developing essential skills and capabilities for independence" },
                { title: "Protection", description: "Ensuring community safety and security through collective action" },
                { title: "Control of Our Narrative", description: "Creating and supporting independent media and storytelling" }
              ].map((pillar, index) => (
                <div key={index} className="p-4 border-l-4" style={{ borderColor: colors.gold }}>
                  <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                  <p className="text-gray-600">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.black }}>Strategic Principles</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We also incorporate strategic principles that guide our long-term approach to community building:
              long-term strategic thinking, unity and collective action, economic independence and self-reliance, 
              strategic patience and persistence, intelligence and information control, and building alliances and networks.
            </p>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              className="text-white px-8 py-3"
              style={{ backgroundColor: colors.red }}
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Placeholder components for other pages
function Marketplace() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>Marketplace</h1>
        <p className="text-xl text-gray-600">Shop from Black-owned businesses and support our community</p>
        {/* Marketplace functionality would be implemented here */}
      </div>
    </div>
  )
}

function Education() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>Education Center</h1>
        <p className="text-xl text-gray-600">Access resources, courses, and workshops for community empowerment</p>
        {/* Education functionality would be implemented here */}
      </div>
    </div>
  )
}

function MediaCenter() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>Media Center</h1>
        <p className="text-xl text-gray-600">Latest content from our YouTube channel and community news</p>
        {/* Media center functionality would be implemented here */}
      </div>
    </div>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="py-12" style={{ backgroundColor: colors.black }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoMain} alt="Unity Collective" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">Unity Collective</span>
            </div>
            <p className="text-gray-300">
              Empowering the Black community through unity and economic strength.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/community" className="text-gray-300 hover:text-white">Community Hub</Link></li>
              <li><Link to="/directory" className="text-gray-300 hover:text-white">Business Directory</Link></li>
              <li><Link to="/education" className="text-gray-300 hover:text-white">Education</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-300 hover:text-white">Marketplace</Link></li>
              <li><Link to="/media" className="text-gray-300 hover:text-white">Media Center</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="space-y-2">
              <div className="text-gray-300">Follow our YouTube channel</div>
              <div className="text-gray-300">Join us on TikTok</div>
              <div className="text-gray-300">Subscribe to our newsletter</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Unity Collective. All rights reserved. Built with pride for our community.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Router>
      <div className="App">
        <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/directory" element={<BusinessDirectory />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/education" element={<Education />} />
          <Route path="/media" element={<MediaCenter />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

