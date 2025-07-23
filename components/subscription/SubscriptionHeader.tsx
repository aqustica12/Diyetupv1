'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SubscriptionHeader() {
  const [subscription, setSubscription] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  useEffect(() => {
    // Her saniye sayacı güncelle
    const timer = setInterval(() => {
      if (subscription && subscription.isTrialActive) {
        calculateTimeLeft();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [subscription]);

  const loadSubscriptionData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;

      const subscriptionData = localStorage.getItem(`subscription_${user.id}`);
      if (subscriptionData) {
        const parsedData = JSON.parse(subscriptionData);
        setSubscription(parsedData);
        calculateTimeLeft(parsedData);
      }
    } catch (error) {
      console.error('Abonelik verileri yüklenirken hata:', error);
    }
  };

  const calculateTimeLeft = (subData = subscription) => {
    if (!subData || !subData.isTrialActive) return;

    const now = new Date().getTime();
    const trialEnd = new Date(subData.trialEndDate).getTime();
    const difference = trialEnd - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      setTimeLeft(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-green-600" />
            Abonelik
          </h1>
          <p className="text-gray-600 mt-2">
            Abonelik planınızı yönetin ve fatura bilgilerinizi görüntüleyin.
          </p>
        </div>
        
        {/* Trial Status */}
        {subscription && (
          <div className="text-right">
            {subscription.isTrialActive && timeLeft ? (
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Deneme Süresi</span>
                </div>
                <div className="text-sm">
                  {timeLeft.days}g {timeLeft.hours}s {timeLeft.minutes}d kaldı
                </div>
              </div>
            ) : subscription.status === 'expired' ? (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Süresi Doldu</span>
                </div>
              </div>
            ) : (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Aktif Abonelik</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}