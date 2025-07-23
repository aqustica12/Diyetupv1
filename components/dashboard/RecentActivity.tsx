'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, MessageSquare, FileText, MoreHorizontal, ClipboardList, CheckCircle } from 'lucide-react';

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    generateActivities();
  }, []);
  
  const generateActivities = () => {
    try {
      // localStorage'dan verileri al
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setActivities([
          {
            id: 'demo-1',
            title: 'Hoş geldiniz',
            description: 'DiyetUp platformuna hoş geldiniz',
            time: 'şimdi',
            timestamp: Date.now(),
            icon: CheckCircle,
            color: 'green'
          }
        ]);
        setLoading(false);
        return;
      }
      
      const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
      const messages = [];
      
      // Tüm danışanların mesajlarını topla
      clients.forEach(client => {
        const clientMessages = JSON.parse(localStorage.getItem(`messages_${currentUserId}_${client.id}`) || '[]');
        clientMessages.forEach(msg => {
          messages.push({
            ...msg,
            clientName: `${client.firstName} ${client.lastName}`
          });
        });
      });
      
      // Son aktiviteleri oluştur
      const allActivities = [];
      
      // Son eklenen danışanlar
      clients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      clients.slice(0, 3).forEach(client => {
        allActivities.push({
          id: `client-${client.id}`,
          title: 'Yeni danışan eklendi',
          description: `${client.firstName} ${client.lastName} sisteme eklendi`,
          time: formatTimeAgo(client.createdAt),
          timestamp: new Date(client.createdAt).getTime(),
          icon: UserPlus,
          color: 'green'
        });
      });
      
      // Son randevular
      appointments.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
      appointments.slice(0, 3).forEach(apt => {
        allActivities.push({
          id: `apt-${apt.id}`,
          title: apt.status === 'confirmed' ? 'Randevu onaylandı' : 'Yeni randevu',
          description: `${apt.clientName} ile ${apt.time} randevusu`,
          time: formatTimeAgo(apt.createdAt || apt.date),
          timestamp: new Date(apt.createdAt || apt.date).getTime(),
          icon: Calendar,
          color: 'blue'
        });
      });
      
      // Son mesajlar
      messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      messages.slice(0, 3).forEach(msg => {
        if (msg.sender === 'client') {
          allActivities.push({
            id: `msg-${msg.id}`,
            title: 'Yeni mesaj',
            description: `${msg.clientName}'den yeni mesaj`,
            time: formatTimeAgo(msg.timestamp),
            timestamp: new Date(msg.timestamp).getTime(),
            icon: MessageSquare,
            color: 'purple'
          });
        }
      });
      
      // Eğer hiç aktivite yoksa demo aktiviteler ekle
      if (allActivities.length === 0) {
        allActivities.push(
          {
            id: 'demo-1',
            title: 'Hoş geldiniz',
            description: 'DiyetUp platformuna hoş geldiniz',
            time: 'şimdi',
            timestamp: Date.now(),
            icon: CheckCircle,
            color: 'green'
          },
          {
            id: 'demo-2',
            title: 'İlk adımlar',
            description: 'İlk danışanınızı ekleyin',
            time: 'şimdi',
            timestamp: Date.now() - 1000,
            icon: UserPlus,
            color: 'blue'
          },
          {
            id: 'demo-3',
            title: 'Diyet planı oluşturun',
            description: 'Danışanlarınız için diyet planı oluşturun',
            time: 'şimdi',
            timestamp: Date.now() - 2000,
            icon: ClipboardList,
            color: 'purple'
          }
        );
      }
      
      // Zaman damgasına göre sırala
      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      
      // En son 5 aktiviteyi al
      setActivities(allActivities.slice(0, 5));
    } catch (error) {
      console.error('Aktiviteler yüklenirken hata:', error);
      // Hata durumunda demo veriler
      setActivities([
        {
          id: 'error-1',
          title: 'Hoş geldiniz',
          description: 'DiyetUp platformuna hoş geldiniz',
          time: 'şimdi',
          icon: CheckCircle,
          color: 'green'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Zaman formatı
  const formatTimeAgo = (timestamp) => {
    try {
      const now = new Date();
      const past = new Date(timestamp);
      const diffMs = now.getTime() - past.getTime();
      
      // Saniye, dakika, saat, gün hesapla
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffSec < 60) return 'şimdi';
      if (diffMin < 60) return `${diffMin} dakika önce`;
      if (diffHour < 24) return `${diffHour} saat önce`;
      if (diffDay < 7) return `${diffDay} gün önce`;
      
      // 7 günden fazlaysa tarih göster
      return past.toLocaleDateString('tr-TR');
    } catch (error) {
      return 'bilinmeyen zaman';
    }
  };

  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Henüz aktivite yok</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`w-10 h-10 rounded-lg ${colorClasses[activity.color]} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <div className="flex-shrink-0">
                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button 
          className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          onClick={() => window.location.href = '/dashboard/reports'}
        >
          Tüm Aktiviteleri Görüntüle
        </button>
      </div>
    </motion.div>
  );
}