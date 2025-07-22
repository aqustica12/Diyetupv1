'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Ödeme başarılı olduğunda aboneliği güncelle
    const updateSubscription = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const subscription = JSON.parse(localStorage.getItem(`subscription_${user.id}`) || '{}');
        const updatedSubscription = {
          ...subscription,
          plan: 'enterprise',
          isTrialActive: false,
          status: 'active',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          planName: 'Kurumsal Plan',
          planPrice: '₺999',
          billingHistory: [
            ...subscription.billingHistory || [],
            {
              id: Date.now(),
              date: new Date().toISOString(),
              amount: '₺999',
              plan: 'Kurumsal Plan',
              status: 'paid',
              invoice: `INV-${Date.now()}`,
              paymentMethod: 'PayTR',
              paymentId: new URLSearchParams(window.location.search).get('merchant_oid')
            }
          ]
        };

        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSubscription));
        
        // Kullanıcı bilgilerini güncelle
        const updatedUser = { ...user, subscription: 'enterprise' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Admin panelini güncelle
        window.dispatchEvent(new Event('subscriptionUpdated'));
      }
    };

    updateSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ödeme Başarılı! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Kurumsal planınız aktif edildi. Artık tüm premium özelliklerden yararlanabilirsiniz.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/dashboard/subscription')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Abonelik Detaylarını Görüntüle
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Dashboard'a Dön
          </Button>
        </div>
      </div>
    </div>
  );
} 