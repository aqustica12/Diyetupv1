'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import BillingSettings from '@/components/settings/BillingSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SettingsHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'billing' && <BillingSettings />}
      </div>
    </DashboardLayout>
  );
}