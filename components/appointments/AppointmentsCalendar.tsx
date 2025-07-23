'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Video, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Appointment {
  id: number;
  clientName: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  date: string;
}

interface AppointmentsCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  appointments: Appointment[];
  viewMode: 'calendar' | 'week';
  onNewAppointment?: (date?: Date, time?: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export default function AppointmentsCalendar({ 
  selectedDate, 
  setSelectedDate, 
  appointments, 
  viewMode, 
  onNewAppointment,
  onAppointmentClick 
}: AppointmentsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    // Timezone sorununu önlemek için manuel tarih formatı
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('Aranan tarih:', dateString);
    console.log('Mevcut randevular:', appointments.map(apt => apt.date));
    
    return appointments.filter(apt => apt.date === dateString);
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

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const days = getDaysInMonth(currentMonth);
  const todayAppointments = getAppointmentsForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Pazardan başlat
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  // 30 dakikalık slotlar için saat ve dakika dizisi
  const hours = Array.from({ length: 12 * 2 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  if (viewMode === 'week') {
    const weekDays = getWeekDays(selectedDate);
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {weekDays[0].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - {weekDays[6].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">Önceki Hafta</button>
            <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">Sonraki Hafta</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 font-semibold text-gray-700 text-sm">Saat</th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className="border p-2 text-center font-semibold text-gray-700 text-sm">
                    {day.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(time => (
                <tr key={time}>
                  <td className="border p-2 text-gray-600 text-xs bg-gray-50 w-20">{time}</td>
                  {weekDays.map(day => {
                    const dayAppointments = getAppointmentsForDate(day).filter(apt => apt.time === time);
                    return (
                      <td key={day.toISOString() + time} className="border p-2 h-10 align-top text-xs">
                        {dayAppointments.length > 0 ? (
                          dayAppointments.map(apt => (
                            <div
                              key={apt.id}
                              className="bg-green-100 text-green-700 rounded px-2 py-1 mb-1 text-xs font-medium cursor-pointer hover:bg-green-200 transition"
                              onClick={() => onAppointmentClick && onAppointmentClick(apt)}
                            >
                              <div className="font-medium">{apt.clientName || 'İsimsiz'}</div>
                            </div>
                          ))
                        ) : (
                          <div 
                            className="h-6 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                            onClick={() => onNewAppointment && onNewAppointment(day, time)}
                          ></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2 h-20"></div>;
            }

            const dayAppointments = getAppointmentsForDate(day);
            const isSelected = selectedDate.toDateString() === day.toDateString();
            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
                onClick={() => setSelectedDate(day)}
                className={`p-2 h-20 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-green-50 border-green-200'
                    : isToday
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isSelected
                    ? 'text-green-700'
                    : isToday
                    ? 'text-blue-700'
                    : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map(apt => (
                    <div
                      key={apt.id}
                      className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded truncate cursor-pointer hover:bg-green-200 transition-colors"
                      onClick={() => onAppointmentClick && onAppointmentClick(apt)}
                    >
                      <div className="font-medium text-xs">{apt.clientName || 'İsimsiz'}</div>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} daha
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Day Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedDate.toLocaleDateString('tr-TR', { 
              day: 'numeric', 
              month: 'long',
              weekday: 'long'
            })}
          </h3>
          <p className="text-sm text-gray-600">
            {todayAppointments.length} randevu
          </p>
        </div>

        <div className="space-y-4">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((appointment, index) => {
              const TypeIcon = getTypeIcon(appointment.type);
              
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => onAppointmentClick && onAppointmentClick(appointment)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {appointment.time}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({appointment.duration} dk)
                      </span>
                    </div>
                    <TypeIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.clientName}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Bu tarihte randevu yok</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}