'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import CreateRecipeModal from '@/components/recipes/CreateRecipeModal';
import { 
  ChefHat, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Tag,
  Clock,
  TrendingUp,
  Users,
  Timer,
  Utensils,
  Heart,
  MessageSquare
} from 'lucide-react';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const savedRecipes = JSON.parse(localStorage.getItem(`recipes_${currentUserId}`) || '[]');
      
      // Eğer tarif yoksa demo tarifler ekle
      if (savedRecipes.length === 0) {
        const demoRecipes = [
          {
            id: 'recipe-1',
            title: 'Protein Smoothie Bowl',
            description: 'Kahvaltı için ideal, protein açısından zengin smoothie bowl tarifi.',
            category: 'Kahvaltı',
            difficulty: 'Kolay',
            prepTime: 10,
            cookTime: 0,
            servings: 1,
            calories: 320,
            ingredients: [
              '1 adet donmuş muz',
              '1/2 su bardağı yaban mersini',
              '1 ölçek protein tozu (vanilya)',
              '1/2 su bardağı badem sütü',
              '1 yemek kaşığı chia tohumu',
              '1 yemek kaşığı bal',
              'Üzerine: granola, taze meyve'
            ],
            instructions: [
              'Donmuş muz, yaban mersini, protein tozu ve badem sütünü blender\'a koyun.',
              '2-3 dakika pürüzsüz olana kadar karıştırın.',
              'Kaseye alın ve chia tohumu ile balı karıştırın.',
              'Üzerine granola ve taze meyveleri ekleyin.',
              'Hemen servis yapın.'
            ],
            tags: ['protein', 'kahvaltı', 'sağlıklı', 'smoothie'],
            status: 'published',
            approved: true,
            featured: true,
            views: 1250,
            likes: 89,
            comments: 23,
            createdAt: new Date().toISOString(),
            publishDate: new Date().toISOString()
          },
          {
            id: 'recipe-2',
            title: 'Quinoa Salata',
            description: 'Besleyici ve doyurucu quinoa salatası. Öğle yemeği için mükemmel.',
            category: 'Salata',
            difficulty: 'Orta',
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            calories: 280,
            ingredients: [
              '1 su bardağı quinoa',
              '2 su bardağı sebze suyu',
              '1 adet salatalık (doğranmış)',
              '2 adet domates (doğranmış)',
              '1/2 su bardağı nane',
              '1/4 su bardağı maydanoz',
              '2 yemek kaşığı zeytinyağı',
              '1 yemek kaşığı limon suyu',
              'Tuz, karabiber'
            ],
            instructions: [
              'Quinoa\'yı soğuk suda yıkayın.',
              'Sebze suyu ile quinoa\'yı kaynatın, 15 dakika pişirin.',
              'Pişen quinoa\'yı soğutun.',
              'Sebzeleri doğrayın ve quinoa ile karıştırın.',
              'Zeytinyağı, limon suyu, tuz ve karabiber ile sosunu hazırlayın.',
              'Sosu salata ile karıştırın ve servis yapın.'
            ],
            tags: ['quinoa', 'salata', 'vegan', 'öğle yemeği'],
            status: 'published',
            approved: true,
            featured: false,
            views: 890,
            likes: 67,
            comments: 15,
            createdAt: new Date().toISOString(),
            publishDate: new Date().toISOString()
          }
        ];
        
        setRecipes(demoRecipes);
        localStorage.setItem(`recipes_${currentUserId}`, JSON.stringify(demoRecipes));
      } else {
        setRecipes(savedRecipes);
      }
    } catch (error) {
      console.error('Tarifler yüklenirken hata:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || recipe.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Yayınlandı';
      case 'draft':
        return 'Taslak';
      case 'archived':
        return 'Arşivlendi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Kahvaltı':
        return 'bg-orange-100 text-orange-700';
      case 'Ana Yemek':
        return 'bg-red-100 text-red-700';
      case 'Ara Öğün':
        return 'bg-purple-100 text-purple-700';
      case 'Tatlı':
        return 'bg-pink-100 text-pink-700';
      case 'İçecek':
        return 'bg-blue-100 text-blue-700';
      case 'Salata':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSaveRecipe = (recipeData: any) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    let updatedRecipes;
    if (editingRecipe) {
      // Güncelleme
      updatedRecipes = recipes.map(recipe => 
        recipe.id === editingRecipe.id ? recipeData : recipe
      );
    } else {
      // Yeni tarif
      updatedRecipes = [...recipes, recipeData];
    }
    
    setRecipes(updatedRecipes);
    localStorage.setItem(`recipes_${currentUserId}`, JSON.stringify(updatedRecipes));
    setEditingRecipe(null);
  };

  const handleEditRecipe = (recipe: any) => {
    setEditingRecipe(recipe);
    setShowCreateModal(true);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (confirm('Bu tarifi silmek istediğinizden emin misiniz?')) {
      const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
      setRecipes(updatedRecipes);
      
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        localStorage.setItem(`recipes_${currentUserId}`, JSON.stringify(updatedRecipes));
      }
    }
  };

  const toggleFeatured = (recipeId) => {
    const updatedRecipes = recipes.map(recipe => 
      recipe.id === recipeId ? { ...recipe, featured: !recipe.featured } : recipe
    );
    setRecipes(updatedRecipes);
    
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      localStorage.setItem(`recipes_${currentUserId}`, JSON.stringify(updatedRecipes));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <ChefHat className="w-8 h-8 mr-3 text-orange-600" />
              Tarif Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">
              Sağlıklı tariflerinizi oluşturun, düzenleyin ve paylaşın.
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Tarif
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ChefHat className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Tarif</p>
                <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
                <p className="text-2xl font-bold text-gray-900">{recipes.reduce((sum, recipe) => sum + recipe.views, 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Beğeni</p>
                <p className="text-2xl font-bold text-gray-900">{recipes.reduce((sum, recipe) => sum + recipe.likes, 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Yorum</p>
                <p className="text-2xl font-bold text-gray-900">{recipes.reduce((sum, recipe) => sum + recipe.comments, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tarif ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayınlandı</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşivlendi</option>
            </select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>
        </div>

        {/* Recipes */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Tarifler yükleniyor...</p>
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'Tarif bulunamadı' : 'Henüz tarif yok'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Arama kriterlerinize uygun tarif bulunamadı' 
                  : 'İlk tarifinizi oluşturarak başlayın'}
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Tarifi Oluştur
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(recipe.status)}`}>
                        {getStatusText(recipe.status)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(recipe.category)}`}>
                        {recipe.category}
                      </span>
                      {recipe.featured && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                          Öne Çıkan
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{recipe.description}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(recipe.id)}
                      className={recipe.featured ? 'text-yellow-600' : 'text-gray-400'}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{recipe.prepTime + recipe.cookTime}</div>
                    <div className="text-xs text-gray-500">Dakika</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{recipe.servings}</div>
                    <div className="text-xs text-gray-500">Kişi</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{recipe.calories}</div>
                    <div className="text-xs text-gray-500">Kalori</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{recipe.tags.length - 3}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{recipe.views}</div>
                    <div className="text-xs text-gray-500">Görüntüleme</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{recipe.likes}</div>
                    <div className="text-xs text-gray-500">Beğeni</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{recipe.comments}</div>
                    <div className="text-xs text-gray-500">Yorum</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Görüntüle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditRecipe(recipe)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Recipe Modal */}
        <CreateRecipeModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingRecipe(null);
          }}
          onSave={handleSaveRecipe}
          editingRecipe={editingRecipe}
        />
      </div>
    </DashboardLayout>
  );
}