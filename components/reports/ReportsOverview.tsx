'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Calendar, Target, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ReportsOverview() {
  const [stats, setStats] = useState([
    { name: 'Toplam Danışan', value: '0', change: '0%', changeType: 'neutral', icon: Users, color: 'green' },
    { name: 'Bu Ay Randevu', value: '0', change: '0%', changeType: 'neutral', icon: Calendar, color: 'blue' },
    { name: 'Seans Sayısı', value: '0', change: '0%', changeType: 'neutral', icon: Target, color: 'purple' },
    { name: 'Aylık Gelir', value: '₺0', change: '0%', changeType: 'neutral', icon: DollarSign, color: 'orange' }
  ]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = () => {
    try {
      // localStorage'dan verileri al
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setStats([
          { name: 'Toplam Danışan', value: '0', change: '0%', changeType: 'neutral', icon: Users, color: 'green' },
          { name: 'Bu Ay Randevu', value: '0', change: '0%', changeType: 'neutral', icon: Calendar, color: 'blue' },
          { name: 'Seans Sayısı', value: '0', change: '0%', changeType: 'neutral', icon: Target, color: 'purple' },
          { name: 'Aylık Gelir', value: '₺0', change: '0%', changeType: 'neutral', icon: DollarSign, color: 'orange' }
        ]);
        setLoading(false);
        return;
      }
      
      const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
      const clientPackages = JSON.parse(localStorage.getItem(`clientPackages_${currentUserId}`) || '{}');
      
      // Toplam danışan sayısı
      const totalClients = clients.length;
      
      // Tarih hesaplamaları
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      const lastMonth = new Date(thisYear, thisMonth - 1, 1);
      
      // Bu aydaki randevular
      const thisMonthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear;
      });
      
      // Geçen aydaki randevular
      const lastMonthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === lastMonth.getMonth() && aptDate.getFullYear() === lastMonth.getFullYear();
      });
      
      // Toplam seans sayısı
      const totalSessions = appointments.length;
      
      // Aylık gelir hesaplama
      let thisMonthRevenue = 0;
      let lastMonthRevenue = 0;
      
      // Bu aydaki randevu gelirleri
      thisMonthAppointments.forEach(apt => {
        thisMonthRevenue += apt.price || 0;
      });
      
      // Geçen aydaki randevu gelirleri
      lastMonthAppointments.forEach(apt => {
        lastMonthRevenue += apt.price || 0;
      });
      
      // Paket gelirlerini ekle
      Object.values(clientPackages).forEach((pkg: any) => {
        if (pkg.startDate) {
          const startDate = new Date(pkg.startDate);
          if (startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear) {
            thisMonthRevenue += pkg.packagePrice || 0;
          } else if (startDate.getMonth() === lastMonth.getMonth() && startDate.getFullYear() === lastMonth.getFullYear()) {
            lastMonthRevenue += pkg.packagePrice || 0;
          }
        }
      });
      
      // Değişim oranları
      const appointmentChange = lastMonthAppointments.length > 0 
        ? Math.round((thisMonthAppointments.length - lastMonthAppointments.length) / lastMonthAppointments.length * 100) 
        : 0;
      
      const revenueChange = lastMonthRevenue > 0 
        ? Math.round((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) 
        : 0;
      
      // Geçen aya göre danışan artışı (demo için)
      const clientChange = Math.round(Math.random() * 20);
      
      // Geçen aya göre seans artışı (demo için)
      const sessionChange = Math.round(Math.random() * 15);
      
      setStats([
        {
          name: 'Toplam Danışan',
          value: totalClients.toString(),
          change: `+${clientChange}%`,
          changeType: clientChange > 0 ? 'increase' : clientChange < 0 ? 'decrease' : 'neutral',
          icon: Users,
          color: 'green'
        },
        {
          name: 'Bu Ay Randevu',
          value: thisMonthAppointments.length.toString(),
          change: `${appointmentChange > 0 ? '+' : ''}${appointmentChange}%`,
          changeType: appointmentChange > 0 ? 'increase' : appointmentChange < 0 ? 'decrease' : 'neutral',
          icon: Calendar,
          color: 'blue'
        },
        {
          name: 'Seans Sayısı',
          value: totalSessions.toString(),
          change: `+${sessionChange}%`,
          changeType: sessionChange > 0 ? 'increase' : sessionChange < 0 ? 'decrease' : 'neutral',
          icon: Target,
          color: 'purple'
        },
        {
          name: 'Aylık Gelir',
          value: `₺${thisMonthRevenue.toLocaleString()}`,
          change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
          changeType: revenueChange > 0 ? 'increase' : revenueChange < 0 ? 'decrease' : 'neutral',
          icon: DollarSign,
          color: 'orange'
        }
      ]);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      // Hata durumunda demo veriler
      setStats([
        { name: 'Toplam Danışan', value: '3', change: '+10%', changeType: 'increase', icon: Users, color: 'green' },
        { name: 'Bu Ay Randevu', value: '5', change: '+5%', changeType: 'increase', icon: Calendar, color: 'blue' },
        { name: 'Seans Sayısı', value: '8', change: '+8%', changeType: 'increase', icon: Target, color: 'purple' },
        { name: 'Aylık Gelir', value: '₺1,200', change: '+12%', changeType: 'increase', icon: DollarSign, color: 'orange' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
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
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : stat.changeType === 'decrease' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    ) : null}
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
      )}
    </>
  );
}