'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2,
  User,
  ArrowLeft,
  Send,
  ThumbsUp,
  Reply,
  ChefHat,
  Users,
  Timer,
  Utensils
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  const [recipe, setRecipe] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadRecipe();
    loadComments();
    checkCurrentUser();
  }, [recipeId]);

  const checkCurrentUser = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  };

  const loadRecipe = () => {
    try {
      // Tüm kullanıcıların tariflerini kontrol et
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      let foundRecipe = null;
      
      Object.values(registeredUsers).forEach((userData: any) => {
        const userId = userData.user.id;
        const userRecipes = JSON.parse(localStorage.getItem(`recipes_${userId}`) || '[]');
        
        const recipe = userRecipes.find(r => r.id === recipeId);
        if (recipe) {
          foundRecipe = {
            ...recipe,
            authorInfo: {
              id: userId,
              name: `${userData.user.firstName} ${userData.user.lastName}`,
              title: userData.user.title,
              email: userData.user.email
            }
          };
        }
      });
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
        // Görüntüleme sayısını artır
        incrementViews(foundRecipe);
      }
    } catch (error) {
      console.error('Tarif yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = (recipe: any) => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.entries(registeredUsers).forEach(([email, userData]: [string, any]) => {
        const userId = userData.user.id;
        const userRecipes = JSON.parse(localStorage.getItem(`recipes_${userId}`) || '[]');
        
        const updatedRecipes = userRecipes.map(r => 
          r.id === recipeId ? { ...r, views: r.views + 1 } : r
        );
        
        if (userRecipes.some(r => r.id === recipeId)) {
          localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
        }
      });
    } catch (error) {
      console.error('Görüntüleme sayısı artırılırken hata:', error);
    }
  };

  const loadComments = () => {
    try {
      const savedComments = JSON.parse(localStorage.getItem(`recipe_comments_${recipeId}`) || '[]');
      setComments(savedComments);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      setComments([]);
    }
  };

  const handleLike = () => {
    if (!recipe) return;
    
    setIsLiked(!isLiked);
    
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.entries(registeredUsers).forEach(([email, userData]: [string, any]) => {
        const userId = userData.user.id;
        const userRecipes = JSON.parse(localStorage.getItem(`recipes_${userId}`) || '[]');
        
        const updatedRecipes = userRecipes.map(r => 
          r.id === recipeId ? { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 } : r
        );
        
        if (userRecipes.some(r => r.id === recipeId)) {
          localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
          setRecipe(prev => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }));
        }
      });
    } catch (error) {
      console.error('Beğeni güncellenirken hata:', error);
    }
  };

  const handleComment = () => {
    if (!newComment.trim() || !currentUser) return;
    
    const comment = {
      id: Date.now().toString(),
      author: `${currentUser.title} ${currentUser.firstName} ${currentUser.lastName}`,
      authorId: currentUser.id,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`recipe_comments_${recipeId}`, JSON.stringify(updatedComments));
    
    // Yorum sayısını artır
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.entries(registeredUsers).forEach(([email, userData]: [string, any]) => {
        const userId = userData.user.id;
        const userRecipes = JSON.parse(localStorage.getItem(`recipes_${userId}`) || '[]');
        
        const updatedRecipes = userRecipes.map(r => 
          r.id === recipeId ? { ...r, comments: r.comments + 1 } : r
        );
        
        if (userRecipes.some(r => r.id === recipeId)) {
          localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
          setRecipe(prev => ({ ...prev, comments: prev.comments + 1 }));
        }
      });
    } catch (error) {
      console.error('Yorum sayısı güncellenirken hata:', error);
    }
    
    setNewComment('');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64 pt-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Tarif yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-24">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tarif bulunamadı</h1>
          <Link href="/recipes">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tariflere Dön
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Recipe Header */}
      <section className="pt-24 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/recipes" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tariflere Dön
            </Link>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(recipe.category)}`}>
                {recipe.category}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
              {recipe.featured && (
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full">
                  Öne Çıkan
                </span>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {recipe.title}
            </h1>
            
            {/* Cover Image */}
            {recipe.coverImage && recipe.coverImage !== 'null' && (
              <div className="mb-8">
                <img
                  src={recipe.coverImage}
                  alt={recipe.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {recipe.authorInfo.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {recipe.authorInfo.title} {recipe.authorInfo.name}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(recipe.publishDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{recipe.views}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>{recipe.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{recipe.comments}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recipe Info */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Timer className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{recipe.prepTime}</div>
              <div className="text-sm text-gray-600">Hazırlık</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{recipe.cookTime}</div>
              <div className="text-sm text-gray-600">Pişirme</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{recipe.servings}</div>
              <div className="text-sm text-gray-600">Kişi</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Utensils className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{recipe.calories}</div>
              <div className="text-sm text-gray-600">Kalori</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Malzemeler</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Yapılışı</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h3>
              <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
            </div>
          )}
          
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
          
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? "default" : "outline"}
                  className={isLiked ? "bg-red-600 hover:bg-red-700 text-white" : "border-red-600 text-red-600 hover:bg-red-50"}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  Beğen ({recipe.likes})
                </Button>
                
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Paylaş
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Yorumlar ({comments.length})
            </h3>
            
            {/* Add Comment */}
            {currentUser ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Yorumunuzu yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={handleComment}
                        disabled={!newComment.trim()}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Yorum Yap
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <p className="text-blue-700 mb-4">Yorum yapmak için giriş yapmanız gerekiyor.</p>
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{comment.author}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}