'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    checkForData();
  }, []);
  
  const checkForData = () => {
    try {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      setHasData(clients.length > 0 || appointments.length > 0);
    } catch (error) {
      console.error('Veri kontrolü sırasında hata:', error);
      setHasData(false);
    }
  };
  
  const handleExport = (reportType) => {
    setIsExporting(true);
    
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        alert('Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
        setIsExporting(false);
        return;
      }
      
      // Gerçek veri dışa aktarma
      let exportData;
      let fileName;
      
      if (reportType === 'Danışan Raporu') {
        const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
        exportData = JSON.stringify(clients, null, 2);
        fileName = 'danisan-raporu.json';
      } else if (reportType === 'Randevu Raporu') {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
        exportData = JSON.stringify(appointments, null, 2);
        fileName = 'randevu-raporu.json';
      } else if (reportType === 'Performans Raporu') {
        // Performans raporu için veri hazırla
        const clients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
        const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUserId}`) || '[]');
        const clientPackages = JSON.parse(localStorage.getItem(`clientPackages_${currentUserId}`) || '{}');
        
        const performanceData = {
          totalClients: clients.length,
          activeClients: clients.filter(c => c.status === 'active').length,
          completedClients: clients.filter(c => c.status === 'completed').length,
          totalAppointments: appointments.length,
          packages: Object.keys(clientPackages).length,
          timestamp: new Date().toISOString()
        };
        
        exportData = JSON.stringify(performanceData, null, 2);
        fileName = 'performans-raporu.json';
      }
      
      // Dosyayı indir
      if (exportData && fileName) {
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setIsExporting(false);
    } catch (error) {
      console.error('Dışa aktarma hatası:', error);
      setIsExporting(false);
      alert('Rapor dışa aktarılırken bir hata oluştu.');
    }
  };
  
  const exportOptions = [
    {
      name: 'Danışan Raporu',
      description: 'Tüm danışan bilgileri ve ilerlemeleri',
      icon: FileText,
      format: 'PDF'
    },
    {
      name: 'Randevu Raporu',
      description: 'Randevu geçmişi ve istatistikleri',
      icon: Calendar,
      format: 'Excel'
    },
    {
      name: 'Performans Raporu',
      description: 'Başarı oranları ve analizler',
      icon: BarChart3,
      format: 'PDF'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapor Dışa Aktarma</h3>
        <p className="text-gray-600">Raporlarınızı farklı formatlarda indirin</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {exportOptions.map((option, index) => (
          <motion.div
            key={option.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-green-200 hover:bg-green-50 transition-colors duration-200"
          >
            <div className="flex items-center mb-3 justify-between">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <option.icon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 mx-2">
                <h4 className="font-medium text-gray-900">{option.name}</h4>
                <span className="text-xs text-green-600 font-medium">{option.format}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{option.description}</p>
            <Button 
              variant="outline"
              onClick={() => handleExport(option.name)}
              disabled={isExporting}
              className="w-full"
            > 
              {isExporting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  İndiriliyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  İndir
                </div>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}