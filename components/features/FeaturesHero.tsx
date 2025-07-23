'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Users, Calendar, ClipboardList, MessageSquare, BarChart3, Shield } from 'lucide-react';

export default function FeaturesHero() {
  const highlights = [
    'Danışan Yönetimi',
    'Diyet Planları',
    'Randevu Sistemi',
    'Mesajlaşma',
    'Raporlama',
    'Güvenlik'
  ];

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Diyetisyenler İçin
              <span className="text-green-600 block">Kapsamlı Çözümler</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              DiyetPro ile danışanlarınızı yönetmek, diyet planları oluşturmak ve işinizi büyütmek hiç bu kadar kolay olmamıştı.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-100"
              >
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{highlight}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}