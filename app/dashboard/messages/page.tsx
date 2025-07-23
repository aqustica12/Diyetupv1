'use client';

import { MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MessagesContainer from '@/components/messages/MessagesContainer';

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-green-600" />
            Mesajlar
          </h1>
          <p className="text-gray-600 mt-2">
            Danışanlarınızla güvenli mesajlaşma platformu. Mesajlar ve resimler uçtan uca şifrelidir.
          </p>
        </div>
        
        <MessagesContainer />
      </div>
    </DashboardLayout>
  );
}