'use client';

import { motion } from 'framer-motion';

export default function AboutStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Hikayemiz
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                DiyetUp, 2023 yılında bir grup yazılım geliştirici ve diyetisyen tarafından kuruldu.
                Kurucu ekibimiz, diyetisyenlerin günlük iş akışlarında yaşadığı zorlukları yakından gözlemledi.
              </p>
              <p>
                Danışan takibi için kullanılan Excel dosyaları, randevu yönetimi için kullanılan kağıt ajandalar, 
                diyet planlarının elle yazılması... Tüm bu süreçlerin dijitalleştirilmesi gerektiğini fark ettik.
              </p>
              <p>
                6 aylık yoğun araştırma ve geliştirme sürecinin ardından, diyetisyenlerin tüm ihtiyaçlarını 
                karşılayan kapsamlı bir platform oluşturduk. Bugün binlerce diyetisyen DiyetUp ile
                işlerini daha verimli yürütüyor.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="DiyetUp Ekibi"
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}