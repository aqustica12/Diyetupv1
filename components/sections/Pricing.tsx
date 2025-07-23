'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pricing() {
  const plans = [
    {
      name: 'Başlangıç',
      icon: 'star',
      description: 'Yeni başlayan diyetisyenler için ideal',
      price: 'Ücretsiz',
      period: '/ aylık',
      features: [
        '25 aktif danışan',
        'Temel diyet planları',
        'Randevu yönetimi',
        'Temel raporlar',
        'E-posta desteği',
        'Mobil erişim'
      ],
      popular: false,
      buttonText: '1 Ay Ücretsiz Dene',
      buttonVariant: 'outline'
    },
    {
      name: 'Profesyonel',
      icon: 'lightning',
      description: 'Gelişen pratiğiniz için kapsamlı çözüm',
      price: '₺499',
      period: '/ aylık',
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
      popular: true,
      buttonText: '1 Ay Ücretsiz Dene',
      buttonVariant: 'default'
    },
    {
      name: 'Kurumsal',
      icon: 'crown',
      description: 'Büyük klinikler ve kurumlar için',
      price: '₺999',
      period: '/ aylık',
      features: [
        'Sınırsız danışan',
        'Tüm özellikler',
        'Çoklu diyetisyen',
        'Gelişmiş analizler',
        'WhatsApp entegrasyonu',
        '7/24 telefon desteği',
        'Özel geliştirmeler',
        'Eğitim ve danışmanlık',
        'Yıllık abonelikte özel web sitesi'
      ],
      popular: false,
      buttonText: '1 Ay Ücretsiz Dene',
      buttonVariant: 'outline'
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Şeffaf <span className="text-green-600">Fiyatlandırma</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İhtiyaçlarınıza uygun, esnek fiyatlandırma seçenekleri. 
            Tüm paketlerde 1 ay ücretsiz deneme süresi.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-2 border-green-500 shadow-xl' 
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    En Popüler
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center">
                {plan.icon === 'star' && (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                {plan.icon === 'lightning' && (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
                {plan.icon === 'crown' && (
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Plan Name & Description */}
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-center mb-6">{plan.description}</p>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.buttonVariant as any}
                className={`w-full py-6 ${
                  plan.buttonVariant === 'default' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                {plan.buttonText}
              </Button>

              {/* No Credit Card Required */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Kredi kartı gerekmez. İstediğiniz zaman iptal edebilirsiniz.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}