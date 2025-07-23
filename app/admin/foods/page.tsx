'use client';
import { useState, useEffect } from 'react';
import { ChefHat, Plus, Edit, Trash2, Eye, Search, Filter, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  status: 'pending' | 'approved' | 'rejected';
  category?: string;
  serving_size?: number;
  serving_unit?: string;
  submittedBy: string;
  submittedAt: string;
  rejectionReason?: string;
}

const FoodsPage = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Simulate loading foods
    setTimeout(() => {
      const storedFoods = localStorage.getItem('foodRequests');
      if (storedFoods) {
        setFoods(JSON.parse(storedFoods));
      } else {
        const mockFoods: Food[] = [
          {
            id: '1',
            name: 'Tavuk Göğsü',
            calories: 165,
            protein: 31,
            carbohydrates: 0,
            fat: 3.6,
            status: 'approved',
            category: 'Et ve Balık',
            serving_size: 100,
            serving_unit: 'gram',
            submittedBy: 'Diyetisyen Demo User',
            submittedAt: '2024-12-15'
          },
          {
            id: '2',
            name: 'Yeni Besin',
            calories: 120,
            protein: 5,
            carbohydrates: 20,
            fat: 2,
            status: 'pending',
            category: 'Meyve',
            serving_size: 50,
            serving_unit: 'gram',
            submittedBy: 'Dr. Admin User',
            submittedAt: '2024-12-19'
          }
        ];
        setFoods(mockFoods);
        localStorage.setItem('foodRequests', JSON.stringify(mockFoods));
      }
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      approved: 'Onaylandı',
      pending: 'Bekliyor',
      rejected: 'Reddedildi'
    };
    return texts[status as keyof typeof texts] || 'Bekliyor';
  };

  const handleApprove = (id: string) => {
    const updatedFoods = foods.map(f => f.id === id ? { ...f, status: 'approved' as const } : f);
    setFoods(updatedFoods);
    localStorage.setItem('foodRequests', JSON.stringify(updatedFoods));
    toast.success('Besin onaylandı!');
  };

  const handleReject = (id: string) => {
    const updatedFoods = foods.map(f => f.id === id ? { ...f, status: 'rejected' as const } : f);
    setFoods(updatedFoods);
    localStorage.setItem('foodRequests', JSON.stringify(updatedFoods));
    toast.error('Besin reddedildi.');
  };

  const handleDelete = (id: string) => {
    const remainingFoods = foods.filter(f => f.id !== id);
    setFoods(remainingFoods);
    localStorage.setItem('foodRequests', JSON.stringify(remainingFoods));
    toast.info('Besin silindi.');
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || food.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || food.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Besinler yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Besin Yönetimi</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Besin Ekle
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Besin ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="approved">Onaylandı</option>
                <option value="pending">Bekliyor</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="Meyve">Meyve</option>
                <option value="Sebze">Sebze</option>
                <option value="Tahıl">Tahıl</option>
                <option value="Süt Ürünleri">Süt Ürünleri</option>
                <option value="Et ve Balık">Et ve Balık</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Filtrele
              </Button>
            </div>
          </div>
        </div>

        {/* Foods Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Besin Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kalori
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protein (g)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Karbonhidrat (g)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yağ (g)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eylemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <ChefHat className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.serving_size} {food.serving_unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {food.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {food.calories}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {food.protein}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {food.carbohydrates}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {food.fat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(food.status)}`}>
                        {getStatusText(food.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {food.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(food.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleReject(food.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(food.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-8">
            <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Besin bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FoodsPage; 