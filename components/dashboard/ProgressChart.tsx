'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Clock, MoreHorizontal } from 'lucide-react';

export default function ProgressChart() {
  const [chartData, setChartData] = useState<Array<{month: string, clients: number, sessions: number}>>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      // localStorage'dan gerçek verileri al
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        setChartData([]);
        setLoading(false);
        return;
      }
      
      const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
      const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
      
      // Son 6 ayın verilerini hazırla
      const months: Array<{month: string, year: number, monthIndex: number}> = [];
      const today = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = month.toLocaleString('tr-TR', { month: 'short' });
        months.push({
          month: monthName,
          year: month.getFullYear(),
          monthIndex: month.getMonth()
        });
      }
      
      // Her ay için danışan ve seans sayılarını hesapla
      const data = months.map(monthData => {
        // O ayda eklenen danışanlar
        const monthClients = clients.filter(client => {
          const clientDate = new Date(client.createdAt);
          return clientDate.getMonth() === monthData.monthIndex && 
                 clientDate.getFullYear() === monthData.year;
        }).length;
        
        // O aydaki seanslar
        const monthSessions = appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.getMonth() === monthData.monthIndex && 
                 aptDate.getFullYear() === monthData.year;
        }).length;
        
        return {
          month: monthData.month,
          clients: monthClients,
          sessions: monthSessions
        };
      });
      
      setChartData(data);
    } catch (error) {
      console.log('Progress data yüklenemedi');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Grafik için maksimum değeri hesapla
  const maxValue = chartData.length > 0 
    ? Math.max(...chartData.map(d => Math.max(d.clients, d.sessions)), 1) 
    : 1;
    
  // Animasyon için
  useEffect(() => {
    if (!loading && chartRef.current) {
      const bars = chartRef.current.querySelectorAll('.chart-bar');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          (bar as HTMLElement).style.height = `${parseInt((bar as HTMLElement).dataset.height || '0')}%`;
        }, index * 100);
      });
    }
  }, [loading, chartData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">İlerleme Analizi</h3>
          <p className="text-sm text-gray-600">Son 6 aylık danışan ve seans sayıları</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Chart Area */}
      <div className="mb-6" ref={chartRef}>
        <div className="flex items-end justify-between h-48 px-4">
          {loading ? (
            <div className="w-full flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="w-full flex items-center justify-center h-32">
              <p className="text-gray-500">Henüz veri yok</p>
            </div>
          ) : chartData.map((data, index) => (
            <div key={data.month} className="flex flex-col items-center space-y-2">
              {/* Bars */}
              <div className="flex items-end space-x-1 h-32">
                {/* Clients Bar */}
                <motion.div
                  className="w-4 bg-green-500 rounded-t-sm chart-bar transition-all duration-700 ease-out"
                  style={{ height: '0%' }}
                  data-height={`${(data.clients / maxValue) * 100}`}
                  title={`${data.clients} danışan`}
                />
                {/* Sessions Bar */}
                <motion.div
                  className="w-4 bg-blue-500 rounded-t-sm chart-bar transition-all duration-700 ease-out"
                  style={{ height: '0%' }}
                  data-height={`${(data.sessions / maxValue) * 100}`}
                  title={`${data.sessions} seans`}
                />
              </div>
              {/* Month Label */}
              <span className="text-xs text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6 flex-wrap">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Danışan Sayısı</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Seans Sayısı</span>
        </div>
      </div>

      {/* Key Metrics */}
      {!loading && chartData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-500">Büyüme</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {chartData.length > 1 && chartData[chartData.length - 1].clients > chartData[chartData.length - 2].clients 
                ? `+${Math.round((chartData[chartData.length - 1].clients - chartData[chartData.length - 2].clients) / 
                    Math.max(chartData[chartData.length - 2].clients, 1) * 100)}%` 
                : '0%'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-500">Seans</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {chartData.reduce((sum, item) => sum + item.sessions, 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-500">Ortalama</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {Math.round(chartData.reduce((sum, item) => sum + item.sessions, 0) / Math.max(chartData.length, 1))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}