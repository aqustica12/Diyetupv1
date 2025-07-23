'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Video, MoreHorizontal } from 'lucide-react';

export default function AppointmentCalendar() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    loadAppointments();
  }, []);
  
  const loadAppointments = () => {
    try {
      // localStorage'dan randevuları al
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setUpcomingAppointments([]);
        setLoading(false);
        return;
      }
      
      const allAppointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
      
      // Bugünkü randevuları filtrele
      const todayDate = new Date().toISOString().split('T')[0];
      setToday(todayDate);
      
      let todayAppointments = allAppointments.filter(apt => apt.date === todayDate);
      
      // Saat sırasına göre sırala
      todayAppointments.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
      
      // Eğer bugün randevu yoksa, gelecekteki ilk randevuları göster
      if (todayAppointments.length === 0) {
        const futureAppointments = allAppointments.filter(apt => apt.date > todayDate);
        futureAppointments.sort((a, b) => a.date.localeCompare(b.date));
        
        if (futureAppointments.length > 0) {
          const nextDate = futureAppointments[0].date;
          todayAppointments = futureAppointments.filter(apt => apt.date === nextDate);
          todayAppointments.sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          });
          
          // Tarihi güncelle
          setToday(nextDate);
        }
      }
      
      // Randevuları ayarla
      setUpcomingAppointments(todayAppointments);
    } catch (error) {
      console.error('Randevular yüklenirken hata:', error);
      // Hata durumunda boş liste
      setUpcomingAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Tarih formatı
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Haftanın günü
  const getDayOfWeek = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { weekday: 'long' });
    } catch (error) {
      return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return Video;
      case 'phone':
        return Phone;
      default:
        return User;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bugünkü Randevular</h3>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Date Header */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="text-2xl font-bold text-gray-900">{formatDate(today)}</div>
          <div className="text-sm text-gray-600">
            {getDayOfWeek(today)} • {upcomingAppointments.length} randevu
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-3 mt-4">
        {loading ? null : upcomingAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Bugün randevu yok</p>
            <p className="text-sm text-gray-400">Yeni randevu ekleyebilirsiniz</p>
          </div>
        ) : (
          upcomingAppointments.map((appointment, index) => {
            const TypeIcon = getTypeIcon(appointment.type);
            
            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Time */}
                <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{appointment.clientName}</p>
                    <TypeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-600 truncate">{appointment.notes || 'Not eklenmemiş'}</p>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'confirmed' ? 'Onaylandı' : 
                     appointment.status === 'pending' ? 'Bekliyor' : 
                     appointment.status === 'completed' ? 'Tamamlandı' : 
                     appointment.status === 'cancelled' ? 'İptal' : 'Bilinmiyor'}
                  </span>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => window.location.href = '/dashboard/appointments'}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
        <button 
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          onClick={() => window.location.href = '/dashboard/appointments'}
        >
          Yeni Randevu Ekle
        </button>
        <button 
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
          onClick={() => window.location.href = '/dashboard/appointments'}
        >
          Takvimi Görüntüle
        </button>
      </div>
    </motion.div>
  );
}