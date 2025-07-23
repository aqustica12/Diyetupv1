'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Users, Heart, Award, Globe } from 'lucide-react';

type ColorKey = 'green' | 'blue' | 'purple' | 'red' | 'orange' | 'teal';

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: ColorKey;
}
export default function AboutValues() {
  const values: Value[] = [
    {
      icon: Shield,
      title: 'Güvenlik',
      description: 'Danışan verilerinin güvenliği bizim için en önemli önceliktir. KVKK uyumlu sistemimizle verilerinizi koruyoruz.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'İnovasyon',
      description: 'Sürekli gelişen teknoloji ile diyetisyenlerin işini kolaylaştıran yenilikçi çözümler üretiyoruz.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Kullanıcı Odaklılık',
      description: 'Her özelliği diyetisyenlerin gerçek ihtiyaçları doğrultusunda tasarlıyor ve geliştiriyoruz.',
      color: 'purple'
    },
    {
      icon: Heart,
      title: 'Empati',
      description: 'Diyetisyenlerin ve danışanların deneyimlerini anlayarak daha iyi çözümler sunuyoruz.',
      color: 'red'
    },
    {
      icon: Award,
      title: 'Kalite',
      description: 'Yüksek kalite standartlarımızla güvenilir ve stabil bir platform sunuyoruz.',
      color: 'orange'
    },
    {
      icon: Globe,
      title: 'Erişilebilirlik',
      description: 'Her yerden, her zaman erişilebilen kullanıcı dostu arayüzümüzle hizmet veriyoruz.',
      color: 'teal'
    }
  ];

  const colorClasses: Record<ColorKey, string> = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600'
  };

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
            Değerlerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DiyetPro'yu oluştururken rehber aldığımız temel değerler ve ilkeler
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${colorClasses[value.color]} flex items-center justify-center mb-4`}>
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}