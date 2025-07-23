'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ContactFAQ() {
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
      question: 'Destek talebime ne kadar sürede dönüş alırım?',
      answer: 'Genel sorular için 24 saat içinde, teknik destek talepleri için 4 saat içinde dönüş yapıyoruz. Acil durumlar için canlı destek hattımızı kullanabilirsiniz.'
    },
    {
      question: 'Telefon desteği hangi saatlerde mevcut?',
      answer: 'Telefon desteğimiz Pazartesi-Cuma 09:00-18:00, Cumartesi 10:00-16:00 saatleri arasında hizmet vermektedir. Acil durumlar için 7/24 acil destek hattımız mevcuttur.'
    },
    {
      question: 'Demo talep etmek için nasıl iletişime geçebilirim?',
      answer: 'Demo talebi için satış ekibimizle iletişime geçebilirsiniz. Telefon, e-posta veya iletişim formu üzerinden talebinizi iletebilirsiniz.'
    },
    {
      question: 'Teknik sorunlar için hangi bilgileri paylaşmalıyım?',
      answer: 'Teknik destek taleplerinizde lütfen hata mesajları, ekran görüntüleri, kullandığınız tarayıcı bilgisi ve sorunun ne zaman başladığını belirtin.'
    },
    {
      question: 'Özellik önerilerimi nasıl iletebilirim?',
      answer: 'Özellik önerilerinizi iletişim formu üzerinden "Geri Bildirim" kategorisini seçerek veya doğrudan product@diyetup.com adresine e-posta göndererek iletebilirsiniz.'
    },
    {
      question: 'Fatura ve ödeme sorunları için kimle görüşmeliyim?',
      answer: 'Fatura ve ödeme ile ilgili tüm sorularınız için billing@diyetup.com adresine e-posta gönderebilir veya satış ekibimizle iletişime geçebilirsiniz.'
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
            İletişim ve destek hakkında merak ettikleriniz
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