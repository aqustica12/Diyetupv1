'use client';
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  Clock, 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  TrendingUp,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  publishDate?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
  comments?: number;
  readTime?: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem(`blog_posts_${localStorage.getItem('currentUserId')}`);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Eğer post yoksa demo postlar ekle
      const demoPosts: BlogPost[] = [
        {
          id: 'post-1',
          title: 'Sağlıklı Beslenme İpuçları',
          excerpt: 'Günlük hayatta sağlıklı beslenme için önemli ipuçları ve öneriler.',
          content: 'Sağlıklı beslenme hakkında detaylı bilgiler...',
          author: 'Diyetisyen Demo User',
          status: 'published',
          category: 'Beslenme',
          tags: ['sağlık', 'beslenme', 'diyet'],
          views: 1250,
          likes: 89,
          comments: 23,
          featured: true,
          readTime: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'post-2',
          title: 'Kilo Verme Yöntemleri',
          excerpt: 'Bilimsel temelli kilo verme yöntemleri ve uzman önerileri.',
          content: 'Etkili kilo verme yöntemleri ve stratejileri...',
          author: 'Diyetisyen Demo User',
          status: 'pending',
          category: 'Kilo Kontrolü',
          tags: ['kilo', 'zayıflama', 'fitness'],
          views: 890,
          likes: 67,
          comments: 45,
          featured: false,
          readTime: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'post-3',
          title: 'Protein Ağırlıklı Beslenme',
          excerpt: 'Protein açısından zengin beslenme planları ve öneriler.',
          content: 'Protein ağırlıklı beslenme hakkında detaylı bilgiler...',
          author: 'Diyetisyen Demo User',
          status: 'draft',
          category: 'Beslenme',
          tags: ['protein', 'beslenme', 'fitness'],
          views: 0,
          likes: 0,
          comments: 0,
          featured: false,
          readTime: 6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setPosts(demoPosts);
      localStorage.setItem(`blog_posts_${localStorage.getItem('currentUserId')}`, JSON.stringify(demoPosts));
    }
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      published: 'bg-blue-100 text-blue-700'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: 'Taslak',
      pending: 'Admin Onayında',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      published: 'Yayında'
    };
    return texts[status as keyof typeof texts] || 'Taslak';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Beslenme':
        return 'bg-green-100 text-green-700';
      case 'Kilo Kontrolü':
        return 'bg-blue-100 text-blue-700';
      case 'Sağlık':
        return 'bg-purple-100 text-purple-700';
      case 'Fitness':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSavePost = (postData: BlogPost) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    // Generate URL-friendly ID from title
    const urlId = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Math.floor(Math.random() * 1000);

    const postWithUrl = {
      ...postData,
      id: urlId
    };

    const updatedPosts = editingPost
      ? posts.map(post => post.id === editingPost.id ? postWithUrl : post)
      : [...posts, postWithUrl];
    
    setPosts(updatedPosts);
    localStorage.setItem(`blog_posts_${currentUserId}`, JSON.stringify(updatedPosts));
    
    // Send to admin for approval if new post
    if (!editingPost) {
      const adminPosts = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]');
      adminPosts.push(postWithUrl);
      localStorage.setItem('adminBlogPosts', JSON.stringify(adminPosts));
      toast.success('Blog yazısı oluşturuldu ve admin onayına gönderildi!');
    } else {
      // Update in admin posts if editing
      const adminPosts = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]');
      const updatedAdminPosts = adminPosts.map(post => 
        post.id === postWithUrl.id ? postWithUrl : post
      );
      localStorage.setItem('adminBlogPosts', JSON.stringify(updatedAdminPosts));
      toast.success('Blog yazısı güncellendi!');
    }
    
    setShowCreateModal(false);
    setEditingPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowCreateModal(true);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem(`blog_posts_${localStorage.getItem('currentUserId')}`, JSON.stringify(updatedPosts));
      toast.info('Blog yazısı silindi.');
    }
  };

  const toggleFeatured = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, featured: !post.featured } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem(`blog_posts_${localStorage.getItem('currentUserId')}`, JSON.stringify(updatedPosts));
    toast.success('Öne çıkan durumu güncellendi.');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-green-600" />
                Blog Yönetimi
              </h1>
              <p className="text-gray-600 mt-2">
                Blog yazılarınızı oluşturun, düzenleyin ve yayınlayın.
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Yazı
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Yazı</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.reduce((sum, post) => sum + (post.views || 0), 0)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Beğeni</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.reduce((sum, post) => sum + (post.likes || 0), 0)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Yorum</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.reduce((sum, post) => sum + (post.comments || 0), 0)}</p>
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
                  placeholder="Blog yazısı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="draft">Taslak</option>
                <option value="pending">Admin Onayında</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
                <option value="published">Yayında</option>
              </select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Blog yazıları yükleniyor...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'Blog yazısı bulunamadı' : 'Henüz blog yazısı yok'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Arama kriterlerinize uygun yazı bulunamadı' 
                    : 'İlk blog yazınızı oluşturarak başlayın'}
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Yazıyı Oluştur
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                          {getStatusText(post.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                            Öne Çıkan
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeatured(post.id)}
                        className={post.featured ? 'text-yellow-600' : 'text-gray-400'}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{post.views || 0}</div>
                      <div className="text-xs text-gray-500">Görüntüleme</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{post.likes || 0}</div>
                      <div className="text-xs text-gray-500">Beğeni</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{post.comments || 0}</div>
                      <div className="text-xs text-gray-500">Yorum</div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime || 5} dk okuma</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {post.publishDate 
                          ? new Date(post.publishDate).toLocaleDateString('tr-TR')
                          : 'Yayınlanmadı'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Görüntüle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Create/Edit Post Modal */}
          <CreatePostModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setEditingPost(null);
            }}
            onSave={handleSavePost}
            editingPost={editingPost}
          />
        </div>
      </DashboardLayout>
    </>
  );
}

// Create Post Modal Component
interface CreatePostModalProps {
  onClose: () => void;
  onSave: (post: BlogPost) => void;
  editingPost?: BlogPost | null;
  isOpen: boolean;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSave, editingPost, isOpen }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    readTime: 5
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        excerpt: editingPost.excerpt,
        category: editingPost.category,
        tags: editingPost.tags.join(', '),
        readTime: editingPost.readTime || 5
      });
    } else {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        readTime: 5
      });
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Başlık ve içerik alanları zorunludur.');
      return;
    }

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const postData: BlogPost = {
      id: editingPost?.id || new Date().toISOString(),
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      author: 'Diyetisyen Demo User',
      status: editingPost?.status || 'pending',
      category: formData.category,
      tags,
      readTime: formData.readTime,
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: editingPost?.views || 0,
      likes: editingPost?.likes || 0,
      comments: editingPost?.comments || 0,
      featured: editingPost?.featured || false
    };
    
    onSave(postData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Blog yazısı başlığı"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
            <Input
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              placeholder="Kısa özet"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Kategori Seçin</option>
              <option value="Beslenme">Beslenme</option>
              <option value="Kilo Kontrolü">Kilo Kontrolü</option>
              <option value="Sağlık">Sağlık</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler (virgülle ayırın)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="sağlık, beslenme, diyet"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Okuma Süresi (dk)</label>
            <Input
              type="number"
              value={formData.readTime}
              onChange={(e) => setFormData({...formData, readTime: parseInt(e.target.value) || 5})}
              min="1"
              max="60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Blog yazısı içeriği..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={8}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              {editingPost ? 'Güncelle' : 'Oluştur ve Gönder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 