'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Heart, Soup, Fish, Salad, Leaf, Coffee, Egg, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface Food {
  id: string;
  name: string;
  calories: number;
  category: string;
}

interface CreateDietPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const MEALS = ['Kahvaltı', 'Öğle Yemeği', 'Ara Öğün', 'Akşam Yemeği'];

const FOOD_CATEGORIES = [
  { id: 'favorites', name: 'Favoriler', icon: Heart, foods: [] },
  { id: 'soup', name: 'Çorba', icon: Soup, foods: [
    { id: 'soup1', name: 'Mercimek Çorbası', calories: 120, category: 'soup' },
    { id: 'soup2', name: 'Domates Çorbası', calories: 80, category: 'soup' },
    { id: 'soup3', name: 'Tavuk Suyu', calories: 60, category: 'soup' }
  ]},
  { id: 'meat', name: 'Et/Tavuk yemeği', icon: Fish, foods: [
    { id: 'meat1', name: 'Izgara Tavuk', calories: 250, category: 'meat' },
    { id: 'meat2', name: 'Köfte', calories: 300, category: 'meat' },
    { id: 'meat3', name: 'Balık', calories: 200, category: 'meat' }
  ]},
  { id: 'salad', name: 'Salata', icon: Salad, foods: [
    { id: 'salad1', name: 'Mevsim Salatası', calories: 50, category: 'salad' },
    { id: 'salad2', name: 'Çoban Salatası', calories: 80, category: 'salad' },
    { id: 'salad3', name: 'Bulgur Pilavı', calories: 150, category: 'salad' }
  ]},
  { id: 'vegetable', name: 'Sebze yemeği', icon: Leaf, foods: [
    { id: 'veg1', name: 'Ispanak', calories: 40, category: 'vegetable' },
    { id: 'veg2', name: 'Pırasa', calories: 60, category: 'vegetable' },
    { id: 'veg3', name: 'Fırın Sebze', calories: 90, category: 'vegetable' }
  ]},
  { id: 'cheese', name: 'Peynir', icon: Coffee, foods: [
    { id: 'cheese1', name: 'Beyaz Peynir', calories: 100, category: 'cheese' },
    { id: 'cheese2', name: 'Kaşar Peynir', calories: 120, category: 'cheese' },
    { id: 'cheese3', name: 'Lor Peynir', calories: 80, category: 'cheese' }
  ]},
  { id: 'yogurt', name: 'Yoğurt', icon: Coffee, foods: [
    { id: 'yogurt1', name: 'Yoğurt (1 kase)', calories: 60, category: 'yogurt' },
    { id: 'yogurt2', name: 'Ayran', calories: 40, category: 'yogurt' },
    { id: 'yogurt3', name: 'Cacık', calories: 30, category: 'yogurt' }
  ]},
  { id: 'egg', name: 'Yumurta', icon: Egg, foods: [
    { id: 'egg1', name: 'Haşlanmış Yumurta', calories: 70, category: 'egg' },
    { id: 'egg2', name: 'Omelet', calories: 150, category: 'egg' },
    { id: 'egg3', name: 'Menemen', calories: 200, category: 'egg' }
  ]},
  { id: 'tea', name: 'Yeşil çay', icon: Zap, foods: [
    { id: 'tea1', name: 'Yeşil Çay', calories: 2, category: 'tea' },
    { id: 'tea2', name: 'Bitki Çayı', calories: 0, category: 'tea' },
    { id: 'tea3', name: 'Beyaz Çay', calories: 1, category: 'tea' }
  ]}
];

export default function CreateDietPlanModal({ isOpen, onClose }: CreateDietPlanModalProps) {
  const { addToast } = useToast();
  const [planName, setPlanName] = useState('');
  const [planDetails, setPlanDetails] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('favorites');
  const [weeklyPlan, setWeeklyPlan] = useState<{[key: string]: {[key: string]: Food[]}}>({});
  const [draggedFood, setDraggedFood] = useState<Food | null>(null);
  const [editingCell, setEditingCell] = useState<{day: string, meal: string} | null>(null);
  const [newFoodText, setNewFoodText] = useState('');
  const [showNewFoodModal, setShowNewFoodModal] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCalories, setNewFoodCalories] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState('custom');

  const loadFoodCategories = () => {
    // This function will be used to refresh food categories
    // For now we just use the default FOOD_CATEGORIES
    // Can be extended later for custom foods and favorites
  };

  useEffect(() => {
    if (isOpen) {
      // Initialize empty weekly plan
      const initialPlan: {[key: string]: {[key: string]: Food[]}} = {};
      DAYS.forEach(day => {
        initialPlan[day] = {};
        MEALS.forEach(meal => {
          initialPlan[day][meal] = [];
        });
      });
      setWeeklyPlan(initialPlan);
      loadFoodCategories();
    }
  }, [isOpen]);

  const handleDragStart = (food: Food) => {
    setDraggedFood(food);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: string, meal: string) => {
    e.preventDefault();
    if (draggedFood) {
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: [...(prev[day][meal] || []), draggedFood]
        }
      }));
      setDraggedFood(null);
    }
  };

  const removeFood = (day: string, meal: string, foodIndex: number) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: prev[day][meal].filter((_, index) => index !== foodIndex)
      }
    }));
  };

  const handleCellClick = (day: string, meal: string) => {
    setEditingCell({ day, meal });
    setNewFoodText('');
  };

  const handleCellKeyDown = (e: React.KeyboardEvent, day: string, meal: string) => {
    if (e.key === 'Enter') {
      addTextFood(day, meal);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setNewFoodText('');
    }
  };

  const addTextFood = (day: string, meal: string) => {
    if (newFoodText.trim()) {
      const newFood: Food = {
        id: `text_${Date.now()}`,
        name: newFoodText.trim(),
        calories: 0, // Default calories for manually entered food
        category: 'custom'
      };

      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: [...(prev[day][meal] || []), newFood]
        }
      }));
    }
    
    setEditingCell(null);
    setNewFoodText('');
  };

  const handleClickOutside = () => {
    if (editingCell) {
      addTextFood(editingCell.day, editingCell.meal);
    }
  };

  const addToFavorites = (food: Food) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUserId}`) || '[]');
    
    // Check if already in favorites
    if (!favorites.find((f: Food) => f.name === food.name)) {
      favorites.push(food);
      localStorage.setItem(`favorites_${currentUserId}`, JSON.stringify(favorites));
      
      // Refresh food categories
      loadFoodCategories();
      addToast({
        type: 'success',
        title: 'Favorilere Eklendi!',
        description: `${food.name} favoriler listesine eklendi.`
      });
    } else {
      addToast({
        type: 'info',
        title: 'Zaten Favorilerde',
        description: `${food.name} zaten favoriler listesinde mevcut.`
      });
    }
  };

  const handleNewFood = () => {
    if (!newFoodName.trim() || !newFoodCalories.trim()) {
      addToast({
        type: 'warning',
        title: 'Eksik Bilgi',
        description: 'Lütfen yemek adı ve kalori bilgisi girin.'
      });
      return;
    }

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const newFood: Food = {
      id: `custom_${Date.now()}`,
      name: newFoodName.trim(),
      calories: parseInt(newFoodCalories),
      category: newFoodCategory
    };

    // Add to custom foods
    const customFoods = JSON.parse(localStorage.getItem(`customFoods_${currentUserId}`) || '[]');
    customFoods.push(newFood);
    localStorage.setItem(`customFoods_${currentUserId}`, JSON.stringify(customFoods));

    // Refresh food categories
    loadFoodCategories();

    // Reset form
    setNewFoodName('');
    setNewFoodCalories('');
    setNewFoodCategory('custom');
    setShowNewFoodModal(false);

    addToast({
      type: 'success',
      title: 'Yeni Ürün Eklendi!',
      description: `${newFood.name} başarıyla eklendi ve kullanıma hazır.`
    });
  };

  const handleCreate = () => {
    if (!planName.trim()) {
      addToast({
        type: 'warning',
        title: 'Plan Adı Gerekli',
        description: 'Lütfen diyet planı için bir ad girin.'
      });
      return;
    }

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
      addToast({
        type: 'error',
        title: 'Oturum Hatası',
        description: 'Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.'
      });
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      name: planName,
      description: planDetails || `${planName} için haftalık beslenme planı`,
      type: 'healthy' as const,
      duration: 7,
      targetCalories: calculateTotalCalories(),
      status: 'draft' as const,
      assignedClients: [],
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meals: convertWeeklyPlanToMeals(),
      tags: ['haftalık'],
      weeklyPlan
    };

    // Save to localStorage with correct key
    const storageKey = `dietPlans_${currentUserId}`;
    const storedPlans = localStorage.getItem(storageKey);
    const plans = storedPlans ? JSON.parse(storedPlans) : [];
    plans.push(newPlan);
    localStorage.setItem(storageKey, JSON.stringify(plans));

    // Trigger refresh
    window.dispatchEvent(new Event('dietPlansUpdated'));

    // Show success message
    addToast({
      type: 'success',
      title: 'Plan Oluşturuldu!',
      description: `${planName} başarıyla oluşturuldu ve listenize eklendi.`
    });

    // Reset form and close
    setPlanName('');
    setPlanDetails('');
    setWeeklyPlan({});
    setEditingCell(null);
    setNewFoodText('');
    onClose();
  };

  const calculateTotalCalories = () => {
    let total = 0;
    Object.values(weeklyPlan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(mealFoods => {
        mealFoods.forEach(food => {
          total += food.calories;
        });
      });
    });
    return Math.round(total / 7); // Average per day
  };

  const convertWeeklyPlanToMeals = () => {
    const meals = {
      breakfast: [] as string[],
      lunch: [] as string[],
      dinner: [] as string[],
      snacks: [] as string[]
    };

    // Collect all unique foods from all days
    Object.values(weeklyPlan).forEach(dayPlan => {
      Object.entries(dayPlan).forEach(([mealType, foods]) => {
        foods.forEach(food => {
          const mealKey = mealType as keyof typeof meals;
          if (meals[mealKey] && !meals[mealKey].includes(food.name)) {
            meals[mealKey].push(food.name);
          }
        });
      });
    });

    return meals;
  };

  if (!isOpen) return null;

  const currentCategory = FOOD_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Yeni Diyet Planı Oluştur</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <input
                type="text"
                placeholder="Plan adı..."
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white">
              Planı Oluştur
            </Button>
          </div>
          
          <div>
            <textarea
              placeholder="Plan detayları... (Örn: Kilo almak isteyenler, çölyak hastaları için uygun)"
              value={planDetails}
              onChange={(e) => setPlanDetails(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Food Categories */}
          <div className="w-80 border-r bg-white overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800">Yemekler</h3>
            </div>
            
            {/* Category Tabs */}
            <div className="space-y-1 p-2">
              {FOOD_CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-green-100 text-green-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Foods List */}
            {currentCategory && (
              <div className="p-4 border-t">
                <h4 className="font-medium text-gray-700 mb-3">{currentCategory.name}</h4>
                <div className="space-y-2">
                  {currentCategory.foods.map(food => (
                    <div
                      key={food.id}
                      className="group relative"
                    >
                      <div
                        draggable
                        onDragStart={() => handleDragStart(food)}
                        className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-sm">{food.name}</div>
                        <div className="text-xs text-gray-500">{food.calories} kcal</div>
                      </div>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => addToFavorites(food)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-yellow-100 rounded"
                        title="Favorilere ekle"
                      >
                        <Star className="w-3 h-3 text-yellow-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Food Button */}
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowNewFoodModal(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ürün Ekle
              </Button>
            </div>
          </div>

          {/* Weekly Plan Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-8 gap-2 min-w-[800px]">
              {/* Header */}
              <div className="font-semibold text-center p-2"></div>
              {DAYS.map(day => (
                <div key={day} className="font-semibold text-center p-2 bg-green-50 rounded">
                  {day}
                </div>
              ))}

              {/* Meals Grid */}
              {MEALS.map(meal => (
                <React.Fragment key={meal}>
                  <div className="font-medium text-right p-2 bg-gray-50 rounded flex items-center justify-end">
                    {meal}
                  </div>
                  {DAYS.map(day => (
                    <div
                      key={`${day}-${meal}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, meal)}
                      onClick={() => handleCellClick(day, meal)}
                      className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-lg p-2 hover:border-green-300 transition-colors cursor-pointer relative"
                    >
                      <div className="space-y-1">
                        {weeklyPlan[day]?.[meal]?.map((food, index) => (
                          <div
                            key={index}
                            className="bg-green-100 text-green-800 text-xs p-2 rounded flex items-center justify-between"
                          >
                            <span>{food.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFood(day, meal, index);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Text Input for Manual Entry */}
                        {editingCell?.day === day && editingCell?.meal === meal && (
                          <input
                            type="text"
                            value={newFoodText}
                            onChange={(e) => setNewFoodText(e.target.value)}
                            onKeyDown={(e) => handleCellKeyDown(e, day, meal)}
                            onBlur={handleClickOutside}
                            placeholder="Yemek ekle..."
                            className="w-full text-xs p-2 border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        
                        {/* Add Button */}
                        {weeklyPlan[day]?.[meal]?.length === 0 && editingCell?.day !== day && editingCell?.meal !== meal && (
                          <div className="text-gray-400 text-xs text-center py-4">
                            Sürükle bırak veya tıkla
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Food Modal */}
      {showNewFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Yeni Ürün Ekle</h3>
              <button 
                onClick={() => setShowNewFoodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="Örn: Avokado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kalori (100g için)
                </label>
                <input
                  type="number"
                  value={newFoodCalories}
                  onChange={(e) => setNewFoodCalories(e.target.value)}
                  placeholder="160"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newFoodCategory}
                  onChange={(e) => setNewFoodCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="custom">Özel</option>
                  <option value="favorites">Favoriler</option>
                  <option value="corba">Çorba</option>
                  <option value="et">Et/Tavuk</option>
                  <option value="salata">Salata</option>
                  <option value="sebze">Sebze</option>
                  <option value="yogurt">Yoğurt</option>
                  <option value="egg">Yumurta</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewFoodModal(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button 
                  onClick={handleNewFood}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Ekle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 