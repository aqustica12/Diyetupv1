'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubscriptionWarning, isSubscriptionExpired } from '@/lib/subscription';

export default function SubscriptionWarning() {
  const [warning, setWarning] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkSubscription = () => {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) return;

      const warningMessage = getSubscriptionWarning(currentUserId);
      const expired = isSubscriptionExpired(currentUserId);
      
      setWarning(warningMessage);
      setIsExpired(expired);
    };

    checkSubscription();
    
    // Her dakika kontrol et
    const interval = setInterval(checkSubscription, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!warning && !isExpired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-4 mb-6 ${
        isExpired 
          ? 'bg-red-50 border border-red-200 text-red-800' 
          : 'bg-orange-50 border border-orange-200 text-orange-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${
            isExpired ? 'text-red-600' : 'text-orange-600'
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              isExpired ? 'text-red-900' : 'text-orange-900'
            }`}>
              {isExpired ? 'Abonelik Sona Erdi' : 'Abonelik Uyarısı'}
            </h3>
            <p className={`text-sm ${
              isExpired ? 'text-red-700' : 'text-orange-700'
            }`}>
              {warning}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWarning(null)}
          className={`p-1 ${
            isExpired ? 'text-red-600 hover:text-red-700' : 'text-orange-600 hover:text-orange-700'
          }`}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {isExpired && (
        <div className="mt-3">
          <Button
            onClick={() => window.location.href = '/dashboard/subscription'}
            className="bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Paket Seç
          </Button>
        </div>
      )}
    </motion.div>
  );
} 