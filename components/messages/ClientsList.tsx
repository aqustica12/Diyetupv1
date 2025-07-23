'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Clock, CheckCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientsListProps {
  searchTerm: string;
  onSelectClient: (client: any) => void;
  selectedClientId: string | null;
}

export default function ClientsList({ searchTerm, onSelectClient, selectedClientId }: ClientsListProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // Load clients from localStorage
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setClients([]);
        setLoading(false);
        return;
      }
      
      const savedClients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      
      // Add last message preview and unread count
      const clientsWithMessageInfo = savedClients.map((client: any) => {
        const clientMessages = JSON.parse(localStorage.getItem(`messages_${currentUserId}_${client.id}`) || '[]');
        const unreadCount = clientMessages.filter((msg: any) => msg.sender === 'client' && !msg.isRead).length;
        const lastMessage = clientMessages.length > 0 ? clientMessages[clientMessages.length - 1] : null;
        
        return {
          ...client,
          unreadCount,
          lastMessage,
          lastActive: lastMessage ? lastMessage.timestamp : null
        };
      });
      
      // Sort by last message time (most recent first)
      clientsWithMessageInfo.sort((a: any, b: any) => {
        if (!a.lastActive) return 1;
        if (!b.lastActive) return -1;
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      });
      
      setClients(clientsWithMessageInfo);
    } catch (error) {
      console.error('Clients loading error:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const getLastMessagePreview = (message: any) => {
    if (!message) return 'Henüz mesaj yok';
    if (message.hasImage && !message.content) return '🖼️ Görsel';
    return message.content.length > 30 ? message.content.substring(0, 30) + '...' : message.content;
  };

  const getLastMessageTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Dün';
    } else if (diffDays < 7) {
      // This week - show day name
      return messageDate.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else {
      // Older - show date
      return messageDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' });
    }
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Danışanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Danışan bulunamadı' : 'Henüz danışan yok'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Arama kriterlerine uygun danışan yok' : 'Henüz danışan yok'}
          </p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => window.location.href = '/dashboard/clients/new'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Danışan Ekle
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => onSelectClient(client)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                selectedClientId === client.id ? 'bg-green-50 border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {client.avatar ? (
                  <img
                    src={client.avatar}
                    alt={client.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {client.firstName} {client.lastName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {getLastMessageTime(client.lastActive)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate max-w-[180px]">
                      {client.lastMessage?.sender === 'dietitian' && (
                        <span className="text-xs text-gray-400 mr-1">Sen: </span>
                      )}
                      {getLastMessagePreview(client.lastMessage)}
                    </p>
                    
                    {client.unreadCount > 0 && (
                      <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {client.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}