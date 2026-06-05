import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { offerService } from '../services';
import type { CommunityPost } from '../data/mockOffers';

export const OffersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  const [offers, setOffers] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Load offers from service
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const data = await offerService.getAll();
        setOffers(data);
      } catch (error) {
        console.error('Error loading offers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOffers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-900/40 text-green-400';
      case 'in-progress':
        return 'bg-yellow-900/40 text-yellow-400';
      case 'completed':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
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

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading offers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Community Offers</h1>
          <p className="text-lg text-gray-400 mb-6">
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
                  className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="flex-1 sm:flex-none px-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
            <div className="text-3xl font-bold text-red-500 mb-1">{offers.length}</div>
            <div className="text-sm text-gray-400">Total Offers</div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {offers.filter(o => o.status === 'open').length}
            </div>
            <div className="text-sm text-gray-400">Open Offers</div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
            <div className="text-3xl font-bold text-yellow-500 mb-1">
              {offers.filter(o => o.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
            <div className="text-3xl font-bold text-gray-300 mb-1">
              {offers.reduce((sum, o) => sum + o.responses, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Responses</div>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No offers found</h3>
              <p className="text-gray-400 mb-6">
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
                className="block bg-[#1E1E1E] rounded-lg border border-white/10 hover:border-red-600/50 hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                    <p className="text-gray-400 line-clamp-2">{offer.description}</p>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    {offer.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {offer.responses} responses
                    </span>
                    <span>Posted by {offer.userName}</span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
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
