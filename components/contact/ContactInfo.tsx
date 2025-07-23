'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, HeadphonesIcon } from 'lucide-react';

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'E-posta',
      description: 'Genel sorularınız için',
      contact: 'bilgi@diyetup.com',
      action: 'mailto:bilgi@diyetup.com',
      color: 'green'
    },
    {
      icon: HeadphonesIcon,
      title: 'Destek Hattı',
      description: 'Teknik destek için',
      contact: '+90 (552) 086 79 03',
      action: 'tel:+905520867903',
      color: 'blue'
    },
    {
      icon: MessageSquare,
      title: 'Canlı Destek',
      description: 'Anında yardım için',
      contact: 'Canlı sohbet başlat',
      action: '#',
      color: 'purple'
    },
    {
      icon: Phone,
      title: 'Satış',
      description: 'Satış danışmanlığı için',
      contact: '+90 (552) 086 79 03',
      action: 'tel:+905520867903',
      color: 'orange'
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: 'Adres',
      info: 'Kayseri Merkez\nKayseri, Türkiye'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      info: 'Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 16:00\nPazar: Kapalı'
    }
  ];

  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Contact Methods */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Yolları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.action}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg ${colorClasses[method.color]} flex items-center justify-center flex-shrink-0`}>
                  <method.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{method.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{method.description}</p>
                  <p className="text-sm text-green-600 font-medium">{method.contact}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Office Info */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Ofis Bilgileri</h3>
        <div className="space-y-4">
          {officeInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <info.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{info.title}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{info.info}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gray-100 rounded-lg h-64 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p>Harita Entegrasyonu</p>
          <p className="text-sm">Google Maps veya benzeri</p>
        </div>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-red-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-red-800 mb-2">Acil Durum Desteği</h3>
        <p className="text-red-700 text-sm mb-3">
          Kritik sistem sorunları için 7/24 acil destek hattımızı arayabilirsiniz.
        </p>
        <a
          href="tel:+905520867903"
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
        >
          <Phone className="w-4 h-4 mr-2" />
          +90 (552) 086 79 03
        </a>
      </motion.div>
    </motion.div>
  );
}