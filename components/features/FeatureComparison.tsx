'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function FeatureComparison() {
  const comparisonData = [
    {
      feature: 'Danışan Yönetimi',
      traditional: false,
      diyetpro: true,
      description: 'Tüm danışan bilgilerini tek platformda yönetin'
    },
    {
      feature: 'Otomatik Randevu Sistemi',
      traditional: false,
      diyetpro: true,
      description: 'Online randevu alma ve yönetim sistemi'
    },
    {
      feature: 'Diyet Planı Oluşturma',
      traditional: 'Manuel',
      diyetpro: true,
      description: 'Hızlı ve profesyonel plan oluşturma araçları'
    },
    {
      feature: 'İlerleme Takibi',
      traditional: false,
      diyetpro: true,
      description: 'Grafik ve raporlarla detaylı takip'
    },
    {
      feature: 'Mesajlaşma Sistemi',
      traditional: false,
      diyetpro: true,
      description: 'Güvenli danışan iletişimi'
    },
    {
      feature: 'Raporlama',
      traditional: 'Manuel',
      diyetpro: true,
      description: 'Otomatik rapor oluşturma'
    },
    {
      feature: 'Veri Güvenliği',
      traditional: 'Sınırlı',
      diyetpro: true,
      description: 'KVKK uyumlu güvenli platform'
    },
    {
      feature: 'Mobil Erişim',
      traditional: false,
      diyetpro: true,
      description: 'Her yerden erişim imkanı'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Geleneksel Yöntemler vs <span className="text-green-600">DiyetUp</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Neden binlerce diyetisyen geleneksel yöntemleri bırakıp DiyetUp'ı tercih ediyor?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-3 bg-gray-50 p-6 border-b border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Özellik</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-600">Geleneksel Yöntem</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-600">DiyetPro</h3>
              <h3 className="text-lg font-semibold text-green-600">DiyetUp</h3>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="grid grid-cols-3 p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{item.feature}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex items-center justify-center">
                  {item.traditional === false ? (
                    <X className="w-6 h-6 text-red-500" />
                  ) : item.traditional === true ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <span className="text-sm text-gray-600 font-medium">{item.traditional}</span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-green-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Sonuç: %300 Daha Verimli Çalışma</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              DiyetUp kullanan diyetisyenler, geleneksel yöntemlere göre 3 kat daha hızlı çalışıyor ve
              danışan memnuniyetinde %95 artış sağlıyor.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200">
              Ücretsiz Denemeyi Başlat
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}