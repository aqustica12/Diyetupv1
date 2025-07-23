'use client';

import { motion } from 'framer-motion';
import { 
  Users, ClipboardList, Calendar, MessageSquare, BarChart3, Shield,
  Clock, Smartphone, FileText, Target, Bell, CreditCard,
  Database, Settings, Zap, Globe, Lock, HeadphonesIcon
} from 'lucide-react';

export default function FeaturesList() {
  const featureCategories = [
    {
      title: 'Danışan Yönetimi',
      description: 'Tüm danışanlarınızı tek platformda yönetin',
      features: [
        {
          icon: Users,
          title: 'Danışan Profilleri',
          description: 'Detaylı profil bilgileri, sağlık geçmişi ve hedefler'
        },
        {
          icon: Target,
          title: 'Hedef Takibi',
          description: 'Kilo, ölçü ve beslenme hedeflerini takip edin'
        },
        {
          icon: FileText,
          title: 'Dosya Yönetimi',
          description: 'Tahlil sonuçları, fotoğraflar ve belgeler'
        },
        {
          icon: Bell,
          title: 'Hatırlatmalar',
          description: 'Otomatik randevu ve kontrol hatırlatmaları'
        }
      ]
    },
    {
      title: 'Diyet Planları',
      description: 'Profesyonel diyet planları oluşturun ve yönetin',
      features: [
        {
          icon: ClipboardList,
          title: 'Plan Oluşturma',
          description: 'Kişiselleştirilmiş diyet planları hazırlayın'
        },
        {
          icon: Database,
          title: 'Besin Veritabanı',
          description: '10,000+ besin ile kapsamlı veritabanı'
        },
        {
          icon: Zap,
          title: 'Hızlı Şablonlar',
          description: 'Hazır plan şablonları ile zaman kazanın'
        },
        {
          icon: FileText,
          title: 'PDF Export',
          description: 'Planları PDF olarak dışa aktarın'
        }
      ]
    },
    {
      title: 'Randevu & İletişim',
      description: 'Randevularınızı yönetin ve danışanlarınızla iletişim kurun',
      features: [
        {
          icon: Calendar,
          title: 'Randevu Yönetimi',
          description: 'Takvim entegrasyonu ve otomatik onaylama'
        },
        {
          icon: MessageSquare,
          title: 'Mesajlaşma',
          description: 'Güvenli mesajlaşma ve dosya paylaşımı'
        },
        {
          icon: Clock,
          title: 'Zaman Yönetimi',
          description: 'Çalışma saatleri ve müsaitlik ayarları'
        },
        {
          icon: Bell,
          title: 'Bildirimler',
          description: 'SMS ve e-posta bildirimleri'
        }
      ]
    },
    {
      title: 'Raporlar & Analiz',
      description: 'Detaylı raporlar ve istatistiklerle işinizi analiz edin',
      features: [
        {
          icon: BarChart3,
          title: 'İlerleme Grafikleri',
          description: 'Danışan ilerlemelerini görsel olarak takip edin'
        },
        {
          icon: Target,
          title: 'Başarı Oranları',
          description: 'Hedeflere ulaşma oranlarını analiz edin'
        },
        {
          icon: CreditCard,
          title: 'Gelir Raporları',
          description: 'Aylık ve yıllık gelir analizleri'
        },
        {
          icon: FileText,
          title: 'Özel Raporlar',
          description: 'İhtiyacınıza özel rapor oluşturun'
        }
      ]
    },
    {
      title: 'Güvenlik & Teknik',
      description: 'Güvenli ve güvenilir platform altyapısı',
      features: [
        {
          icon: Shield,
          title: 'KVKK Uyumlu',
          description: 'Veri güvenliği ve gizlilik koruması'
        },
        {
          icon: Lock,
          title: 'SSL Şifreleme',
          description: 'End-to-end şifreleme ile güvenli veri transferi'
        },
        {
          icon: Globe,
          title: 'Bulut Altyapı',
          description: '7/24 erişim ve otomatik yedekleme'
        },
        {
          icon: Smartphone,
          title: 'Mobil Uyumlu',
          description: 'Tüm cihazlarda mükemmel deneyim'
        }
      ]
    },
    {
      title: 'Destek & Eğitim',
      description: 'Kapsamlı destek ve eğitim hizmetleri',
      features: [
        {
          icon: HeadphonesIcon,
          title: '7/24 Destek',
          description: 'Canlı destek ve telefon yardımı'
        },
        {
          icon: FileText,
          title: 'Eğitim Videoları',
          description: 'Detaylı kullanım kılavuzları ve videolar'
        },
        {
          icon: Settings,
          title: 'Kişisel Eğitim',
          description: 'Birebir eğitim ve danışmanlık'
        },
        {
          icon: Users,
          title: 'Topluluk',
          description: 'Diyetisyen topluluğu ve deneyim paylaşımı'
        }
      ]
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {featureCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: featureIndex * 0.1 }}
                    className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-green-100"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-green-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}