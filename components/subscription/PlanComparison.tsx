'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Users, Calendar, Target, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanComparison() {
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAppointments: 0,
    totalSessions: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.subscription) {
        setCurrentPlan(user.subscription);
      }
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken hata:', error);
    }
  };

  const loadStats = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;

      const clients = JSON.parse(localStorage.getItem(`clients_${user.id}`) || '[]');
      const appointments = JSON.parse(localStorage.getItem(`appointments_${user.id}`) || '[]');
      const clientPackages = JSON.parse(localStorage.getItem(`clientPackages_${user.id}`) || '{}');

      // Bu aydaki gelir hesaplama
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      
      let monthlyRevenue = 0;
      
      // Randevu gelirleri
      appointments.forEach(apt => {
        const aptDate = new Date(apt.date);
        if (aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear) {
          monthlyRevenue += apt.price || 0;
        }
      });
      
      // Paket gelirleri
      Object.values(clientPackages).forEach((pkg: any) => {
        if (pkg.startDate) {
          const startDate = new Date(pkg.startDate);
          if (startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear) {
            monthlyRevenue += pkg.packagePrice || 0;
          }
        }
      });

      setStats({
        totalClients: clients.length,
        totalAppointments: appointments.length,
        totalSessions: appointments.filter(apt => apt.status === 'completed').length,
        monthlyRevenue
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Başlangıç',
      price: 'Ücretsiz',
      period: '/ aylık',
      description: 'Yeni başlayan diyetisyenler için ideal',
      clientLimit: 25,
      features: [
        '25 aktif danışan',
        'Temel diyet planları',
        'Randevu yönetimi',
        'Temel raporlar',
        'E-posta desteği',
        'Mobil erişim'
      ],
      color: 'gray'
    },
    {
      id: 'professional',
      name: 'Profesyonel',
      price: '₺499',
      period: '/ aylık',
      description: 'Gelişen pratiğiniz için kapsamlı çözüm',
      clientLimit: 100,
      features: [
        '100 aktif danışan',
        'Gelişmiş diyet planları',
        'Randevu + hatırlatmalar',
        'Detaylı raporlar',
        'Mesajlaşma sistemi',
        'Öncelikli destek',
        'API entegrasyonu',
        'Özel branding'
      ],
      color: 'green',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: '₺999',
      period: '/ aylık',
      description: 'Büyük klinikler ve kurumlar için',
      clientLimit: 'Sınırsız',
      features: [
        'Sınırsız danışan',
        'Tüm özellikler',
        'Çoklu diyetisyen',
        'Gelişmiş analizler',
        'WhatsApp entegrasyonu',
        '7/24 telefon desteği',
        'Özel geliştirmeler',
        'Eğitim ve danışmanlık'
      ],
      color: 'purple'
    }
  ];

  const handleUpgrade = (planId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return;

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // Abonelik bilgilerini güncelle
    const subscriptionData = JSON.parse(localStorage.getItem(`subscription_${user.id}`) || '{}');
    const updatedSubscription = {
      ...subscriptionData,
      plan: planId,
      isTrialActive: false,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingHistory: [
        ...(subscriptionData.billingHistory || []),
        {
          id: Date.now(),
          date: new Date().toISOString(),
          amount: plan.price,
          plan: plan.name,
          status: 'paid',
          invoice: `INV-${Date.now()}`
        }
      ]
    };

    localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSubscription));

    // Kullanıcı bilgilerini güncelle
    const updatedUser = { ...user, subscription: planId };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setCurrentPlan(planId);
    alert(`${plan.name} paketine başarıyla yükseltildi!`);
    
    // Admin panelini güncelle
    window.dispatchEvent(new Event('subscriptionUpdated'));
    
    // Sayfayı yenile
    window.location.reload();
  };

  const getCurrentPlanUsage = () => {
    const currentPlanData = plans.find(p => p.id === currentPlan);
    if (!currentPlanData) return null;

    const clientUsage = typeof currentPlanData.clientLimit === 'number' 
      ? Math.round((stats.totalClients / currentPlanData.clientLimit) * 100)
      : 0;

    return {
      clientUsage,
      isNearLimit: clientUsage > 80,
      isOverLimit: typeof currentPlanData.clientLimit === 'number' && stats.totalClients > currentPlanData.clientLimit
    };
  };

  const usage = getCurrentPlanUsage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-8"
    >
      {/* Current Usage Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Kullanım İstatistikleri</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>
            <div className="text-sm text-gray-600">Toplam Danışan</div>
            {usage && typeof plans.find(p => p.id === currentPlan)?.clientLimit === 'number' && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${usage.isOverLimit ? 'bg-red-500' : usage.isNearLimit ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(usage.clientUsage, 100)}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 ${usage.isOverLimit ? 'text-red-600' : usage.isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
                  {usage.clientUsage}% kullanıldı
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
            <div className="text-sm text-gray-600">Toplam Randevu</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
            <div className="text-sm text-gray-600">Tamamlanan Seans</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₺{stats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Aylık Gelir</div>
          </div>
        </div>

        {usage?.isNearLimit && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">Danışan limitine yaklaşıyorsunuz</p>
                <p className="text-yellow-700 text-sm">
                  Daha fazla danışan eklemek için planınızı yükseltmeyi düşünün.
                </p>
              </div>
            </div>
          </div>
        )}

        {usage?.isOverLimit && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-800">Danışan limiti aşıldı!</p>
                <p className="text-red-700 text-sm">
                  Yeni danışan ekleyemezsiniz. Lütfen planınızı yükseltin.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Karşılaştırması</h3>
          <p className="text-gray-600">Size uygun planı seçin</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-lg p-6 border-2 transition-all duration-200 ${
                currentPlan === plan.id
                  ? 'border-green-500 bg-green-50'
                  : plan.popular
                  ? 'border-green-300 bg-green-25'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    En Popüler
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {currentPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Mevcut Plan
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {currentPlan === plan.id ? (
                <Button disabled className="w-full bg-gray-100 text-gray-500">
                  Mevcut Planınız
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full ${
                    plan.color === 'green'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : plan.color === 'purple'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'border-gray-600 text-gray-600 hover:bg-gray-50'
                  }`}
                  variant={plan.color === 'gray' ? 'outline' : 'default'}
                >
                  <span className="flex items-center">
                    {plan.id === 'basic' ? 'Düşür' : 'Yükselt'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}