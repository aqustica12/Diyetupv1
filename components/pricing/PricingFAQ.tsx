'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: 'Ücretsiz deneme süresi ne kadar?',
      answer: 'Tüm paketlerimizde 14 gün ücretsiz deneme süresi sunuyoruz. Bu süre içinde herhangi bir ücret ödemeden tüm özellikleri kullanabilirsiniz.'
    },
    {
      question: 'Kredi kartı bilgisi vermem gerekiyor mu?',
      answer: 'Ücretsiz deneme için kredi kartı bilgisi vermeniz gerekmiyor. Deneme süreniz dolduğunda ve devam etmek istediğinizde ödeme bilgilerinizi ekleyebilirsiniz.'
    },
    {
      question: 'İstediğim zaman paketimi değiştirebilir miyim?',
      answer: 'Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Yükseltme durumunda değişiklik anında geçerli olur, düşürme durumunda ise mevcut fatura döneminin sonunda geçerli olur.'
    },
    {
      question: 'Danışan sayısı limitini aşarsam ne olur?',
      answer: 'Danışan sayısı limitini aştığınızda, sistem sizi bilgilendirir ve bir üst pakete geçmenizi önerir. Geçiş yapana kadar yeni danışan ekleyemezsiniz ancak mevcut danışanlarınızla çalışmaya devam edebilirsiniz.'
    },
    {
      question: 'SMS entegrasyonu nasıl çalışır?',
      answer: 'SMS entegrasyonu, Profesyonel ve Kurumsal paketlerde sunulan bir özelliktir. Randevu hatırlatmaları, önemli bildirimler ve kampanyalar için danışanlarınıza otomatik SMS gönderebilirsiniz. Her ay belirli bir SMS kontörü pakete dahildir.'
    },
    {
      question: 'Yıllık ödeme avantajı var mı?',
      answer: 'Evet, yıllık ödeme seçeneğinde %20 indirim sunuyoruz. Ayrıca Kurumsal paket için yıllık ödemede özel web sitesi hizmeti ücretsiz olarak sağlanmaktadır.'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan <span className="text-green-600">Sorular</span>
          </h2>
          <p className="text-xl text-gray-600">
            Abonelik ve fiyatlandırma hakkında merak ettikleriniz
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}