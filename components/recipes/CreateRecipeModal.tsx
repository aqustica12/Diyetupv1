'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Eye, Upload, Tag, Calendar, Clock, Plus, Trash2, Users, Timer, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipeData: any) => void;
  editingRecipe?: any;
}

export default function CreateRecipeModal({ isOpen, onClose, onSave, editingRecipe }: CreateRecipeModalProps) {
  const [formData, setFormData] = useState({
    title: editingRecipe?.title || '',
    description: editingRecipe?.description || '',
    category: editingRecipe?.category || 'Kahvaltı',
    difficulty: editingRecipe?.difficulty || 'Kolay',
    prepTime: editingRecipe?.prepTime || 15,
    cookTime: editingRecipe?.cookTime || 30,
    servings: editingRecipe?.servings || 4,
    calories: editingRecipe?.calories || 300,
    ingredients: editingRecipe?.ingredients || [''],
    instructions: editingRecipe?.instructions || [''],
    tags: editingRecipe?.tags?.join(', ') || '',
    status: editingRecipe?.status || 'draft',
    featured: editingRecipe?.featured || false,
    coverImage: editingRecipe?.coverImage || null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState(editingRecipe?.coverImage || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const recipeData = {
        id: editingRecipe?.id || `recipe-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        prepTime: formData.prepTime,
        cookTime: formData.cookTime,
        servings: formData.servings,
        calories: formData.calories,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        instructions: formData.instructions.filter(inst => inst.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: formData.status,
        featured: formData.featured,
        coverImage: formData.coverImage,
        publishDate: formData.status === 'published' ? new Date().toISOString() : editingRecipe?.publishDate || null,
        views: editingRecipe?.views || 0,
        likes: editingRecipe?.likes || 0,
        comments: editingRecipe?.comments || 0,
        approved: editingRecipe?.approved || false,
        createdAt: editingRecipe?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSave(recipeData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Kahvaltı',
        difficulty: 'Kolay',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        calories: 300,
        ingredients: [''],
        instructions: [''],
        tags: '',
        status: 'draft',
        featured: false,
        coverImage: null
      });
      setCoverImagePreview(null);
    } catch (error) {
      console.error('Tarif kaydedilirken hata:', error);
      alert('Tarif kaydedilirken bir hata oluştu!');
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

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingRecipe ? 'Tarifi Düzenle' : 'Yeni Tarif'}
            </h2>
            <p className="text-gray-600">Sağlıklı tarifinizi oluşturun ve paylaşın</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'draft' }));
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={isLoading || !formData.title}
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
              disabled={isLoading || !formData.title}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Yayınlanıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {editingRecipe ? 'Güncelle ve Yayınla' : 'Yayınla'}
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
                  Tarif Adı *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Protein Smoothie Bowl"
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
                    className="w-full border-dashed border-2 border-gray-300 hover:border-orange-400 py-8"
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
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                  placeholder="Tarifinizin kısa açıklaması..."
                  required
                />
              </div>

              {/* Category, Difficulty, Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Kahvaltı">Kahvaltı</option>
                    <option value="Ana Yemek">Ana Yemek</option>
                    <option value="Ara Öğün">Ara Öğün</option>
                    <option value="Tatlı">Tatlı</option>
                    <option value="İçecek">İçecek</option>
                    <option value="Salata">Salata</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zorluk
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Kolay">Kolay</option>
                    <option value="Orta">Orta</option>
                    <option value="Zor">Zor</option>
                  </select>
                </div>
              </div>

              {/* Times and Servings */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazırlık (dk)
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pişirme (dk)
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porsiyon
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kalori
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Malzemeler *
                  </label>
                  <Button
                    type="button"
                    onClick={addIngredient}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Malzeme Ekle
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="1 su bardağı un"
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Yapılışı *
                  </label>
                  <Button
                    type="button"
                    onClick={addInstruction}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adım Ekle
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-2 flex-shrink-0">
                        {index + 1}
                      </span>
                      <textarea
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        rows={2}
                        placeholder="Adım açıklaması..."
                      />
                      {formData.instructions.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50 p-2 mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="protein, sağlıklı, kahvaltı (virgülle ayırın)"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Öne çıkan tarif
                  </label>
                </div>
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
                  <div className="flex space-x-2">
                    <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 text-sm font-medium rounded-full">
                      {formData.category}
                    </span>
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 text-sm font-medium rounded-full">
                      {formData.difficulty}
                    </span>
                  </div>
                )}
                
                {formData.title && (
                  <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                )}
                
                {formData.description && (
                  <p className="text-gray-600">{formData.description}</p>
                )}
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Timer className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <div className="text-sm font-bold">{formData.prepTime}</div>
                    <div className="text-xs text-gray-600">Hazırlık</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <Clock className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <div className="text-sm font-bold">{formData.cookTime}</div>
                    <div className="text-xs text-gray-600">Pişirme</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-bold">{formData.servings}</div>
                    <div className="text-xs text-gray-600">Kişi</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Utensils className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-bold">{formData.calories}</div>
                    <div className="text-xs text-gray-600">Kalori</div>
                  </div>
                </div>
                
                {formData.ingredients.filter(ing => ing.trim()).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Malzemeler</h4>
                    <ul className="space-y-1">
                      {formData.ingredients.filter(ing => ing.trim()).map((ingredient, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.instructions.filter(inst => inst.trim()).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Yapılışı</h4>
                    <ol className="space-y-2">
                      {formData.instructions.filter(inst => inst.trim()).map((instruction, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <span className="w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
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
      </motion.div>
    </div>
  );
}