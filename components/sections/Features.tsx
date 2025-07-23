'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, ClipboardList, MessageSquare, BarChart3, Shield, Clock, Smartphone } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Users,
      title: 'Danışan Yönetimi',
      description: 'Tüm danışanlarınızı tek platformda yönetin. Profil bilgileri, hedefler ve notlar için kapsamlı sistem.',
      color: 'green'
    },
    {
      icon: ClipboardList,
      title: 'Diyet Planları',
      description: 'Kişiselleştirilmiş diyet planları oluşturun. Besin değerleri ve kalori hesaplamaları otomatik.',
      color: 'blue'
    },
    {
      icon: Calendar,
      title: 'Randevu Sistemi',
      description: 'Randevularınızı kolayca planlayın ve yönetin. Otomatik hatırlatmalar ve onay sistemi.',
      color: 'purple'
    },
    {
      icon: MessageSquare,
      title: 'Mesajlaşma',
      description: 'Danışanlarınızla güvenli mesajlaşma. Dosya paylaşımı ve hızlı yanıt özelliği.',
      color: 'orange'
    },
    {
      icon: BarChart3,
      title: 'Detaylı Raporlar',
      description: 'Danışanlarınızın ilerlemesini takip edin. Grafik ve istatistiklerle görsel raporlar.',
      color: 'red'
    },
    {
      icon: Shield,
      title: 'Güvenli Platform',
      description: 'KVKK uyumlu veri güvenliği. SSL şifreleme ve düzenli güvenlik güncellemeleri.',
      color: 'green'
    },
    {
      icon: Clock,
      title: '7/24 Erişim',
      description: 'Her yerden, her zaman erişim. Bulut tabanlı sistem ile verileriniz güvende.',
      color: 'blue'
    },
    {
      icon: Smartphone,
      title: 'Mobil Uyumlu',
      description: 'Tüm cihazlarda mükemmel çalışır. Responsive tasarım ile mobil deneyim.',
      color: 'purple'
    }
  ];

  const colorClasses = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100'
  };

  return (
    <section id="features" className="py-24 bg-white">
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
            Diyetisyenler İçin <span className="text-green-600">Her Şey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Danışan yönetiminden diyet planlarına, randevu sisteminden raporlamaya kadar tüm ihtiyaçlarınız tek platformda.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:to-green-50/20 rounded-xl transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Özelliklerimizi Keşfetmek İster misiniz?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              DiyetUp'ın tüm özelliklerini detaylıca inceleyin ve nasıl işinizi kolaylaştırabileceğini görün.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Tüm Özellikleri Görün
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200"
              >
                Demo Talep Edin
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}