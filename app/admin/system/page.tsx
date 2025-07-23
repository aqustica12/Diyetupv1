'use client';
import { useState, useEffect } from 'react';
import { Settings, Database, Server, Shield, Activity, AlertTriangle, CheckCircle, Clock, RefreshCw, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SystemStatus {
  database: 'online' | 'offline' | 'maintenance';
  server: 'online' | 'offline' | 'maintenance';
  api: 'online' | 'offline' | 'maintenance';
  storage: number; // percentage
  memory: number; // percentage
  cpu: number; // percentage
}

interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  service: string;
}

const SystemPage = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'online',
    server: 'online',
    api: 'online',
    storage: 65,
    memory: 45,
    cpu: 30
  });
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading system data
    setTimeout(() => {
      const mockLogs: SystemLog[] = [
        {
          id: '1',
          level: 'info',
          message: 'Sistem başarıyla başlatıldı',
          timestamp: '2024-12-19 10:00:00',
          service: 'System'
        },
        {
          id: '2',
          level: 'warning',
          message: 'Yüksek CPU kullanımı tespit edildi',
          timestamp: '2024-12-19 09:45:00',
          service: 'Monitor'
        },
        {
          id: '3',
          level: 'success',
          message: 'Veritabanı yedekleme tamamlandı',
          timestamp: '2024-12-19 09:30:00',
          service: 'Database'
        },
        {
          id: '4',
          level: 'error',
          message: 'API endpoint timeout hatası',
          timestamp: '2024-12-19 09:15:00',
          service: 'API'
        }
      ];
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'maintenance': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Çevrimiçi';
      case 'offline': return 'Çevrimdışı';
      case 'maintenance': return 'Bakımda';
      default: return 'Bilinmiyor';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelText = (level: string) => {
    switch (level) {
      case 'info': return 'Bilgi';
      case 'warning': return 'Uyarı';
      case 'error': return 'Hata';
      case 'success': return 'Başarılı';
      default: return 'Bilinmiyor';
    }
  };

  const handleBackup = () => {
    toast.info('Yedekleme başlatılıyor...');
  };

  const handleRestart = () => {
    toast.warning('Sistem yeniden başlatılıyor...');
  };

  const handleMaintenance = () => {
    toast.info('Bakım modu etkinleştiriliyor...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Sistem bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sistem Yönetimi</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBackup}>
              <Download className="mr-2 h-4 w-4" /> Yedekle
            </Button>
            <Button variant="outline" onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" /> Yeniden Başlat
            </Button>
            <Button variant="outline" onClick={handleMaintenance}>
              <Settings className="mr-2 h-4 w-4" /> Bakım Modu
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Veritabanı</p>
                <p className={`text-lg font-semibold ${getStatusColor(systemStatus.database)}`}>
                  {getStatusText(systemStatus.database)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sunucu</p>
                <p className={`text-lg font-semibold ${getStatusColor(systemStatus.server)}`}>
                  {getStatusText(systemStatus.server)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">API</p>
                <p className={`text-lg font-semibold ${getStatusColor(systemStatus.api)}`}>
                  {getStatusText(systemStatus.api)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sistem Durumu</p>
                <p className="text-lg font-semibold text-green-600">Normal</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Depolama</h3>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Kullanım</span>
              <span className="text-sm font-medium text-gray-900">{systemStatus.storage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${systemStatus.storage > 80 ? 'bg-red-500' : systemStatus.storage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${systemStatus.storage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bellek</h3>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Kullanım</span>
              <span className="text-sm font-medium text-gray-900">{systemStatus.memory}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${systemStatus.memory > 80 ? 'bg-red-500' : systemStatus.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${systemStatus.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CPU</h3>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Kullanım</span>
              <span className="text-sm font-medium text-gray-900">{systemStatus.cpu}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${systemStatus.cpu > 80 ? 'bg-red-500' : systemStatus.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${systemStatus.cpu}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sistem Logları</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seviye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesaj
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zaman
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLogLevelColor(log.level)}`}>
                        {getLogLevelText(log.level)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemPage; 