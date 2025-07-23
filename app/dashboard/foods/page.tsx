'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Send, FileEdit, Trash2, Clock, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface FoodItem {
  id: string;
  name: string;
  category: string; // e.g., 'Meyve', 'Sebze', 'Tahıl'
  servingSize: number; // e.g., 1
  servingUnit: string; // e.g., 'adet', 'porsiyon', 'gram', 'bardak'
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: 'approved' | 'pending' | 'rejected';
  requestedBy?: string;
  createdAt: string;
  rejectionReason?: string;
}

const initialFoods: FoodItem[] = [
  { id: '1', name: 'Yulaf Ezmesi', category: 'Tahıl', servingSize: 1, servingUnit: 'kase', calories: 150, protein: 5, carbs: 27, fat: 3, status: 'approved', createdAt: new Date().toISOString() },
  { id: '2', name: 'Tavuk Göğsü (Izgara)', category: 'Et', servingSize: 100, servingUnit: 'gram', calories: 165, protein: 31, carbs: 0, fat: 4, status: 'approved', createdAt: new Date().toISOString() },
  { id: '3', name: 'Kinoa', category: 'Tahıl', servingSize: 1, servingUnit: 'porsiyon', calories: 120, protein: 4, carbs: 21, fat: 2, status: 'approved', createdAt: new Date().toISOString() },
  { id: '4', name: 'Avokado', category: 'Meyve', servingSize: 1, servingUnit: 'adet', calories: 160, protein: 2, carbs: 9, fat: 15, status: 'pending', requestedBy: 'Diyetisyen Demo', createdAt: new Date().toISOString() },
];

export default function FoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const loadFoods = () => {
    const requests = JSON.parse(localStorage.getItem('foodRequests') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedFoods') || '[]');
    // Örnek onaylanmış besinler (başlangıç için)
    const initialApproved = initialFoods.filter(f => f.status === 'approved');
    
    setFoods([...initialApproved, ...approved, ...requests]);
  };

  useEffect(() => {
    loadFoods();
    
    window.addEventListener('foodDataUpdated', loadFoods);
    
    return () => {
      window.removeEventListener('foodDataUpdated', loadFoods);
    };
  }, []);

  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Besinler Veritabanı</h1>
          <p className="text-gray-600 mt-2">
            Mevcut besinleri görüntüleyin veya sisteme yeni besin eklenmesi için talepte bulunun.
          </p>
        </header>

        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Besin ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowRequestModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Besin Talebi
          </Button>
        </div>
        
        <FoodList foods={filteredFoods} />
        
        {showRequestModal && <NewFoodRequestModal onClose={() => setShowRequestModal(false)} />}
      </div>
    </DashboardLayout>
  );
}

function FoodList({ foods }: { foods: FoodItem[] }) {
  const getStatusChip = (status: FoodItem['status']) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1"><Check size={14}/> Onaylandı</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1"><Clock size={14}/> İnceleniyor</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center gap-1"><X size={14}/> Reddedildi</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foods.map(food => (
        <motion.div
          key={food.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">{food.name}</CardTitle>
              {getStatusChip(food.status)}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Kalori:</span>
                <span className="text-gray-800">{food.calories} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Protein:</span>
                <span className="text-gray-800">{food.protein} g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Karbonhidrat:</span>
                <span className="text-gray-800">{food.carbs} g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Yağ:</span>
                <span className="text-gray-800">{food.fat} g</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function NewFoodRequestModal({ onClose }: { onClose: () => void }) {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Diğer');
  const [servingSize, setServingSize] = useState('1');
  const [servingUnit, setServingUnit] = useState('adet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !calories || !protein || !carbs || !fat) {
      addToast({ type: 'error', title: 'Eksik Bilgi', description: 'Lütfen tüm besin değerlerini girin.' });
      return;
    }

    const newRequest: FoodItem = {
      id: `food_${Date.now()}`,
      name,
      category,
      servingSize: parseInt(servingSize),
      servingUnit,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
      status: 'pending',
      requestedBy: 'Diyetisyen Demo',
      createdAt: new Date().toISOString(),
    };

    // Mevcut talepleri yükle ve yenisini ekle
    const requests = JSON.parse(localStorage.getItem('foodRequests') || '[]');
    requests.push(newRequest);
    localStorage.setItem('foodRequests', JSON.stringify(requests));
    
    addToast({
      type: 'success',
      title: 'Talep Gönderildi!',
      description: `${name} için ekleme talebiniz yöneticiye iletildi.`,
    });

    // Sayfayı yenilemek için bir event tetikle
    window.dispatchEvent(new Event('foodDataUpdated'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Yeni Besin Talebi Oluştur</h2>
            <p className="text-sm text-gray-500 mt-1">
              Eklenmesini istediğiniz besinin bilgilerini girin. Talebiniz yönetici tarafından incelenecektir.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Besin Adı (örn: Chia Tohumu)" required />
            
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded bg-white">
                <option>Diğer</option>
                <option>Meyve</option>
                <option>Sebze</option>
                <option>Tahıl</option>
                <option>Et</option>
                <option>Süt Ürünü</option>
                <option>Yağ</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <Input value={servingSize} onChange={e => setServingSize(e.target.value)} type="number" placeholder="Servis Miktarı" required />
              <select value={servingUnit} onChange={e => setServingUnit(e.target.value)} className="w-full p-2 border rounded bg-white">
                  <option>gram</option>
                  <option>adet</option>
                  <option>porsiyon</option>
                  <option>bardak</option>
                  <option>kaşık</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input value={calories} onChange={e => setCalories(e.target.value)} type="number" placeholder="Kalori" required />
              <Input value={protein} onChange={e => setProtein(e.target.value)} type="number" placeholder="Protein (g)" required />
              <Input value={carbs} onChange={e => setCarbs(e.target.value)} type="number" placeholder="Karbonhidrat (g)" required />
              <Input value={fat} onChange={e => setFat(e.target.value)} type="number" placeholder="Yağ (g)" required />
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ek notlar veya besin kaynağı linki (isteğe bağlı)"
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              Talebi Gönder
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 