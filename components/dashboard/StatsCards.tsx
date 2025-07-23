'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsCards() {
  const [stats, setStats] = useState([
    { name: 'Toplam Danışan', value: '0', change: '0%', changeType: 'neutral', icon: Users, color: 'green' },
    { name: 'Bu Hafta Randevu', value: '0', change: '0%', changeType: 'neutral', icon: Calendar, color: 'blue' },
    { name: 'Seans Sayısı', value: '0', change: '0%', changeType: 'neutral', icon: Target, color: 'purple' },
    { name: 'Aylık Gelir', value: '₺0', change: '0%', changeType: 'neutral', icon: TrendingUp, color: 'orange' }
  ]);
  
  useEffect(() => {
    // localStorage'dan gerçek verileri al
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        // Kullanıcı giriş yapmamışsa varsayılan değerler
        return;
      }
      
      const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
      const clientPackages = JSON.parse(localStorage.getItem(`clientPackages_${currentUserId}`) || '{}');
      
      // Toplam danışan sayısı
      const totalClients = clients.length;
      
      // Bu hafta eklenen danışanlar
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      // Bu haftaki randevular
      const thisWeekAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= lastWeek && aptDate <= today;
      }).length;
      
      // Toplam seans sayısı
      const totalSessions = appointments.length;
      
      // Aylık gelir hesaplama
      let monthlyRevenue = 0;
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      
      appointments.forEach(apt => {
        const aptDate = new Date(apt.date);
        if (aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear) {
          monthlyRevenue += apt.price || 0;
        }
      });
      
      // Paket gelirlerini ekle
      Object.values(clientPackages).forEach((pkg: any) => {
        if (pkg.startDate) {
          const startDate = new Date(pkg.startDate);
          if (startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear) {
            monthlyRevenue += pkg.packagePrice || 0;
          }
        }
      });
      
      // Değişim oranları (demo için)
      const clientChange = totalClients > 0 ? '+10%' : '0%';
      const appointmentChange = thisWeekAppointments > 0 ? '+5%' : '0%';
      const sessionChange = totalSessions > 0 ? '+8%' : '0%';
      const revenueChange = monthlyRevenue > 0 ? '+12%' : '0%';
      
      setStats([
        {
          name: 'Toplam Danışan',
          value: totalClients.toString(),
          change: clientChange,
          changeType: totalClients > 0 ? 'increase' : 'neutral',
          icon: Users,
          color: 'green'
        },
        {
          name: 'Bu Hafta Randevu',
          value: thisWeekAppointments.toString(),
          change: appointmentChange,
          changeType: thisWeekAppointments > 0 ? 'increase' : 'neutral',
          icon: Calendar,
          color: 'blue'
        },
        {
          name: 'Seans Sayısı',
          value: totalSessions.toString(),
          change: sessionChange,
          changeType: totalSessions > 0 ? 'increase' : 'neutral',
          icon: Target,
          color: 'purple'
        },
        {
          name: 'Aylık Gelir',
          value: `₺${monthlyRevenue.toLocaleString()}`,
          change: revenueChange,
          changeType: monthlyRevenue > 0 ? 'increase' : 'neutral',
          icon: TrendingUp,
          color: 'orange'
        }
      ]);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  }, []);

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
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : stat.changeType === 'decrease' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <div className="w-4 h-4 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">bu ayda</span>
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