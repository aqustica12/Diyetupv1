'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState({
    merchant_oid: '',
    amount: '',
    status: 'success'
  });

  useEffect(() => {
    // URL'den parametreleri al
    const merchant_oid = searchParams.get('merchant_oid') || '';
    const amount = searchParams.get('amount') || '';
    
    setOrderInfo({
      merchant_oid,
      amount,
      status: 'success'
    });

    // 5 saniye sonra dashboard'a yönlendir
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Başarı İkonu */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Ödeme Başarılı! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          Aboneliğiniz başarıyla aktif edilmiştir.
        </motion.p>

        {/* Sipariş Bilgileri */}
        {orderInfo.merchant_oid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-lg p-4 mb-6"
          >
            <div className="text-sm text-gray-600 mb-1">Sipariş Numarası</div>
            <div className="font-mono text-sm text-gray-900">{orderInfo.merchant_oid}</div>
            {orderInfo.amount && (
              <>
                <div className="text-sm text-gray-600 mb-1 mt-3">Ödenen Tutar</div>
                <div className="font-semibold text-green-600">{orderInfo.amount}₺</div>
              </>
            )}
          </motion.div>
        )}

        {/* Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Dashboard'a Git
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </motion.div>

        {/* Otomatik Yönlendirme Bilgisi */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-gray-500 mt-6"
        >
          5 saniye sonra otomatik olarak dashboard'a yönlendirileceksiniz...
        </motion.p>
      </motion.div>
    </div>
  );
} 