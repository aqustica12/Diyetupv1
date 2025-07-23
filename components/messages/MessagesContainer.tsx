'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClientsList from './ClientsList';
import MessageChat from './MessageChat';

export default function MessagesContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Calculate message stats
    calculateMessageStats();
  }, [selectedClient]);

  const calculateMessageStats = () => {
    try {
      // Get all clients
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      
      let totalCount = 0;
      let unreadCount = 0;
      
      // Count messages for each client
      clients.forEach((client: any) => {
        const clientMessages = JSON.parse(localStorage.getItem(`messages_${client.id}`) || '[]');
        totalCount += clientMessages.length;
        unreadCount += clientMessages.filter((msg: any) => msg.sender === 'client' && !msg.isRead).length;
      });
      
      setTotalMessages(totalCount);
      setUnreadMessages(unreadCount);
    } catch (error) {
      console.error('Error calculating message stats:', error);
    }
  };

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    if (isMobileView) {
      setShowChat(true);
    }
    
    // Mark messages as read
    if (client) {
      const clientMessages = JSON.parse(localStorage.getItem(`messages_${client.id}`) || '[]');
      const updatedMessages = clientMessages.map((msg: any) => {
        if (msg.sender === 'client' && !msg.isRead) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      
      localStorage.setItem(`messages_${client.id}`, JSON.stringify(updatedMessages));
      calculateMessageStats();
    }
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[calc(100vh-12rem)] flex overflow-hidden">
      {/* Clients List */}
      {(!isMobileView || !showChat) && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full md:w-1/3 border-r border-gray-200 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Mesajlar
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700"
                onClick={() => window.location.href = '/dashboard/clients/new'}
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Danışan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>Toplam: {totalMessages} mesaj</span>
              {unreadMessages > 0 && (
                <span className="font-medium text-green-600">Okunmamış: {unreadMessages}</span>
              )}
            </div>
          </div>
          
          {/* Clients */}
          <div className="flex-1 overflow-y-auto">
            <ClientsList 
              searchTerm={searchTerm}
              onSelectClient={handleSelectClient}
              selectedClientId={selectedClient?.id || null}
            />
          </div>
        </motion.div>
      )}
      
      {/* Chat Area */}
      {(!isMobileView || showChat) && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full md:w-2/3 flex flex-col"
        >
          {isMobileView && showChat && (
            <div className="p-2 border-b border-gray-200">
              <Button variant="ghost" size="sm" onClick={handleBackToList}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
            </div>
          )}
          
          <MessageChat 
            selectedClient={selectedClient} 
            onClose={isMobileView ? handleBackToList : undefined}
          />
        </motion.div>
      )}
    </div>
  );
}