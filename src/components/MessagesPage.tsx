import React, { useState, useEffect } from 'react';
import { Search, Send, MoreVertical, ArrowLeft } from 'lucide-react';
import { messageService } from '../services/messageService';
import { useAuth } from '../contexts/AuthContext';
import type { MessageThread, Message } from '../data/mockMessages';

export const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load threads on mount
  useEffect(() => {
    messageService.getAllThreads().then(data => {
      setThreads(data);
      setLoading(false);
    });
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (!selectedThread) { setMessages([]); return; }
    messageService.getMessagesByThreadId(selectedThread).then(setMessages);
    messageService.markThreadAsRead(selectedThread);
  }, [selectedThread]);

  const filteredThreads = threads.filter(t =>
    t.participantNames.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
    t.relatedOfferTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedThread || !currentUser) return;
    const sent = await messageService.sendMessage(
      selectedThread,
      currentUser.uid,
      currentUser.displayName ?? 'You',
      messageText.trim()
    );
    if (sent) setMessages(prev => [...prev, sent]);
    setMessageText('');
  };

  const currentThread = threads.find(t => t.id === selectedThread);

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <div className="bg-[#1A1A1A] border-b border-white/10 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Thread list */}
          <div className={`w-full md:w-96 bg-[#1A1A1A] border-r border-white/10 flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-gray-400"><p>No conversations yet</p></div>
              ) : (
                filteredThreads.map(thread => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full p-4 border-b border-white/10 hover:bg-white/5 transition text-left ${selectedThread === thread.id ? 'bg-red-900/30' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{thread.participantNames[1]}</h3>
                      <span className="text-xs text-gray-500">{thread.lastMessageTime.toLocaleDateString()}</span>
                    </div>
                    {thread.relatedOfferTitle && (
                      <p className="text-xs text-gray-500 mb-1">Re: {thread.relatedOfferTitle}</p>
                    )}
                    <p className="text-sm text-gray-400 line-clamp-1">{thread.lastMessage}</p>
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

          {/* Message view */}
          <div className={`flex-1 flex flex-col ${selectedThread ? 'flex' : 'hidden md:flex'}`}>
            {selectedThread && currentThread ? (
              <>
                <div className="bg-[#1A1A1A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedThread(null)} className="md:hidden text-gray-400 hover:text-white">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="font-semibold text-white">{currentThread.participantNames[1]}</h2>
                      {currentThread.relatedOfferTitle && (
                        <p className="text-sm text-gray-400">Re: {currentThread.relatedOfferTitle}</p>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white"><MoreVertical className="h-5 w-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#111111]">
                  {messages.map(message => {
                    const isOwn = message.senderId === currentUser?.uid;
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-lg px-4 py-2 ${isOwn ? 'bg-red-600 text-white' : 'bg-[#2A2A2A] text-white border border-white/10'}`}>
                            <p>{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#1A1A1A] border-t border-white/10 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-white/20 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              <div className="flex-1 flex items-center justify-center bg-[#111111]">
                <div className="text-center text-gray-400">
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
