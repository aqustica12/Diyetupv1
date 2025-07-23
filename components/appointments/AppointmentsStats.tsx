'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AppointmentsStatsProps {
  appointments: any[];
}

export default function AppointmentsStats({ appointments }: AppointmentsStatsProps) {
  // Gerçek verilerden istatistikleri hesapla
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const todayAppointments = appointments.filter(apt => apt.date === today).length;
  const thisWeekAppointments = appointments.filter(apt => new Date(apt.date) >= thisWeek).length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;

  const stats = [
    {
      name: 'Bugün',
      value: todayAppointments.toString(),
      description: 'randevu',
      icon: Calendar,
      color: 'green'
    },
    {
      name: 'Bu Hafta',
      value: thisWeekAppointments.toString(),
      description: 'randevu',
      icon: Clock,
      color: 'blue'
    },
    {
      name: 'Tamamlanan',
      value: completedAppointments.toString(),
      description: 'toplam',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      name: 'İptal Edilen',
      value: cancelledAppointments.toString(),
      description: 'toplam',
      icon: XCircle,
      color: 'red'
    }
  ];

  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
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
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 ml-2">{stat.description}</p>
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