export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  clientLimit: number | 'unlimited';
  features: string[];
}

export interface SubscriptionData {
  plan: string;
  planName: string;
  planPrice: string;
  startDate: string;
  trialEndDate: string;
  isTrialActive: boolean;
  nextBillingDate: string;
  status: 'trial' | 'active' | 'expired';
  billingHistory: any[];
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Başlangıç',
    price: 'Ücretsiz',
    clientLimit: 25,
    features: [
      '25 aktif danışan',
      'Temel diyet planları',
      'Randevu yönetimi',
      'Temel raporlar',
      'E-posta desteği',
      'Mobil erişim'
    ]
  },
  {
    id: 'professional',
    name: 'Profesyonel',
    price: '₺499',
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
    ]
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    price: '₺999',
    clientLimit: 'unlimited',
    features: [
      'Sınırsız danışan',
      'Tüm özellikler',
      'Çoklu diyetisyen',
      'Gelişmiş analizler',
      'WhatsApp entegrasyonu',
      '7/24 telefon desteği',
      'Özel geliştirmeler',
      'Eğitim ve danışmanlık'
    ]
  }
];

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Kullanıcı verisi yüklenirken hata:', error);
    return null;
  }
}

export function getSubscriptionData(userId: string): SubscriptionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const subscriptionData = localStorage.getItem(`subscription_${userId}`);
    return subscriptionData ? JSON.parse(subscriptionData) : null;
  } catch (error) {
    console.error('Abonelik verisi yüklenirken hata:', error);
    return null;
  }
}

export function getCurrentPlan(userId: string): SubscriptionPlan | null {
  const subscription = getSubscriptionData(userId);
  if (!subscription) return null;
  
  return PLANS.find(plan => plan.id === subscription.plan) || null;
}

export function checkClientLimit(userId: string): { canAdd: boolean; message?: string } {
  const user = getCurrentUser();
  const subscription = getSubscriptionData(userId);
  const currentPlan = getCurrentPlan(userId);
  
  if (!user || !subscription || !currentPlan) {
    return { canAdd: false, message: 'Abonelik bilgisi bulunamadı.' };
  }

  // Abonelik süresi dolmuş mu kontrol et
  if (subscription.status === 'expired') {
    return { 
      canAdd: false, 
      message: 'Aboneliğiniz sona erdi. Devam etmek için lütfen ödeme yapın veya paket seçin.' 
    };
  }

  // Sınırsız plan kontrolü
  if (currentPlan.clientLimit === 'unlimited') {
    return { canAdd: true };
  }

  // Mevcut danışan sayısını al
  const clients = JSON.parse(localStorage.getItem(`clients_${userId}`) || '[]');
  const activeClients = clients.filter((client: any) => client.status !== 'archived').length;

  // Limit kontrolü
  if (activeClients >= currentPlan.clientLimit) {
    return { 
      canAdd: false, 
      message: `Danışan sınırına ulaştınız (${currentPlan.clientLimit}/${currentPlan.clientLimit}). Daha fazla danışan eklemek için paket yükseltin.` 
    };
  }

  // Limit yaklaşıyor mu kontrol et (1-2 gün öncesi)
  const daysUntilExpiry = getDaysUntilExpiry(subscription);
  if (daysUntilExpiry <= 2 && daysUntilExpiry > 0) {
    return { 
      canAdd: true, 
      message: `Aboneliğinizin bitmesine ${daysUntilExpiry} gün kaldı. Devam etmek için paket yenileyin.` 
    };
  }

  return { canAdd: true };
}

export function getDaysUntilExpiry(subscription: SubscriptionData): number {
  if (subscription.isTrialActive) {
    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else {
    const nextBilling = new Date(subscription.nextBillingDate);
    const now = new Date();
    const diffTime = nextBilling.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export function isSubscriptionExpired(userId: string): boolean {
  const subscription = getSubscriptionData(userId);
  if (!subscription) return true;
  
  return subscription.status === 'expired' || getDaysUntilExpiry(subscription) <= 0;
}

export function getSubscriptionWarning(userId: string): string | null {
  const subscription = getSubscriptionData(userId);
  if (!subscription) return null;
  
  const daysUntilExpiry = getDaysUntilExpiry(subscription);
  
  if (subscription.status === 'expired') {
    return 'Aboneliğiniz sona erdi. Devam etmek için lütfen ödeme yapın veya paket seçin.';
  }
  
  if (daysUntilExpiry <= 2 && daysUntilExpiry > 0) {
    return `Aboneliğinizin bitmesine ${daysUntilExpiry} gün kaldı. Devam etmek için paket yenileyin.`;
  }
  
  return null;
} 