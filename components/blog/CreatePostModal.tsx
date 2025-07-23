'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Eye, Upload, Tag, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: any) => void;
  editingPost?: any;
}

export default function CreatePostModal({ isOpen, onClose, onSave, editingPost }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    excerpt: editingPost?.excerpt || '',
    content: editingPost?.content || '',
    category: editingPost?.category || 'Beslenme',
    tags: editingPost?.tags?.join(', ') || '',
    status: editingPost?.status || 'draft',
    featured: editingPost?.featured || false,
    readTime: editingPost?.readTime || 5,
    coverImage: editingPost?.coverImage || null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState(editingPost?.coverImage || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const postData = {
        id: editingPost?.id || `post-${Date.now()}`,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: formData.status,
        featured: formData.featured,
        readTime: formData.readTime,
        coverImage: formData.coverImage,
        publishDate: formData.status === 'published' ? new Date().toISOString() : editingPost?.publishDate || null,
        views: editingPost?.views || 0,
        likes: editingPost?.likes || 0,
        comments: editingPost?.comments || 0,
        createdAt: editingPost?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSave(postData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Beslenme',
        tags: '',
        status: 'draft',
        featured: false,
        readTime: 5,
        coverImage: null
      });
      setCoverImagePreview(null);
    } catch (error) {
      console.error('Blog yazısı kaydedilirken hata:', error);
      alert('Blog yazısı kaydedilirken bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      
      // Convert to base64 for permanent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setCoverImagePreview(base64String);
        setFormData(prev => ({ ...prev, coverImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Okuma süresini otomatik hesapla
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // İçerik değiştiğinde okuma süresini güncelle
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    const readTime = calculateReadTime(content);
    
    setFormData(prev => ({
      ...prev,
      content,
      readTime
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
            </h2>
            <p className="text-gray-600">Blog yazınızı oluşturun ve yayınlayın</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'draft' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title || !formData.content}
              variant="outline"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Taslak Kaydet
                </div>
              )}
            </Button>
            
            <Button
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'published' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title || !formData.content}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Yayınlanıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {editingPost ? 'Güncelle ve Yayınla' : 'Yayınla'}
                </div>
              )}
            </Button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Form */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Blog yazısının başlığı..."
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapak Görseli
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    id="cover-image-upload"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('cover-image-upload')?.click()}
                    variant="outline"
                    className="w-full border-dashed border-2 border-gray-300 hover:border-green-400 py-8"
                  >
                    <Upload className="w-6 h-6 mr-2" />
                    Kapak Görseli Yükle
                  </Button>
                  {coverImagePreview && (
                    <div className="relative">
                      <img
                        src={coverImagePreview}
                        alt="Kapak görseli önizleme"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImagePreview(null);
                          setFormData(prev => ({ ...prev, coverImage: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Maksimum dosya boyutu: 5MB</p>
                </div>
              </div>
              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özet *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={3}
                  placeholder="Yazının kısa özeti..."
                  required
                />
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Beslenme">Beslenme</option>
                    <option value="Kilo Yönetimi">Kilo Yönetimi</option>
                    <option value="Spor Beslenmesi">Spor Beslenmesi</option>
                    <option value="Sağlık">Sağlık</option>
                    <option value="Yaşam Tarzı">Yaşam Tarzı</option>
                    <option value="Tarifler">Tarifler</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Okuma Süresi (dk)
                  </label>
                  <input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    min="1"
                    max="60"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="beslenme, sağlık, diyet (virgülle ayırın)"
                />
                <p className="text-xs text-gray-500 mt-1">Etiketleri virgülle ayırın</p>
              </div>

              {/* Status and Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                    <option value="archived">Arşivle</option>
                  </select>
                </div>
                
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Öne çıkan yazı
                  </label>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleContentChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={12}
                  placeholder="Blog yazısının içeriği..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tahmini okuma süresi: {formData.readTime} dakika
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Önizleme
              </h3>
              
              {/* Preview Content */}
              <div className="space-y-4">
                {coverImagePreview && (
                  <img
                    src={coverImagePreview}
                    alt="Kapak görseli"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                {formData.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium rounded-full">
                    {formData.category}
                  </span>
                )}
                
                {formData.title && (
                  <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                )}
                
                {formData.excerpt && (
                  <p className="text-gray-600 italic">{formData.excerpt}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formData.readTime} dk okuma</span>
                  </div>
                </div>
                
                {formData.content && (
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 whitespace-pre-line">
                      {formData.content.substring(0, 500)}
                      {formData.content.length > 500 && '...'}
                    </div>
                  </div>
                )}
                
                {formData.tags && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {formData.status === 'published' ? (
              <span className="text-green-600 font-medium">✓ Yayınlanacak</span>
            ) : formData.status === 'draft' ? (
              <span className="text-yellow-600 font-medium">📝 Taslak olarak kaydedilecek</span>
            ) : (
              <span className="text-gray-600 font-medium">📁 Arşivlenecek</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </Button>
            
            {/* Taslak Kaydet Butonu */}
            <Button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'draft' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title || !formData.content}
              variant="outline"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Taslak Kaydet
                </div>
              )}
            </Button>
            
            {/* Yayınla Butonu */}
            <Button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'published' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title || !formData.content}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Yayınlanıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {editingPost ? 'Güncelle ve Yayınla' : 'Yayınla'}
                </div>
              )}
            </Button>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {formData.status === 'published' ? (
              <span className="text-green-600 font-medium">✓ Yayınlanacak</span>
            ) : formData.status === 'draft' ? (
              <span className="text-yellow-600 font-medium">📝 Taslak olarak kaydedilecek</span>
            ) : (
              <span className="text-gray-600 font-medium">📁 Arşivlenecek</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </Button>
            
            {/* Taslak Kaydet Butonu */}
            <Button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'draft' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title || !formData.content}
              variant="outline"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Taslak Kaydet
                </div>
              )}
            </Button>
            
            {/* Yayınla Butonu */}
            <Button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'published' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title || !formData.content}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Yayınlanıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {editingPost ? 'Güncelle ve Yayınla' : 'Yayınla'}
                </div>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}