'use client';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Users as UsersIcon,
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Package,
  CalendarDays,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'dietitian' | 'client';
  package: 'basic' | 'premium' | 'corporate';
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastLogin: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  remainingDays: number;
  address: string;
  city: string;
  notes: string;
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'dietitians' | 'clients'>('dietitians');
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
    loadClients();
    
    // Paket yükseltme event'ini dinle
    const handleSubscriptionUpdate = () => {
      loadUsers();
    };
    
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    
    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, []);

  const loadUsers = () => {
    try {
      // Gerçek kayıt olan diyetisyenleri localStorage'dan yükle
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      console.log('localStorage registeredUsers:', registeredUsers);
      
      const realUsers: User[] = Object.values(registeredUsers)
        .filter((userData: any) => userData.user.title !== 'Danışan' && userData.user.userType !== 'client')
        .map((userData: any) => {
          console.log('Processing userData:', userData);
          const user = userData.user;
          const subscriptionData = JSON.parse(localStorage.getItem(`subscription_${user.id}`) || '{}');
          console.log('Subscription data for user:', user.id, subscriptionData);
          
          // Tarih değerlerini kontrol et ve güvenli hale getir
          const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
          const trialEndDate = subscriptionData.trialEndDate ? 
            new Date(subscriptionData.trialEndDate) : 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          const remainingDays = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          // Paket bilgisini subscription verilerinden al (güncel)
          let currentPackage: 'basic' | 'premium' | 'corporate' = 'basic';
          if (subscriptionData.plan) {
            currentPackage = subscriptionData.plan === 'basic' ? 'basic' : 
                           subscriptionData.plan === 'professional' ? 'premium' : 'corporate';
          } else if (user.subscription) {
            currentPackage = user.subscription === 'basic' ? 'basic' : 
                           user.subscription === 'professional' ? 'premium' : 'corporate';
          }
          
          // Status hesaplama - gerçek durumu kontrol et
          let userStatus: 'active' | 'inactive' | 'suspended' = 'inactive';
          if (subscriptionData.status === 'active' || subscriptionData.status === 'trial') {
            userStatus = 'active';
          } else if (subscriptionData.status === 'expired') {
            userStatus = 'inactive';
          } else if (remainingDays > 0) {
            userStatus = 'active';
          } else {
            userStatus = 'inactive';
          }

          // Diyetisyenin danışan sayısını hesapla
          const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
          const clientCount = clients.length;
          
          const processedUser: User = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '+90 555 000 0000',
            role: 'dietitian',
            package: currentPackage,
            status: userStatus,
            registrationDate: createdAt.toISOString().split('T')[0],
            lastLogin: new Date().toISOString().split('T')[0],
            subscriptionStart: createdAt.toISOString().split('T')[0],
            subscriptionEnd: trialEndDate.toISOString().split('T')[0],
            remainingDays: remainingDays,
            address: user.clinic || '',
            city: 'İstanbul',
            notes: `${user.title} - ${user.clinic || 'Klinik bilgisi yok'} - Danışan Sayısı: ${clientCount}`
          };
          console.log('Processed user:', processedUser);
          return processedUser;
        });

      console.log('Real users loaded:', realUsers);

      // Mock verileri de ekle (admin ve demo kullanıcılar)
      const mockUsers: User[] = [
        {
          id: 'admin-1',
          firstName: 'Dr. Admin',
          lastName: 'User',
          email: 'admin@diyetup.com',
          phone: '+90 555 123 4567',
          role: 'admin',
          package: 'corporate',
          status: 'active',
          registrationDate: '2024-01-15',
          lastLogin: '2024-12-19',
          subscriptionStart: '2024-01-15',
          subscriptionEnd: '2025-01-15',
          remainingDays: 27,
          address: 'Atatürk Caddesi No:123',
          city: 'İstanbul',
          notes: 'Sistem yöneticisi'
        },
        {
          id: 'demo-1',
          firstName: 'Diyetisyen Demo',
          lastName: 'User',
          email: 'demo@diyetup.com',
          phone: '+90 555 987 6543',
          role: 'dietitian',
          package: 'premium',
          status: 'active',
          registrationDate: '2024-02-20',
          lastLogin: '2024-12-18',
          subscriptionStart: '2024-02-20',
          subscriptionEnd: '2025-02-20',
          remainingDays: 63,
          address: 'Cumhuriyet Mahallesi No:45',
          city: 'Ankara',
          notes: 'Deneyimli diyetisyen'
        }
      ];

      // Gerçek kullanıcıları ve mock kullanıcıları birleştir
      const allUsers = [...realUsers, ...mockUsers];
      console.log('All users to be set:', allUsers);
      setUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const loadClients = () => {
    try {
      const allClients: any[] = [];
      
      // Tüm diyetisyenlerin danışanlarını topla
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.values(registeredUsers).forEach((userData: any) => {
        const user = userData.user;
        if (user.title !== 'Danışan' && user.userType !== 'client') {
          const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
          clients.forEach((client: any) => {
            allClients.push({
              ...client,
              dietitianName: `${user.firstName} ${user.lastName}`,
              dietitianId: user.id
            });
          });
        }
      });
      
      setClients(allClients);
    } catch (error) {
      console.error('Danışanlar yüklenirken hata:', error);
    }
  };

  // Kullanıcı listesini yenile
  const refreshUsers = () => {
    loadUsers();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'dietitian':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'client':
        return <UsersIcon className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'dietitian':
        return 'Diyetisyen';
      case 'client':
        return 'Müşteri';
      default:
        return 'Bilinmiyor';
    }
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'corporate':
        return 'bg-red-100 text-red-700';
      case 'premium':
        return 'bg-purple-100 text-purple-700';
      case 'basic':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPackageText = (packageType: string) => {
    switch (packageType) {
      case 'corporate':
        return 'Kurumsal';
      case 'premium':
        return 'Premium';
      case 'basic':
        return 'Temel';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
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
      case 'suspended':
        return 'Askıya Alınmış';
      default:
        return 'Bilinmiyor';
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      toast.success('Kullanıcı silindi');
    }
  };

  const handleCreateUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      remainingDays: Math.ceil((new Date(newUser.subscriptionEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    };
    
    // Kullanıcıyı localStorage'a da kaydet (gerçek kayıt verileri gibi)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    registeredUsers[user.email] = {
      password: 'admin-created', // Admin tarafından oluşturulan kullanıcılar için
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        title: user.role === 'dietitian' ? 'Diyetisyen' : user.role === 'admin' ? 'Admin' : 'Müşteri',
        clinic: user.address,
        subscription: user.package,
        createdAt: user.registrationDate
      }
    };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Abonelik bilgilerini kaydet
    const subscriptionData = {
      plan: user.package,
      planName: user.package === 'basic' ? 'Başlangıç' : user.package === 'premium' ? 'Profesyonel' : 'Kurumsal',
      planPrice: user.package === 'basic' ? 'Ücretsiz' : user.package === 'premium' ? '₺499' : '₺999',
      startDate: user.subscriptionStart,
      trialEndDate: user.subscriptionEnd,
      isTrialActive: user.remainingDays > 0,
      nextBillingDate: user.subscriptionEnd,
      status: user.remainingDays > 0 ? 'active' : 'expired',
      selectedPlanAtRegistration: user.package,
      billingHistory: []
    };
    localStorage.setItem(`subscription_${user.id}`, JSON.stringify(subscriptionData));

    setUsers([...users, user]);
    setShowCreateModal(false);
    toast.success('Yeni kullanıcı oluşturuldu');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesPackage = filterPackage === 'all' || user.package === filterPackage;
    return matchesSearch && matchesRole && matchesPackage;
  });

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.dietitianName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Kullanıcılar yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {
              loadUsers();
              loadClients();
            }}>
              <RefreshCw className="mr-2 h-4 w-4" /> Yenile
            </Button>
            {activeTab === 'dietitians' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" /> Yeni Kullanıcı Ekle
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dietitians')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'dietitians'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Diyetisyenler ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'clients'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UsersIcon className="w-4 h-4 inline mr-2" />
              Danışanlar ({filteredClients.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={activeTab === 'dietitians' ? "Diyetisyen ara..." : "Danışan ara..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {activeTab === 'dietitians' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">Tüm Roller</option>
                    <option value="admin">Admin</option>
                    <option value="dietitian">Diyetisyen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paket</label>
                  <select
                    value={filterPackage}
                    onChange={(e) => setFilterPackage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">Tüm Paketler</option>
                    <option value="basic">Temel</option>
                    <option value="premium">Premium</option>
                    <option value="corporate">Kurumsal</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Filtrele
              </Button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'dietitians' ? (
          /* Diyetisyenler Tablosu */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KULLANICI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PAKET
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DURUM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ABONELİK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DANIŞAN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KAYIT TARİHİ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SON GİRİŞ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EYLEMLER
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2 text-sm text-gray-900">{getRoleText(user.role)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPackageColor(user.package)}`}>
                          {getPackageText(user.package)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {user.remainingDays > 0 ? (
                              <span className="text-green-600">{user.remainingDays} gün kaldı</span>
                            ) : (
                              <span className="text-red-600">Süresi dolmuş</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-1" />
                            <span>
                              {(() => {
                                const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
                                const activeClients = clients.filter((client: any) => client.status !== 'archived').length;
                                const limit = user.package === 'corporate' ? 'Sınırsız' : (user.package === 'premium' ? 100 : 25);
                                return user.package === 'corporate' ? `${activeClients}/${limit}` : `${activeClients}/${limit}`;
                              })()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(() => {
                              const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
                              const activeClients = clients.filter((client: any) => client.status !== 'archived').length;
                              if (user.package === 'corporate') {
                                return 'Sınırsız';
                              }
                              const limit = user.package === 'premium' ? 100 : 25;
                              const percentage = Math.min((activeClients / limit) * 100, 100);
                              return percentage > 80 ? 'Limit dolmak üzere' : percentage > 60 ? 'Orta kullanım' : 'Normal';
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.registrationDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewUser(user)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Danışanlar Tablosu */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DANIŞAN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DİYETİSYEN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İLETİŞİM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DURUM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KAYIT TARİHİ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EYLEMLER
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm text-gray-900">{client.dietitianName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center mt-1">
                              <Phone className="w-4 h-4 mr-1" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {client.status === 'active' ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(client.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <UserDetailModal 
            user={selectedUser} 
            onClose={() => setShowUserModal(false)} 
          />
        )}

        {/* User Edit Modal */}
        {showEditModal && selectedUser && (
          <UserEditModal 
            user={selectedUser} 
            onClose={() => setShowEditModal(false)}
            onSave={(updatedUser) => {
              const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
              setUsers(updatedUsers);
              setShowEditModal(false);
              toast.success('Kullanıcı güncellendi');
            }}
          />
        )}

        {/* User Create Modal */}
        {showCreateModal && (
          <UserCreateModal 
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateUser}
          />
        )}
      </div>
    </>
  );
}

// User Detail Modal Component
interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'dietitian':
        return 'Diyetisyen';
      case 'client':
        return 'Müşteri';
      default:
        return 'Bilinmiyor';
    }
  };

  const getPackageText = (packageType: string) => {
    switch (packageType) {
      case 'corporate':
        return 'Kurumsal';
      case 'premium':
        return 'Premium';
      case 'basic':
        return 'Temel';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'suspended':
        return 'Askıya Alınmış';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kullanıcı Detayları</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Ad Soyad:</span>
                <span className="ml-2 text-sm font-medium">{user.firstName} {user.lastName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">E-posta:</span>
                <span className="ml-2 text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Telefon:</span>
                <span className="ml-2 text-sm font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Adres:</span>
                <span className="ml-2 text-sm font-medium">{user.address}, {user.city}</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Rol:</span>
                <span className="ml-2 text-sm font-medium">{getRoleText(user.role)}</span>
              </div>
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Paket:</span>
                <span className="ml-2 text-sm font-medium">{getPackageText(user.package)}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Durum:</span>
                <span className="ml-2 text-sm font-medium">{getStatusText(user.status)}</span>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonelik Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">Abonelik Başlangıcı</span>
                </div>
                <p className="text-sm text-gray-600">{new Date(user.subscriptionStart).toLocaleDateString('tr-TR')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">Abonelik Bitişi</span>
                </div>
                <p className="text-sm text-gray-600">{new Date(user.subscriptionEnd).toLocaleDateString('tr-TR')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">Kalan Gün</span>
                </div>
                <p className={`text-sm font-medium ${user.remainingDays > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {user.remainingDays > 0 ? `${user.remainingDays} gün` : 'Süresi dolmuş'}
                </p>
              </div>
            </div>
          </div>



          {/* Client Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danışan Bilgileri</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Danışan Sayısı</span>
                <span className="text-sm text-gray-600">
                  {(() => {
                    const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
                    const activeClients = clients.filter((client: any) => client.status !== 'archived').length;
                    return activeClients;
                  })()}
                  /{(() => {
                    const planLimits = {
                      'basic': 25,
                      'premium': 100,
                      'corporate': 'Sınırsız'
                    };
                    return planLimits[user.package] || 25;
                  })()}
                </span>
              </div>
              {user.package !== 'corporate' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (() => {
                        const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
                        const activeClients = clients.filter((client: any) => client.status !== 'archived').length;
                        const limit = user.package === 'premium' ? 100 : 25;
                        const percentage = Math.min((activeClients / limit) * 100, 100);
                        return percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500';
                      })()
                    }`}
                    style={{ 
                      width: `${(() => {
                        const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
                        const activeClients = clients.filter((client: any) => client.status !== 'archived').length;
                        const limit = user.package === 'premium' ? 100 : 25;
                        return Math.min((activeClients / limit) * 100, 100);
                      })()}%` 
                    }}
                  ></div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {(() => {
                  if (user.package === 'corporate') {
                    return '✅ Sınırsız danışan. Hiçbir kısıtlama yok.';
                  }
                  const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
                  const activeClients = clients.filter((client: any) => client.status !== 'archived').length;
                  const limit = user.package === 'premium' ? 100 : 25;
                  const remaining = limit - activeClients;
                  return remaining > 0 ? `${remaining} danışan daha eklenebilir` : 'Limit doldu';
                })()}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notlar</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{user.notes}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
};

// User Edit Modal Component
interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    package: user.package,
    status: user.status,
    subscriptionEnd: user.subscriptionEnd,
    address: user.address,
    city: user.city,
    notes: user.notes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      ...formData
    };
    onSave(updatedUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kullanıcı Düzenle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="admin">Admin</option>
                <option value="dietitian">Diyetisyen</option>
                <option value="client">Müşteri</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paket</label>
              <select
                value={formData.package}
                onChange={(e) => setFormData({...formData, package: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="basic">Temel</option>
                <option value="premium">Premium</option>
                <option value="corporate">Kurumsal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="suspended">Askıya Alınmış</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abonelik Bitişi</label>
              <Input
                type="date"
                value={formData.subscriptionEnd}
                onChange={(e) => setFormData({...formData, subscriptionEnd: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Create Modal Component
interface UserCreateModalProps {
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'client' as const,
    package: 'basic' as const,
    status: 'active' as const,
    registrationDate: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().split('T')[0],
    subscriptionStart: new Date().toISOString().split('T')[0],
    subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    remainingDays: 365,
    address: '',
    city: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Yeni Kullanıcı Oluştur</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="admin">Admin</option>
                <option value="dietitian">Diyetisyen</option>
                <option value="client">Müşteri</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paket *</label>
              <select
                value={formData.package}
                onChange={(e) => setFormData({...formData, package: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="basic">Temel</option>
                <option value="premium">Premium</option>
                <option value="corporate">Kurumsal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="suspended">Askıya Alınmış</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abonelik Başlangıcı *</label>
              <Input
                type="date"
                value={formData.subscriptionStart}
                onChange={(e) => setFormData({...formData, subscriptionStart: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abonelik Bitişi *</label>
              <Input
                type="date"
                value={formData.subscriptionEnd}
                onChange={(e) => setFormData({...formData, subscriptionEnd: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              Kullanıcı Oluştur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 