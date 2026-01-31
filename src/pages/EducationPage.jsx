import React from 'react';

const colors = {
  red: '#CC0000',
  black: '#1A1A1A',
  green: '#228B22',
  gold: '#FFD700',
  white: '#FAFAFA',
  gray: '#333333'
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
];

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
];

const communityStats = {
  members: "15,247",
  businesses: "3,892",
  events: "156",
  impact: "$2.3M"
};

function EducationPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Education & Resources
          </h1>
          <p className="text-xl text-gray-600">
            Empower yourself with knowledge and skills for community building and economic growth
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Educational content and resources coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default EducationPage;
