'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Ayşe Kaya',
      title: 'Klinik Diyetisyeni',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'DiyetUp sayesinde danışanlarımla olan iletişimim çok daha profesyonel hale geldi. Diyet planlarını oluşturmak artık çok daha kolay.',
      rating: 5
    },
    {
      name: 'Dyt. Mehmet Özkan',
      title: 'Serbest Diyetisyen',
      image: 'https://images.pexels.com/photos/6749772/pexels-photo-6749772.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Platform gerçekten kullanıcı dostu. Randevu sistemi ve raporlama özellikleri işimi çok kolaylaştırdı. Kesinlikle tavsiye ederim.',
      rating: 5
    },
    {
      name: 'Prof. Dr. Zeynep Demir',
      title: 'Beslenme Uzmanı',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Akademik çalışmalarım için ihtiyaç duyduğum tüm raporlama araçları mevcut. Veri güvenliği konusunda da çok titizler.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-green-50">
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
            Diyetisyenler <span className="text-green-600">Ne Diyor?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Binlerce diyetisyen DiyetUp ile işlerini daha verimli hale getirdi. İşte onların deneyimleri...
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-green-600 opacity-60" />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
                <div className="text-gray-600">Aktif Diyetisyen</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
                <div className="text-gray-600">Yönetilen Danışan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Kullanıcı Memnuniyeti</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Garantisi</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}