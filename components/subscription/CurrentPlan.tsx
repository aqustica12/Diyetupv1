'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Calendar, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PaymentForm from './PaymentForm';

export default function CurrentPlan() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadSubscriptionData(userData.id);
    }
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

  const loadSubscriptionData = (userId: string) => {
    try {
      const subscriptionData = localStorage.getItem(`subscription_${userId}`);
      if (subscriptionData) {
        const parsedData = JSON.parse(subscriptionData);
        setSubscription(parsedData);
        calculateTimeLeft(parsedData);
      } else {
        // Eski kullanıcılar için varsayılan abonelik oluştur
        const defaultSubscription = {
          plan: user?.subscription || 'basic',
          startDate: new Date().toISOString(),
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isTrialActive: true,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'trial',
          billingHistory: []
        };
        localStorage.setItem(`subscription_${userId}`, JSON.stringify(defaultSubscription));
        setSubscription(defaultSubscription);
        calculateTimeLeft(defaultSubscription);
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
      // Deneme süresi bitti
      setTimeLeft(null);
      if (subData.isTrialActive) {
        const updatedSub = { ...subData, isTrialActive: false, status: 'expired' };
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSub));
        setSubscription(updatedSub);
      }
    }
  };

  const getSubscriptionText = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Başlangıç Plan';
      case 'professional':
        return 'Profesyonel Plan';
      case 'enterprise':
        return 'Kurumsal Plan';
      default:
        return 'Plan';
    }
  };

  const getSubscriptionPrice = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Ücretsiz';
      case 'professional':
        return '₺499';
      case 'enterprise':
        return '₺999';
      default:
        return 'Ücretsiz';
    }
  };

  const getSubscriptionFeatures = (plan: string) => {
    switch (plan) {
      case 'basic':
        return [
          '25 aktif danışan',
          'Temel diyet planları',
          'Randevu yönetimi',
          'Temel raporlar',
          'E-posta desteği',
          'Mobil erişim'
        ];
      case 'professional':
        return [
          '100 aktif danışan',
          'Gelişmiş diyet planları',
          'Randevu + hatırlatmalar',
          'Detaylı raporlar',
          'Mesajlaşma sistemi',
          'Öncelikli destek',
          'API entegrasyonu',
          'Özel branding'
        ];
      case 'enterprise':
        return [
          'Sınırsız danışan',
          'Tüm özellikler',
          'Çoklu diyetisyen',
          'Gelişmiş analizler',
          'WhatsApp entegrasyonu',
          '7/24 telefon desteği',
          'Özel geliştirmeler',
          'Eğitim ve danışmanlık'
        ];
      default:
        return ['25 aktif danışan', 'Temel özellikler'];
    }
  };

  const handleUpgrade = (newPlan: string) => {
    if (!user || !subscription) return;

    // Ödeme modalını aç
    setShowPaymentModal(true);
    setSelectedPlan(newPlan);
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePayment = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    
    alert(`${getSubscriptionText(selectedPlan)} paketine başarıyla yükseltildi!`);
    setShowPaymentModal(false);
  };

  const completePayment = (paymentData: any) => {
    if (!user || !subscription) return;

    const newPlan = selectedPlan;
    const updatedSubscription = {
      ...subscription,
      plan: newPlan,
      isTrialActive: false,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      planName: getSubscriptionText(newPlan),
      planPrice: getSubscriptionPrice(newPlan),
      billingHistory: [
        ...subscription.billingHistory,
        {
          id: Date.now(),
          date: new Date().toISOString(),
          amount: getSubscriptionPrice(newPlan),
          plan: getSubscriptionText(newPlan),
          status: 'paid',
          invoice: `INV-${Date.now()}`,
          paymentMethod: paymentData.paymentMethod || 'PayTR',
          paymentId: paymentData.paymentId
        }
      ]
    };

    localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSubscription));
    setSubscription(updatedSubscription);

    // Kullanıcı bilgilerini güncelle
    const updatedUser = { ...user, subscription: newPlan };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Admin panelini güncelle
    window.dispatchEvent(new Event('subscriptionUpdated'));
  };

  if (!user || !subscription) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Trial Warning */}
      {subscription.isTrialActive && timeLeft && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-3" />
              <div>
                <h3 className="text-lg font-bold">Ücretsiz Deneme Süresi</h3>
                <p className="text-orange-100">Deneme süreniz yakında sona eriyor!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {timeLeft.days}g {timeLeft.hours}s {timeLeft.minutes}d {timeLeft.seconds}sn
              </div>
              <div className="text-orange-100">kaldı</div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button 
              onClick={() => handleUpgrade('professional')}
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              Şimdi Yükselt
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Daha Sonra
            </Button>
          </div>
        </motion.div>
      )}

      {/* Expired Trial Warning */}
      {!subscription.isTrialActive && subscription.status === 'expired' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <div>
                <h3 className="text-lg font-bold">Deneme Süresi Sona Erdi</h3>
                <p className="text-red-100">Hizmete devam etmek için bir paket seçin</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              onClick={() => handleUpgrade('professional')}
              className="bg-white text-red-600 hover:bg-red-50"
            >
              Hemen Paket Seç
            </Button>
          </div>
        </motion.div>
      )}

      {/* Current Plan */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Mevcut Abonelik
          </h3>
          <p className="text-gray-600">Abonelik planınız ve fatura bilgileri</p>
        </div>

        <div className={`rounded-lg p-6 border-2 ${
          subscription.isTrialActive 
            ? 'bg-orange-50 border-orange-200' 
            : subscription.status === 'expired'
            ? 'bg-red-50 border-red-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                {subscription.planName || getSubscriptionText(subscription.plan)}
                {subscription.isTrialActive && (
                  <span className="ml-2 text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
                    {subscription.planName} Paketi - Ücretsiz Deneme
                  </span>
                )}
                {subscription.status === 'expired' && (
                  <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                    Süresi Doldu
                  </span>
                )}
              </h4>
              <p className={`${
                subscription.isTrialActive ? 'text-orange-600' : 
                subscription.status === 'expired' ? 'text-red-600' : 'text-green-600'
              }`}>
                {subscription.isTrialActive ? 'Ücretsiz deneme aktif' : 
                 subscription.status === 'expired' ? 'Abonelik süresi doldu' : 'Aktif abonelik'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {subscription.isTrialActive ? 'Ücretsiz' : (subscription.planPrice || getSubscriptionPrice(subscription.plan))}
              </div>
              <div className="text-gray-600">/ aylık</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {subscription.isTrialActive ? 'Deneme Bitiş Tarihi' : 'Sonraki Fatura Tarihi'}
              </p>
              <p className="font-medium text-gray-900">
                {new Date(subscription.isTrialActive ? subscription.trialEndDate : subscription.nextBillingDate)
                  .toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Durum</p>
              <div className="flex items-center">
                {subscription.status === 'expired' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                )}
                <span className="font-medium text-gray-900">
                  {subscription.isTrialActive ? 'Deneme Süresi' : 
                   subscription.status === 'expired' ? 'Süresi Doldu' : 'Aktif'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h5 className="font-medium text-gray-900">Paket Özellikleri:</h5>
            <ul className="space-y-2">
              {getSubscriptionFeatures(subscription.plan).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            {subscription.plan !== 'enterprise' && (
              <Button 
                onClick={() => handleUpgrade(subscription.plan === 'basic' ? 'professional' : 'enterprise')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Planı Yükselt
              </Button>
            )}
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Plan Değiştir
            </Button>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {subscription.plan !== 'enterprise' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Yükseltme Seçenekleri</h3>
            <p className="text-gray-600">İhtiyaçlarınıza göre planınızı yükseltin</p>
          </div>

          <div className="space-y-6">
            {/* Profesyonel Plan */}
            {subscription.plan === 'basic' && (
              <div className="border border-gray-200 rounded-lg p-6 hover:border-green-200 hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Profesyonel Plan</h4>
                    <p className="text-gray-600">Gelişen pratiğiniz için kapsamlı çözüm</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">₺499</div>
                    <div className="text-sm text-gray-600">/ aylık</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">100 aktif danışan</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Mesajlaşma sistemi</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Detaylı raporlar</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleUpgrade('professional')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <span className="flex items-center">
                    Profesyonel'e Yükselt
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Button>
              </div>
            )}

            {/* Kurumsal Plan */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Kurumsal Plan</h4>
                  <p className="text-gray-600">Büyük klinikler ve kurumlar için</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">₺999</div>
                  <div className="text-sm text-gray-600">/ aylık</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-gray-700">Sınırsız danışan</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-gray-700">Çoklu diyetisyen</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-gray-700">7/24 telefon desteği</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleUpgrade('enterprise')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <span className="flex items-center">
                  Kurumsal'a Yükselt
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentForm
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={completePayment}
          planId={selectedPlan}
          planName={getSubscriptionText(selectedPlan)}
          planPrice={getSubscriptionPrice(selectedPlan)}
        />
      )}
    </motion.div>
  );
}