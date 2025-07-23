'use client';

import { motion } from 'framer-motion';

export default function ContactHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Bizimle <span className="text-green-600">İletişime</span> Geçin
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya destek talepleriniz için buradayız. 
            Size en kısa sürede dönüş yapacağız.
          </p>
        </motion.div>
      </div>
    </section>
  );
}