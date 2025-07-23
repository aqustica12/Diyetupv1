'use client';
import { useState, useEffect } from 'react';
import { ChefHat, Plus, Edit, Trash2, Eye, Calendar, User, Search, Filter, Clock, Star, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  rating: number;
  reviews: number;
}

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Simulate loading recipes
    setTimeout(() => {
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          title: 'Sağlıklı Kahvaltı Omleti',
          description: 'Protein açısından zengin, lezzetli bir kahvaltı omleti.',
          ingredients: ['3 yumurta', '50g peynir', '1 domates', '1 yeşil biber', 'Tuz, karabiber'],
          instructions: ['Yumurtaları çırpın', 'Sebzeleri doğrayın', 'Tavada pişirin'],
          author: 'Diyetisyen Demo User',
          status: 'approved',
          category: 'Kahvaltı',
          difficulty: 'easy',
          prepTime: 10,
          cookTime: 15,
          servings: 2,
          calories: 280,
          createdAt: '2024-12-10',
          updatedAt: '2024-12-15',
          featured: true,
          rating: 4.5,
          reviews: 12
        },
        {
          id: '2',
          title: 'Mercimek Çorbası',
          description: 'Besleyici ve doyurucu mercimek çorbası tarifi.',
          ingredients: ['1 su bardağı kırmızı mercimek', '1 soğan', '1 havuç', 'Zeytinyağı', 'Baharatlar'],
          instructions: ['Mercimeği yıkayın', 'Sebzeleri doğrayın', 'Pişirin ve blenderdan geçirin'],
          author: 'Dr. Admin User',
          status: 'pending',
          category: 'Çorba',
          difficulty: 'medium',
          prepTime: 15,
          cookTime: 45,
          servings: 4,
          calories: 180,
          createdAt: '2024-12-12',
          updatedAt: '2024-12-12',
          featured: false,
          rating: 0,
          reviews: 0
        }
      ];
      setRecipes(mockRecipes);
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

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      easy: 'Kolay',
      medium: 'Orta',
      hard: 'Zor'
    };
    return texts[difficulty as keyof typeof texts] || 'Kolay';
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || recipe.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Tarifler yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tarif Yönetimi</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Tarif Ekle
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
                  placeholder="Tarif ara..."
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
                <option value="Kahvaltı">Kahvaltı</option>
                <option value="Çorba">Çorba</option>
                <option value="Ana Yemek">Ana Yemek</option>
                <option value="Salata">Salata</option>
                <option value="Tatlı">Tatlı</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Filtrele
              </Button>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(recipe.status)}`}>
                    {getStatusText(recipe.status)}
                  </span>
                  <div className="flex space-x-2">
                    {recipe.featured && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Öne Çıkan
                      </span>
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(recipe.difficulty)}`}>
                      {getDifficultyText(recipe.difficulty)}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {recipe.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {recipe.description}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {recipe.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {recipe.prepTime + recipe.cookTime} dk
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    {recipe.rating} ({recipe.reviews})
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">{recipe.calories}</span> kcal
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">{recipe.servings}</span> porsiyon
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {recipe.category}
                  </span>
                  <div className="flex space-x-2">
                    {recipe.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-8">
            <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tarif bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipesPage; 