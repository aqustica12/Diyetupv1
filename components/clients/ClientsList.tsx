'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Phone, Mail, Calendar, TrendingUp, Eye, Edit, Trash2, User, Plus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkClientLimit } from '@/lib/subscription';

interface ClientsListProps {
  searchTerm: string;
  filterStatus: string;
  sortBy: string;
}

export default function ClientsList({ searchTerm, filterStatus, sortBy }: ClientsListProps) {
  const router = useRouter();
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setClients([]);
        return;
      }
      const savedClients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      setClients(savedClients);
    } catch (error) {
      console.error('Danışanlar yüklenirken hata:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Bu danışanı silmek istediğinizden emin misiniz?')) {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) return;
      
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      localStorage.setItem(`clients_${currentUserId}`, JSON.stringify(updatedClients));
      
      // Seçili listeden de çıkar
      setSelectedClients(prev => prev.filter(id => id !== parseInt(clientId)));
    }
  };

  const handleViewClient = (client: any) => {
    router.push(`/dashboard/clients/${client.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'completed':
        return 'Tamamlandı';
      default:
        return 'Bilinmiyor';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const toggleClientSelection = (clientId: number) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Danışanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Abonelik kontrolü
  const currentUserId = localStorage.getItem('currentUserId');
  const limitCheck = currentUserId ? checkClientLimit(currentUserId) : { canAdd: false, message: 'Kullanıcı oturumu bulunamadı.' };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Danışan Listesi ({filteredClients.length})
          </h3>
          <div className="flex items-center space-x-2">
            {selectedClients.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedClients.length} seçili
                </span>
                <Button variant="outline" size="sm">
                  Toplu İşlem
                </Button>
              </div>
            )}
            <Button 
              onClick={() => {
                if (!limitCheck.canAdd) {
                  alert(limitCheck.message || 'Danışan ekleme sınırına ulaştınız.');
                  return;
                }
                router.push('/dashboard/clients/new');
              }}
              className={`${
                limitCheck.canAdd 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!limitCheck.canAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Danışan
              {!limitCheck.canAdd && (
                <AlertTriangle className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Abonelik uyarısı */}
        {!limitCheck.canAdd && limitCheck.message && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{limitCheck.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz danışan yok</h3>
          <p className="text-gray-500 mb-6">İlk danışanınızı ekleyerek başlayın</p>
          <Button 
            onClick={() => {
              if (!limitCheck.canAdd) {
                alert(limitCheck.message || 'Danışan ekleme sınırına ulaştınız.');
                return;
              }
              router.push('/dashboard/clients/new');
            }}
            className={`${
              limitCheck.canAdd 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!limitCheck.canAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            İlk Danışanı Ekle
            {!limitCheck.canAdd && (
              <AlertTriangle className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClients(filteredClients.map(c => parseInt(c.id)));
                      } else {
                        setSelectedClients([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danışan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İlerleme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedClients.includes(parseInt(client.id))}
                      onChange={() => toggleClientSelection(parseInt(client.id))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {client.avatar ? (
                        <img
                          src={client.avatar}
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-4">
                          {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{client.age ? `${client.age} yaş` : 'Yaş belirtilmemiş'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                      {getStatusText(client.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(client.progress || 0)}`}
                          style={{ width: `${client.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{client.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {client.currentWeight || client.weight || '-'} kg
                    </div>
                    {client.targetWeight && (
                      <div className="text-sm text-gray-500">
                        Hedef: {client.targetWeight} kg
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(client.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                     <Button 
                       size="sm"
                       title="Görüntüle"
                       onClick={() => handleViewClient(client)}>
                       <Eye className="w-4 h-4" />
                     </Button>
                      <Button variant="outline" size="sm" title="Düzenle">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      


      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredClients.length} danışanın tümü gösteriliyor
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Sonraki
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}