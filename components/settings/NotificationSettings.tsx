'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    messageNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    systemUpdates: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Bildirim ayarları kaydedildi!');
    } catch (error) {
      alert('Kaydetme sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const notificationGroups = [
    {
      title: 'E-posta Bildirimleri',
      icon: Mail,
      settings: [
        { key: 'emailNotifications', label: 'E-posta bildirimlerini etkinleştir', description: 'Önemli güncellemeler için e-posta alın' },
        { key: 'appointmentReminders', label: 'Randevu hatırlatmaları', description: 'Yaklaşan randevular için e-posta hatırlatması' },
        { key: 'weeklyReports', label: 'Haftalık raporlar', description: 'Haftalık performans raporlarını e-posta ile alın' },
        { key: 'marketingEmails', label: 'Pazarlama e-postaları', description: 'Yeni özellikler ve promosyonlar hakkında bilgi alın' }
      ]
    },
    {
      title: 'Uygulama Bildirimleri',
      icon: Bell,
      settings: [
        { key: 'messageNotifications', label: 'Mesaj bildirimleri', description: 'Yeni mesajlar için anlık bildirim' },
        { key: 'systemUpdates', label: 'Sistem güncellemeleri', description: 'Sistem bakımı ve güncellemeler hakkında bilgi' }
      ]
    },
    {
      title: 'SMS Bildirimleri',
      icon: MessageSquare,
      settings: [
        { key: 'smsNotifications', label: 'SMS bildirimlerini etkinleştir', description: 'Acil durumlar için SMS bildirimi' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bildirim Ayarları</h3>
        <p className="text-gray-600">Hangi bildirimleri almak istediğinizi seçin</p>
      </div>

      <div className="space-y-8">
        {notificationGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
            className="border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <group.icon className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">{group.title}</h4>
            </div>

            <div className="space-y-4">
              {group.settings.map((setting) => (
                <div key={setting.key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 block mb-1">
                      {setting.label}
                    </label>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(setting.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      settings[setting.key] ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Kaydediliyor...
            </div>
          ) : (
            <div className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Ayarları Kaydet
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
}