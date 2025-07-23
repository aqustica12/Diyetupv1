'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  HeadphonesIcon, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  User,
  Calendar,
  Tag,
  X,
  Search,
  Filter,
  Eye,
  Reply,
  Settings,
  Shield
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
  userId: string;
  userName: string;
}

interface SupportResponse {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  userName: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const priorities = [
    { value: 'low', label: 'Düşük', color: 'text-green-600' },
    { value: 'medium', label: 'Orta', color: 'text-yellow-600' },
    { value: 'high', label: 'Yüksek', color: 'text-red-600' }
  ];

  const statuses = [
    { value: 'open', label: 'Açık', color: 'text-blue-600' },
    { value: 'in_progress', label: 'İşlemde', color: 'text-yellow-600' },
    { value: 'resolved', label: 'Çözüldü', color: 'text-green-600' },
    { value: 'closed', label: 'Kapalı', color: 'text-gray-600' }
  ];

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    try {
      const adminTickets = JSON.parse(localStorage.getItem('adminSupportTickets') || '[]');
      setTickets(adminTickets);
    } catch (error) {
      console.error('Destek talepleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'open': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return priorityMap[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'open': 'Açık',
      'in_progress': 'İşlemde',
      'resolved': 'Çözüldü',
      'closed': 'Kapalı'
    };
    return statusMap[status] || 'Bilinmiyor';
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'low': 'Düşük',
      'medium': 'Orta',
      'high': 'Yüksek'
    };
    return priorityMap[priority] || 'Bilinmiyor';
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'technical': 'Teknik Sorun',
      'billing': 'Ödeme Sorunu',
      'feature': 'Özellik İsteği',
      'bug': 'Hata Bildirimi',
      'general': 'Genel Soru'
    };
    return categoryMap[category] || 'Bilinmiyor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !selectedTicket) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response: SupportResponse = {
        id: Date.now().toString(),
        message: message,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        userName: `${user.firstName} ${user.lastName}`
      };

      const updatedTicket = {
        ...selectedTicket,
        responses: [...selectedTicket.responses, response],
        updatedAt: new Date().toISOString()
      };

      // Update admin tickets
      const adminTickets = JSON.parse(localStorage.getItem('adminSupportTickets') || '[]');
      const updatedAdminTickets = adminTickets.map((t: SupportTicket) => 
        t.id === selectedTicket.id ? updatedTicket : t
      );
      localStorage.setItem('adminSupportTickets', JSON.stringify(updatedAdminTickets));

      // Update user's ticket
      const userTickets = JSON.parse(localStorage.getItem(`supportTickets_${selectedTicket.userId}`) || '[]');
      const updatedUserTickets = userTickets.map((t: SupportTicket) => 
        t.id === selectedTicket.id ? updatedTicket : t
      );
      localStorage.setItem(`supportTickets_${selectedTicket.userId}`, JSON.stringify(updatedUserTickets));

      setSelectedTicket(updatedTicket);
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      toast.success('Yanıt gönderildi');
    } catch (error) {
      toast.error('Yanıt gönderilirken hata oluştu');
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return { ...ticket, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return ticket;
      });

      // Update admin tickets
      localStorage.setItem('adminSupportTickets', JSON.stringify(updatedTickets));

      // Update user's ticket
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        const userTickets = JSON.parse(localStorage.getItem(`supportTickets_${ticket.userId}`) || '[]');
        const updatedUserTickets = userTickets.map((t: SupportTicket) => 
          t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
        );
        localStorage.setItem(`supportTickets_${ticket.userId}`, JSON.stringify(updatedUserTickets));
      }

      setTickets(updatedTickets);
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTickets.find(t => t.id === ticketId) || null);
      }
      toast.success('Durum güncellendi');
    } catch (error) {
      toast.error('Durum güncellenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Ticket List */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Admin Destek</h1>
            </div>
            <div className="text-sm text-gray-500">
              {tickets.length} talep
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Talep ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Tüm Durumlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Tüm Öncelikler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {tickets.length === 0 ? 'Henüz destek talebi yok' : 'Arama sonucu bulunamadı'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {ticket.userName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MessageSquare className="w-3 h-3" />
                      <span>{ticket.responses.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedTicket ? (
          <AdminChatPanel 
            ticket={selectedTicket} 
            onSendMessage={handleSendMessage}
            onStatusChange={handleStatusChange}
            onClose={() => setSelectedTicket(null)}
            getCategoryText={getCategoryText}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            statuses={statuses}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Bir destek talebi seçin</p>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

// Admin Chat Panel Component
function AdminChatPanel({ 
  ticket, 
  onSendMessage, 
  onStatusChange,
  onClose,
  getCategoryText,
  getPriorityColor,
  getPriorityText,
  getStatusColor,
  getStatusText,
  statuses
}: { 
  ticket: SupportTicket; 
  onSendMessage: (message: string) => void; 
  onStatusChange: (ticketId: string, status: string) => void;
  onClose: () => void;
  getCategoryText: (category: string) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityText: (priority: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  statuses: any[];
}) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{ticket.title}</h2>
            <p className="text-sm text-gray-500">{ticket.userName}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                {getStatusText(ticket.status)}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                {getPriorityText(ticket.priority)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={ticket.status} onValueChange={(value) => onStatusChange(ticket.id, value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Initial message */}
        <div className="flex justify-start">
          <div className="max-w-xs lg:max-w-md">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-900">{ticket.description}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTime(ticket.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Responses */}
        {ticket.responses.map((response) => (
          <div key={response.id} className={`flex ${response.isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${response.isAdmin ? 'bg-green-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
              <p className="text-sm">{response.message}</p>
              <p className={`text-xs mt-1 ${response.isAdmin ? 'text-green-100' : 'text-gray-500'}`}>
                {formatTime(response.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Yanıtınızı yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 