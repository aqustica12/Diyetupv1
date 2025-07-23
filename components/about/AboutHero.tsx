'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Target } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Diyetisyenlerin <span className="text-green-600">Dijital Partneri</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DiyetUp, diyetisyenlerin işlerini daha verimli yapabilmeleri için tasarlanmış,
            modern ve kullanıcı dostu bir SaaS platformudur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Misyonumuz</h3>
            <p className="text-gray-600">
              Diyetisyenlerin danışanlarına daha iyi hizmet verebilmesi için teknoloji ile güçlendirmek
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vizyonumuz</h3>
            <p className="text-gray-600">
              Türkiye'nin en çok tercih edilen diyetisyen yönetim platformu olmak
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hedefimiz</h3>
            <p className="text-gray-600">
              Sağlıklı beslenme kültürünün yaygınlaşmasına teknoloji ile katkı sağlamak
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}