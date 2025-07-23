'use client';

import { Settings, User, Bell, Shield, CreditCard } from 'lucide-react';

interface SettingsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsHeader({ activeTab, setActiveTab }: SettingsHeaderProps) {
  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'billing', name: 'Faturalama', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-green-600" />
          Ayarlar
        </h1>
        <p className="text-gray-600 mt-2">
          Hesap ayarlarınızı ve tercihlerinizi yönetin.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}