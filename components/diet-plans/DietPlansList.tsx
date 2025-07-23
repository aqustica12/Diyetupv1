'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  MoreHorizontal, 
  Eye,
  Trash2, 
  Clock,
  Target,
  ChefHat,
  Plus,
  Users,
  Copy,
  Send,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface DietPlan {
  id: string;
  name: string;
  description: string;
  type: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'healthy';
  duration: number; // days
  targetCalories: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  assignedClients: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  tags: string[];
  weeklyPlan?: {[key: string]: {[key: string]: any[]}};
}

interface DietPlansListProps {
  searchTerm: string;
  filterStatus: string;
  sortBy: string;
}

export default function DietPlansList({ searchTerm, filterStatus, sortBy }: DietPlansListProps) {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    
    // Event listener ekle - diet planları güncellendiğinde listeyi yenile
    const handleDietPlansUpdate = () => {
      loadData();
    };
    
    window.addEventListener('dietPlansUpdated', handleDietPlansUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('dietPlansUpdated', handleDietPlansUpdate);
    };
  }, []);

  const loadData = () => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    // Load diet plans
    const savedPlans = JSON.parse(localStorage.getItem(`dietPlans_${currentUserId}`) || '[]');
    setDietPlans(savedPlans);

    // Load clients for assignment
    const savedClients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
    setClients(savedClients);

    setLoading(false);
  };

  const createSamplePlan = () => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const samplePlan: DietPlan = {
      id: Date.now().toString(),
      name: 'Kilo Verme Planı',
      description: 'Sağlıklı kilo verme için dengeli beslenme planı',
      type: 'weight-loss',
      duration: 30,
      targetCalories: 1500,
      status: 'draft',
      assignedClients: [],
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meals: {
        breakfast: ['Yulaf ezmesi', 'Taze meyve', 'Badem sütü'],
        lunch: ['Izgara tavuk', 'Quinoa salatası', 'Zeytinyağlı sebze'],
        dinner: ['Balık', 'Buharda sebze', 'Bulgur pilavı'],
        snacks: ['Çiğ badem', 'Elma', 'Yoğurt']
      },
      tags: ['kilo-verme', 'dengeli', 'protein']
    };

    const updatedPlans = [...dietPlans, samplePlan];
    setDietPlans(updatedPlans);
    localStorage.setItem(`dietPlans_${currentUserId}`, JSON.stringify(updatedPlans));
  };

  const deletePlan = (planId: string) => {
    if (!confirm('Bu diyet planını silmek istediğinizden emin misiniz?')) return;

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const updatedPlans = dietPlans.filter(plan => plan.id !== planId);
    setDietPlans(updatedPlans);
    localStorage.setItem(`dietPlans_${currentUserId}`, JSON.stringify(updatedPlans));
  };

  const duplicatePlan = (plan: DietPlan) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const duplicatedPlan: DietPlan = {
      ...plan,
      id: Date.now().toString(),
      name: `${plan.name} (Kopya)`,
      status: 'draft',
      assignedClients: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedPlans = [...dietPlans, duplicatedPlan];
    setDietPlans(updatedPlans);
    localStorage.setItem(`dietPlans_${currentUserId}`, JSON.stringify(updatedPlans));
  };



  const updatePlan = (updatedPlan: DietPlan) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const updatedPlans = dietPlans.map(plan => 
      plan.id === updatedPlan.id ? { ...updatedPlan, updatedAt: new Date().toISOString() } : plan
    );
    
    setDietPlans(updatedPlans);
    localStorage.setItem(`dietPlans_${currentUserId}`, JSON.stringify(updatedPlans));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'archived':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'draft':
        return 'Taslak';
      case 'completed':
        return 'Tamamlandı';
      case 'archived':
        return 'Arşivlendi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'weight-loss':
        return 'Kilo Verme';
      case 'muscle-gain':
        return 'Kas Kazanma';
      case 'maintenance':
        return 'Kilo Koruma';
      case 'healthy':
        return 'Sağlıklı Beslenme';
      default:
        return 'Diğer';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weight-loss':
        return 'text-red-600 bg-red-50';
      case 'muscle-gain':
        return 'text-blue-600 bg-blue-50';
      case 'maintenance':
        return 'text-green-600 bg-green-50';
      case 'healthy':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter and sort plans
  const filteredPlans = dietPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'clients':
        return b.assignedClients.length - a.assignedClients.length;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Diyet planları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {dietPlans.length === 0 ? 'Henüz diyet planı yok' : 'Plan bulunamadı'}
            </h3>
            <p className="text-gray-500 mb-6">
              {dietPlans.length === 0 
                ? 'İlk diyet planınızı oluşturarak başlayın'
                : 'Arama kriterlerinize uygun plan bulunamadı'
              }
            </p>
            {dietPlans.length === 0 && (
              <Button 
                onClick={createSamplePlan}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Örnek Plan Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-3">{plan.description}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(plan.type)}>
                          {getTypeText(plan.type)}
                        </Badge>
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusText(plan.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Plan Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{plan.duration} gün</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>{plan.targetCalories} kcal</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{plan.assignedClients.length} danışan</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(plan.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {plan.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {plan.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {plan.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{plan.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowViewModal(plan.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Görüntüle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => duplicatePlan(plan)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deletePlan(plan.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

                {/* View Plan Modal */}
        {showViewModal && <ViewPlanModal />}
      </div>
    )}
    </div>
  );

  // View Plan Modal Component
  function ViewPlanModal() {
    if (!showViewModal) return null;

    const plan = dietPlans.find(p => p.id === showViewModal);
    if (!plan) return null;

    const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const MEAL_NAMES = {
      'Kahvaltı': 'Kahvaltı',
      'Öğle Yemeği': 'Öğle Yemeği', 
      'Akşam Yemeği': 'Akşam Yemeği',
      'Ara Öğün': 'Ara Öğün'
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            <button
              onClick={() => setShowViewModal(null)}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Plan Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{plan.duration}</div>
                <div className="text-sm text-gray-600">Gün</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{plan.targetCalories}</div>
                <div className="text-sm text-gray-600">Hedef Kalori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{getTypeText(plan.type)}</div>
                <div className="text-sm text-gray-600">Plan Tipi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{getStatusText(plan.status)}</div>
                <div className="text-sm text-gray-600">Durum</div>
              </div>
            </div>
          </div>

          {/* Weekly Plan */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Haftalık Beslenme Planı
            </h3>
            
            <div className="space-y-6">
              {DAYS.map(day => {
                const dayData = plan.weeklyPlan?.[day];
                
                return (
                  <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Day Header */}
                    <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-semibold text-green-800">{day}</h4>
                    </div>
                    
                    {/* Meals */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(MEAL_NAMES).map(([mealKey, mealName]) => {
                          const foods = dayData?.[mealKey] || [];
                          
                          return (
                            <div key={mealKey} className="bg-gray-50 rounded-lg p-3">
                              <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                                <ChefHat className="w-4 h-4 mr-1 text-gray-600" />
                                {mealName}
                              </h5>
                              
                              {foods.length > 0 ? (
                                <div className="space-y-1">
                                  {foods.map((food, index) => (
                                    <div 
                                      key={index} 
                                      className="bg-white text-gray-700 text-sm p-2 rounded border border-gray-200"
                                    >
                                      <div className="font-medium">{typeof food === 'object' ? food.name : food}</div>
                                      {typeof food === 'object' && food.calories > 0 && (
                                        <div className="text-xs text-gray-500">{food.calories} kcal</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-sm text-center py-4">
                                  Belirlenmemiş
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <Button variant="outline" onClick={() => setShowViewModal(null)}>
              Kapat
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
}