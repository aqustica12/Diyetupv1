'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, Users } from 'lucide-react';

interface DietPlan {
  id: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  assignedClients: string[];
  createdAt: string;
}

export default function DietPlansStats() {
  const [stats, setStats] = useState([
    {
      name: 'Toplam Plan',
      value: '0',
      description: 'oluşturulan',
      icon: ClipboardList,
      color: 'green'
    },
    {
      name: 'Aktif Plan',
      value: '0',
      description: 'devam eden',
      icon: Clock,
      color: 'blue'
    },
    {
      name: 'Tamamlanan',
      value: '0',
      description: 'başarılı',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      name: 'Danışan',
      value: '0',
      description: 'plan sahibi',
      icon: Users,
      color: 'orange'
    }
  ]);

  useEffect(() => {
    calculateStats();
    
    // Event listener ekle - diet planları güncellendiğinde istatistikleri yenile
    const handleDietPlansUpdate = () => {
      calculateStats();
    };
    
    window.addEventListener('dietPlansUpdated', handleDietPlansUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('dietPlansUpdated', handleDietPlansUpdate);
    };
  }, []);

  const calculateStats = () => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const dietPlans: DietPlan[] = JSON.parse(localStorage.getItem(`dietPlans_${currentUserId}`) || '[]');
    
    // Calculate statistics
    const totalPlans = dietPlans.length;
    const activePlans = dietPlans.filter(plan => plan.status === 'active').length;
    const completedPlans = dietPlans.filter(plan => plan.status === 'completed').length;
    
    // Get unique clients with plans
    const uniqueClients = new Set();
    dietPlans.forEach(plan => {
      plan.assignedClients.forEach(clientId => uniqueClients.add(clientId));
    });
    const clientsWithPlans = uniqueClients.size;

    // Update stats
    setStats([
      {
        name: 'Toplam Plan',
        value: totalPlans.toString(),
        description: 'oluşturulan',
        icon: ClipboardList,
        color: 'green'
      },
      {
        name: 'Aktif Plan',
        value: activePlans.toString(),
        description: 'devam eden',
        icon: Clock,
        color: 'blue'
      },
      {
        name: 'Tamamlanan',
        value: completedPlans.toString(),
        description: 'başarılı',
        icon: CheckCircle,
        color: 'purple'
      },
      {
        name: 'Danışan',
        value: clientsWithPlans.toString(),
        description: 'plan sahibi',
        icon: Users,
        color: 'orange'
      }
    ]);
  };

  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}