'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar, Target } from 'lucide-react';

export default function ClientsStats() {
  const [stats, setStats] = useState([
    {
      name: 'Toplam Danışan',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: Users,
      color: 'green'
    },
    {
      name: 'Aktif Danışan',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      name: 'Bu Ay Randevu',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: Calendar,
      color: 'purple'
    },
    {
      name: 'Hedefine Ulaşan',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: Target,
      color: 'orange'
    }
  ]);

  useEffect(() => {
    fetchClientsStats();
    
    // localStorage değişikliklerini dinle
    const handleStorageChange = () => {
      fetchClientsStats();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchClientsStats = async () => {
    try {
      // localStorage'dan danışan verilerini al
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setStats([
          { name: 'Toplam Danışan', value: '0', change: '0', changeType: 'neutral', icon: Users, color: 'green' },
          { name: 'Aktif Danışan', value: '0', change: '0%', changeType: 'neutral', icon: TrendingUp, color: 'blue' },
          { name: 'Bu Ay Eklenen', value: '0', change: 'henüz yok', changeType: 'neutral', icon: Calendar, color: 'purple' },
          { name: 'Hedefine Ulaşan', value: '0', change: '0%', changeType: 'neutral', icon: Target, color: 'orange' }
        ]);
        return;
      }
      
      const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      const totalClients = clients.length;
      const activeClients = clients.filter((c: any) => c.status === 'active').length;
      const completedClients = clients.filter((c: any) => c.status === 'completed').length;
      
      // Bu ay eklenen danışanlar
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const thisMonthClients = clients.filter((c: any) => {
        const clientDate = new Date(c.createdAt);
        return clientDate.getMonth() === thisMonth && clientDate.getFullYear() === thisYear;
      }).length;
      
      setStats([
        {
          name: 'Toplam Danışan',
          value: totalClients.toString(),
          change: thisMonthClients > 0 ? `+${thisMonthClients}` : '0',
          changeType: thisMonthClients > 0 ? 'increase' : 'neutral',
          icon: Users,
          color: 'green'
        },
        {
          name: 'Aktif Danışan',
          value: activeClients.toString(),
          change: activeClients > 0 ? `${Math.round((activeClients / totalClients) * 100) || 0}%` : '0%',
          changeType: activeClients > 0 ? 'increase' : 'neutral',
          icon: TrendingUp,
          color: 'blue'
        },
        {
          name: 'Bu Ay Eklenen',
          value: thisMonthClients.toString(),
          change: thisMonthClients > 0 ? 'yeni' : 'henüz yok',
          changeType: thisMonthClients > 0 ? 'increase' : 'neutral',
          icon: Calendar,
          color: 'purple'
        },
        {
          name: 'Hedefine Ulaşan',
          value: completedClients.toString(),
          change: completedClients > 0 ? `${Math.round((completedClients / totalClients) * 100) || 0}%` : '0%',
          changeType: completedClients > 0 ? 'increase' : 'neutral',
          icon: Target,
          color: 'orange'
        }
      ]);
    } catch (error) {
      console.log('Clients stats yüklenemedi, varsayılan değerler kullanılıyor');
    }
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
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium text-green-600">
                  {stat.changeType === 'neutral' ? stat.change : `${stat.changeType === 'increase' ? '+' : ''}${stat.change}`}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {stat.changeType === 'neutral' ? 'henüz veri yok' : 'bu ayda'}
                </span>
              </div>
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