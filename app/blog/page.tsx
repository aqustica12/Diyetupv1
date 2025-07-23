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
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  coverImage?: string;
  authorInfo?: {
    name: string;
    title: string;
    email: string;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllBlogPosts();
  }, []);

  const loadAllBlogPosts = () => {
    try {
      // Admin onayından geçmiş blog yazılarını yükle
      const adminPosts = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]');
      const dietitianPosts = JSON.parse(localStorage.getItem('dietitianBlogPosts') || '[]');
      
      // Tüm yazıları birleştir
      const allPosts = [...adminPosts, ...dietitianPosts];
      
      // Sadece yayınlanmış yazıları al
      const publishedPosts = allPosts.filter(post => 
        post.status === 'published'
      );
      
      // Yazar bilgisini ekle
      publishedPosts.forEach(post => {
        post.authorInfo = {
          name: post.author,
          title: 'Diyetisyen',
          email: 'diyetisyen@diyetup.com'
        };
      });
      
      // Tarihe göre sırala (en yeni önce)
      publishedPosts.sort((a, b) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime());
      
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Blog yazıları yüklenirken hata:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(posts.map(post => post.category)));
  const featuredPosts = posts.filter(post => post.featured).slice(0, 3);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Beslenme':
        return 'bg-blue-100 text-blue-700';
      case 'Kilo Yönetimi':
        return 'bg-purple-100 text-purple-700';
      case 'Spor Beslenmesi':
        return 'bg-orange-100 text-orange-700';
      case 'Sağlık':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              DiyetUp <span className="text-green-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uzman diyetisyenlerden beslenme, sağlık ve yaşam tarzı hakkında 
              güncel bilgiler ve pratik öneriler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Blog yazıları yükleniyor...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'Blog yazısı bulunamadı' : 'Henüz blog yazısı yok'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Arama kriterlerinize uygun yazı bulunamadı' 
                  : 'Yakında uzman diyetisyenlerimizden yazılar gelecek'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="mb-4 -mx-6 -mt-6">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={`${post.id}-tag-${index}`} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{post.readTime} dk</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {post.authorInfo?.name?.split(' ').map(n => n[0]).join('') || 'D'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {post.authorInfo?.title || 'Diyetisyen'} {post.authorInfo?.name || post.author}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.publishDate || post.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                          <span className="flex items-center">
                            Oku
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