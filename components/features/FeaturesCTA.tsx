'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturesCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 shadow-xl"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Özelliklerimizi Denemeye Hazır mısınız?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Ücretsiz deneme süresi ile DiyetUp'ın tüm özelliklerini keşfedin. 
              Kredi kartı gerektirmez, istediğiniz zaman iptal edebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6"
                asChild
              >
                <a href="/register">
                  <span className="flex items-center">
                    Ücretsiz Başlayın
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                asChild
              >
                <a href="/contact">Demo Talep Edin</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}