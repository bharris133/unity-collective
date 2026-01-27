import React, { useState } from 'react';
import { Search, Send, MoreVertical, ArrowLeft } from 'lucide-react';
import type { MessageThread, Message } from '../types';
import { mockThreads, mockMessages } from '../data';

export const MessagesPage: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data (imported from centralized mock data)

  const filteredThreads = mockThreads.filter(thread =>
    thread.participantNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    thread.relatedOfferTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;
    
    // TODO: Send message to Firestore
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const currentThread = mockThreads.find(t => t.id === selectedThread);
  const currentMessages = selectedThread ? mockMessages[selectedThread] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Threads List */}
          <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Threads */}
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
                      selectedThread === thread.id ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {thread.participantNames[1]} {/* Other participant */}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(thread.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    {thread.relatedOfferTitle && (
                      <p className="text-xs text-gray-500 mb-1">
                        Re: {thread.relatedOfferTitle}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-1">{thread.lastMessage}</p>
                    {thread.unreadCount > 0 && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                        {thread.unreadCount} new
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message View */}
          <div className={`flex-1 flex flex-col ${selectedThread ? 'flex' : 'hidden md:flex'}`}>
            {selectedThread && currentThread ? (
              <>
                {/* Thread Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedThread(null)}
                      className="md:hidden text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {currentThread.participantNames[1]}
                      </h2>
                      {currentThread.relatedOfferTitle && (
                        <p className="text-sm text-gray-500">
                          Re: {currentThread.relatedOfferTitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-gray-900">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {currentMessages.map((message) => {
                    const isOwn = message.senderId === 'user1'; // Current user
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              isOwn
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">Select a conversation</p>
                  <p className="text-sm">Choose a thread from the left to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
