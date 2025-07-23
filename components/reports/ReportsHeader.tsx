'use client';

import { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportsHeaderProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  reportType: string;
  setReportType: (type: string) => void;
}

export default function ReportsHeader({
  dateRange,
  setDateRange,
  reportType,
  setReportType
}: ReportsHeaderProps) {
  
  const handleExportAll = () => {
    try {
      // Tüm verileri dışa aktar
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const clientPackages = JSON.parse(localStorage.getItem('clientPackages') || '{}');
      
      const allData = {
        clients,
        appointments,
        clientPackages,
        timestamp: new Date().toISOString(),
        exportDate: new Date().toLocaleDateString('tr-TR')
      };
      
      // Dosyayı indir
      const exportData = JSON.stringify(allData, null, 2);
      const fileName = `diyetup-rapor-${new Date().toISOString().split('T')[0]}.json`;
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Dışa aktarma hatası:', error);
      alert('Rapor dışa aktarılırken bir hata oluştu.');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-green-600" />
            Raporlar
          </h1>
          <p className="text-gray-600 mt-2">
            Detaylı analizler ve performans raporları.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleExportAll}
          >
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrele
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              // Burada gerçek bir uygulamada API çağrısı yapılabilir
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="last7days">Son 7 Gün</option>
            <option value="last30days">Son 30 Gün</option>
            <option value="last3months">Son 3 Ay</option>
            <option value="last6months">Son 6 Ay</option>
            <option value="lastyear">Son 1 Yıl</option>
          </select>

          {/* Report Type */}
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              // Burada gerçek bir uygulamada API çağrısı yapılabilir
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="overview">Genel Bakış</option>
            <option value="clients">Danışan Analizi</option>
            <option value="appointments">Randevu Analizi</option>
            <option value="revenue">Gelir Analizi</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Özel Tarih
            </Button>
            <div className="relative group">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Gelişmiş Filtre
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="p-2">
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">Danışan Durumu</div>
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">Randevu Türü</div>
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">Ödeme Durumu</div>
                  <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">Paket Türü</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}