import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Offer } from '../types';

export const OffersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');

  // Mock offers data (will be replaced with Firestore)
  const mockOffers: Offer[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Smith',
      title: 'Looking for Web Development Services',
      description: 'Need a professional website for my new business. Willing to trade graphic design services or pay.',
      category: 'Services',
      status: 'open',
      responses: 3,
      createdAt: new Date('2025-01-20'),
      updatedAt: new Date('2025-01-20'),
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Johnson',
      title: 'Offering Catering Services',
      description: 'Professional catering for events. Looking for marketing help or photography services in exchange.',
      category: 'Food & Beverage',
      status: 'in-progress',
      responses: 5,
      createdAt: new Date('2025-01-19'),
      updatedAt: new Date('2025-01-21'),
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Marcus Williams',
      title: 'Need Logo Design',
      description: 'Starting a new clothing brand and need a professional logo. Can trade social media management or cash.',
      category: 'Design',
      status: 'open',
      responses: 8,
      createdAt: new Date('2025-01-18'),
      updatedAt: new Date('2025-01-18'),
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Lisa Brown',
      title: 'Photography Services Available',
      description: 'Professional photographer offering portrait and event photography. Open to trades or cash.',
      category: 'Services',
      status: 'completed',
      responses: 2,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-22'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredOffers = mockOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Offers</h1>
          <p className="text-lg text-gray-600 mb-6">
            Connect with community members to trade services, barter, or collaborate
          </p>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <Link
                to="/offers/create"
                className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Offer
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600 mb-1">{mockOffers.length}</div>
            <div className="text-sm text-gray-600">Total Offers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {mockOffers.filter(o => o.status === 'open').length}
            </div>
            <div className="text-sm text-gray-600">Open Offers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {mockOffers.filter(o => o.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {mockOffers.reduce((sum, o) => sum + o.responses, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to create an offer!'}
              </p>
              <Link
                to="/offers/create"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <Plus className="h-5 w-5" />
                Create Offer
              </Link>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <Link
                key={offer.id}
                to={`/offers/${offer.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{offer.description}</p>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    {offer.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">{offer.userName}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{offer.category}</span>
                    <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600 font-medium">
                    <MessageCircle className="h-4 w-4" />
                    {offer.responses} {offer.responses === 1 ? 'response' : 'responses'}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
