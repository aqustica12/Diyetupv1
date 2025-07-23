'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Search, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare, 
  User,
  Tag,
  Filter,
  ChevronRight,
  Star,
  ChefHat,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllRecipes();
  }, []);

  const loadAllRecipes = () => {
    try {
      // Tüm kullanıcıların tariflerini topla
      const allRecipes = [];
      
      // localStorage'daki tüm kullanıcıları kontrol et
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.values(registeredUsers).forEach((userData: any) => {
        const userId = userData.user.id;
        const userRecipes = JSON.parse(localStorage.getItem(`recipes_${userId}`) || '[]');
        
        // Sadece yayınlanmış ve onaylanmış tarifleri al
        const publishedRecipes = userRecipes.filter(recipe => 
          recipe.status === 'published' && recipe.approved === true
        );
        
        // Yazar bilgisini ekle
        publishedRecipes.forEach(recipe => {
          recipe.authorInfo = {
            id: userId,
            name: `${userData.user.firstName} ${userData.user.lastName}`,
            title: userData.user.title,
            email: userData.user.email
          };
        });
        
        allRecipes.push(...publishedRecipes);
      });
      
      // Tarihe göre sırala (en yeni önce)
      allRecipes.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      
      setRecipes(allRecipes);
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
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = [...new Set(recipes.map(recipe => recipe.category))];
  const featuredRecipes = recipes.filter(recipe => recipe.featured).slice(0, 3);

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Kolay':
        return 'bg-green-100 text-green-700';
      case 'Orta':
        return 'bg-yellow-100 text-yellow-700';
      case 'Zor':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              DiyetUp <span className="text-orange-600">Tarifler</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uzman diyetisyenlerden sağlıklı, lezzetli ve besleyici tarifler. 
              Sağlıklı yaşam için pratik çözümler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Recipes */}
      {featuredRecipes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Tarifler</h2>
              <p className="text-gray-600">En popüler ve beğenilen tariflerimiz</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    {/* Cover Image */}
                    {recipe.coverImage && recipe.coverImage !== 'null' && (
                      <div className="mb-4 -mx-6 -mt-6">
                        <img
                          src={recipe.coverImage}
                          alt={recipe.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(recipe.category)}`}>
                        {recipe.category}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                      <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full">
                        Öne Çıkan
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {recipe.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{recipe.prepTime + recipe.cookTime} dk</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{recipe.servings} kişi</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{recipe.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {recipe.authorInfo.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {recipe.authorInfo.title} {recipe.authorInfo.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(recipe.publishDate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/recipes/${recipe.id}`}>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                          Tarifi Gör
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tüm Zorluklar</option>
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Tarifler yükleniyor...</p>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' ? 'Tarif bulunamadı' : 'Henüz tarif yok'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' 
                  ? 'Arama kriterlerinize uygun tarif bulunamadı' 
                  : 'Yakında uzman diyetisyenlerimizden tarifler gelecek'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    {/* Cover Image */}
                    {recipe.coverImage && (
                      <div className="mb-4 -mx-6 -mt-6">
                        <img
                          src={recipe.coverImage}
                          alt={recipe.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(recipe.category)}`}>
                        {recipe.category}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {recipe.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{recipe.prepTime + recipe.cookTime} dk</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{recipe.servings} kişi</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{recipe.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {recipe.authorInfo.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {recipe.authorInfo.title} {recipe.authorInfo.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(recipe.publishDate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/recipes/${recipe.id}`}>
                        <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <span className="flex items-center">
                            Tarifi Gör
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}