'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User, Search, Filter, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived' | 'approved' | 'rejected' | 'pending';
  category: string;
  tags: string[];
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
  rejectionReason?: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Simulate loading blog posts
    setTimeout(() => {
      // Load posts from dietitians that need approval
      const dietitianPosts = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]');
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Sağlıklı Beslenme İpuçları',
          content: 'Sağlıklı beslenme hakkında detaylı bilgiler...',
          excerpt: 'Günlük hayatta sağlıklı beslenme için önemli ipuçları ve öneriler.',
          author: 'Dr. Admin User',
          status: 'published',
          category: 'Beslenme',
          tags: ['sağlık', 'beslenme', 'diyet'],
          publishDate: '2024-12-15',
          createdAt: '2024-12-10',
          updatedAt: '2024-12-15',
          views: 1250,
          featured: true
        },
        ...dietitianPosts
      ];
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      published: 'Yayında',
      draft: 'Taslak',
      archived: 'Arşivlenmiş',
      approved: 'Onaylandı',
      rejected: 'Reddedildi'
    };
    return texts[status as keyof typeof texts] || 'Taslak';
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleApprove = (id: string) => {
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, status: 'approved' as const } : post
    );
    setPosts(updatedPosts);
    
    // Update in localStorage
    localStorage.setItem('adminBlogPosts', JSON.stringify(updatedPosts));
    
    // Also update the dietitian's posts
    const dietitianPosts = JSON.parse(localStorage.getItem('dietitianBlogPosts') || '[]');
    const updatedDietitianPosts = dietitianPosts.map((post: any) => 
      post.id === id ? { ...post, status: 'approved' } : post
    );
    localStorage.setItem('dietitianBlogPosts', JSON.stringify(updatedDietitianPosts));
    
    toast.success('Blog yazısı onaylandı!');
  };

  const handleReject = (id: string) => {
    const reason = prompt('Red sebebini girin:');
    if (reason) {
      const updatedPosts = posts.map(post => 
        post.id === id ? { ...post, status: 'rejected' as const, rejectionReason: reason } : post
      );
      setPosts(updatedPosts);
      
      // Update in localStorage
      localStorage.setItem('adminBlogPosts', JSON.stringify(updatedPosts));
      
      // Also update the dietitian's posts
      const dietitianPosts = JSON.parse(localStorage.getItem('dietitianBlogPosts') || '[]');
      const updatedDietitianPosts = dietitianPosts.map((post: any) => 
        post.id === id ? { ...post, status: 'rejected', rejectionReason: reason } : post
      );
      localStorage.setItem('dietitianBlogPosts', JSON.stringify(updatedDietitianPosts));
      
      toast.error('Blog yazısı reddedildi.');
    }
  };

  const handlePublish = (id: string) => {
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, status: 'published' as const, publishDate: new Date().toISOString() } : post
    );
    setPosts(updatedPosts);
    
    // Update in localStorage
    localStorage.setItem('adminBlogPosts', JSON.stringify(updatedPosts));
    
    // Also update the dietitian's posts
    const dietitianPosts = JSON.parse(localStorage.getItem('dietitianBlogPosts') || '[]');
    const updatedDietitianPosts = dietitianPosts.map((post: any) => 
      post.id === id ? { ...post, status: 'published', publishDate: new Date().toISOString() } : post
    );
    localStorage.setItem('dietitianBlogPosts', JSON.stringify(updatedDietitianPosts));
    
    // Also update the user's personal posts
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      const userPosts = JSON.parse(localStorage.getItem(`blog_posts_${currentUserId}`) || '[]');
      const updatedUserPosts = userPosts.map((post: any) => 
        post.id === id ? { ...post, status: 'published', publishDate: new Date().toISOString() } : post
      );
      localStorage.setItem(`blog_posts_${currentUserId}`, JSON.stringify(updatedUserPosts));
    }
    
    toast.success('Blog yazısı yayınlandı!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Blog yazıları yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Yazı Ekle
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
                  placeholder="Blog yazısı ara..."
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
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
                <option value="archived">Arşivlenmiş</option>
                <option value="approved">Onaylandı</option>
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
                <option value="Beslenme">Beslenme</option>
                <option value="Kilo Kontrolü">Kilo Kontrolü</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Fitness">Fitness</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Filtrele
              </Button>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                  {post.featured && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Öne Çıkan
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views} görüntüleme
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    {post.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(post.id)}>
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleReject(post.id)}>
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {post.status === 'approved' && (
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" onClick={() => handlePublish(post.id)}>
                        <FileText className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Blog yazısı bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage; 