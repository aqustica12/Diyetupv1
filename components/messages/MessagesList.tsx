'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessagesListProps {
  searchTerm: string;
  filterStatus: string;
}

export default function MessagesList({ searchTerm, filterStatus }: MessagesListProps) {
  // Yeni kullanıcılar için boş liste
  const messages: any[] = [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Mesaj Listesi ({messages.length})
        </h3>
      </div>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz mesaj yok</h3>
          <p className="text-gray-500 mb-6">Danışanlarınızla mesajlaşmaya başlayın</p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            İlk Mesajı Gönder
          </Button>
        </div>
      ) : (
        /* Messages would be listed here when available */
        <div className="divide-y divide-gray-100">
          {/* Messages would be mapped here */}
        </div>
      )}
    </div>
  );
}