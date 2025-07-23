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
  Reply
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BlogPostPage() {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadBlogPost();
    loadComments();
    checkCurrentUser();
  }, [postId]);

  const checkCurrentUser = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  };

  const loadBlogPost = () => {
    try {
      // Admin onayından geçmiş blog yazılarını kontrol et
      const adminPosts = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]');
      const dietitianPosts = JSON.parse(localStorage.getItem('dietitianBlogPosts') || '[]');
      
      // Tüm yazıları birleştir
      const allPosts = [...adminPosts, ...dietitianPosts];
      
      // Yazıyı bul - URL ID'si ile eşleştir
      const foundPost = allPosts.find(p => p.id === postId);
      
      if (foundPost) {
        // Yazar bilgisini ekle
        const postWithAuthor = {
          ...foundPost,
          authorInfo: {
            name: foundPost.author,
            title: 'Diyetisyen',
            email: 'diyetisyen@diyetup.com'
          }
        };
        
        setPost(postWithAuthor);
        // Görüntüleme sayısını artır
        incrementViews(foundPost);
      } else {
        console.log('Post not found with ID:', postId);
        console.log('Available posts:', allPosts.map(p => ({ id: p.id, title: p.title })));
      }
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = (post: any) => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.entries(registeredUsers).forEach(([email, userData]: [string, any]) => {
        const userId = userData.user.id;
        const userPosts = JSON.parse(localStorage.getItem(`blog_posts_${userId}`) || '[]');
        
        const updatedPosts = userPosts.map(p => 
          p.id === postId ? { ...p, views: p.views + 1 } : p
        );
        
        if (userPosts.some(p => p.id === postId)) {
          localStorage.setItem(`blog_posts_${userId}`, JSON.stringify(updatedPosts));
        }
      });
    } catch (error) {
      console.error('Görüntüleme sayısı artırılırken hata:', error);
    }
  };

  const loadComments = () => {
    try {
      const savedComments = JSON.parse(localStorage.getItem(`blog_comments_${postId}`) || '[]');
      setComments(savedComments);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      setComments([]);
    }
  };

  const handleLike = () => {
    if (!post) return;
    
    setIsLiked(!isLiked);
    
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.entries(registeredUsers).forEach(([email, userData]: [string, any]) => {
        const userId = userData.user.id;
        const userPosts = JSON.parse(localStorage.getItem(`blog_posts_${userId}`) || '[]');
        
        const updatedPosts = userPosts.map(p => 
          p.id === postId ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
        );
        
        if (userPosts.some(p => p.id === postId)) {
          localStorage.setItem(`blog_posts_${userId}`, JSON.stringify(updatedPosts));
          setPost(prev => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }));
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
    localStorage.setItem(`blog_comments_${postId}`, JSON.stringify(updatedComments));
    
    // Yorum sayısını artır
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      Object.entries(registeredUsers).forEach(([email, userData]: [string, any]) => {
        const userId = userData.user.id;
        const userPosts = JSON.parse(localStorage.getItem(`blog_posts_${userId}`) || '[]');
        
        const updatedPosts = userPosts.map(p => 
          p.id === postId ? { ...p, comments: p.comments + 1 } : p
        );
        
        if (userPosts.some(p => p.id === postId)) {
          localStorage.setItem(`blog_posts_${userId}`, JSON.stringify(updatedPosts));
          setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
        }
      });
    } catch (error) {
      console.error('Yorum sayısı güncellenirken hata:', error);
    }
    
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!replyText.trim() || !currentUser) return;
    
    const reply = {
      id: Date.now().toString(),
      author: `${currentUser.title} ${currentUser.firstName} ${currentUser.lastName}`,
      authorId: currentUser.id,
      content: replyText.trim(),
      timestamp: new Date().toISOString()
    };
    
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    );
    
    setComments(updatedComments);
    localStorage.setItem(`blog_comments_${postId}`, JSON.stringify(updatedComments));
    
    setReplyTo(null);
    setReplyText('');
  };

  const getCategoryColor = (category) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64 pt-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Blog yazısı yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-24">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog yazısı bulunamadı</h1>
          <Link href="/blog">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Blog'a Dön
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
      
      {/* Article Header */}
      <section className="pt-24 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/blog" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Blog'a Dön
            </Link>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              {post.featured && (
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full">
                  Öne Çıkan
                </span>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            {/* Cover Image */}
            {post.coverImage && post.coverImage !== 'null' && (
              <div className="mb-8">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {post.authorInfo.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {post.authorInfo.title} {post.authorInfo.name}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(post.publishDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime} dk okuma</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </motion.div>
          
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
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
                  Beğen ({post.likes})
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
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Yorumunuzu yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={handleComment}
                        disabled={!newComment.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
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
                        {currentUser && post.authorInfo.id === currentUser.id && (
                          <Button
                            onClick={() => setReplyTo(comment.id)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Yanıtla
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      
                      {/* Reply Form */}
                      {replyTo === comment.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Yanıtınızı yazın..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2 mt-3">
                            <Button
                              onClick={() => setReplyTo(null)}
                              variant="outline"
                              size="sm"
                            >
                              İptal
                            </Button>
                            <Button
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyText.trim()}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              Yanıtla
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {comment.replies.map((reply, replyIndex) => (
                            <div key={reply.id} className="flex items-start space-x-3 pl-4 border-l-2 border-green-200">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-xs">
                                  {reply.author.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="font-medium text-gray-900 text-sm">{reply.author}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(reply.timestamp).toLocaleDateString('tr-TR')}
                                  </div>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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