'use client';

import { motion } from 'framer-motion';

export default function AboutStats() {
  const stats = [
    {
      number: '2,500+',
      label: 'Aktif Diyetisyen',
      description: 'Platformumuzu kullanan diyetisyen sayısı'
    },
    {
      number: '50,000+',
      label: 'Yönetilen Danışan',
      description: 'Sistemimizde takip edilen danışan sayısı'
    },
    {
      number: '1M+',
      label: 'Oluşturulan Plan',
      description: 'Platformumuzda hazırlanan diyet planı sayısı'
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Sistem çalışma süresi garantimiz'
    },
    {
      number: '4.9/5',
      label: 'Kullanıcı Memnuniyeti',
      description: 'Ortalama kullanıcı değerlendirme puanı'
    },
    {
      number: '24/7',
      label: 'Destek',
      description: 'Kesintisiz teknik destek hizmeti'
    }
  ];

  return (
    <section className="py-24 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rakamlarla DiyetUp
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Başarımızı gösteren sayılar ve kullanıcılarımızın güveni
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-green-100 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-green-200">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}