'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState({
    merchant_oid: '',
    error_message: '',
    status: 'failed'
  });

  useEffect(() => {
    // URL'den parametreleri al
    const merchant_oid = searchParams.get('merchant_oid') || '';
    const error_message = searchParams.get('error_message') || 'Ödeme işlemi tamamlanamadı';
    
    setErrorInfo({
      merchant_oid,
      error_message,
      status: 'failed'
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Hata İkonu */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-red-600" />
        </motion.div>

        {/* Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Ödeme Başarısız ❌
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          {errorInfo.error_message}
        </motion.p>

        {/* Hata Bilgileri */}
        {errorInfo.merchant_oid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-lg p-4 mb-6"
          >
            <div className="text-sm text-gray-600 mb-1">Sipariş Numarası</div>
            <div className="font-mono text-sm text-gray-900">{errorInfo.merchant_oid}</div>
          </motion.div>
        )}

        {/* Olası Sebepler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-50 rounded-lg p-4 mb-6 text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Olası Sebepler:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Kart bilgileri hatalı</li>
            <li>• Yetersiz bakiye</li>
            <li>• 3D Secure doğrulama başarısız</li>
            <li>• İşlem zaman aşımı</li>
            <li>• Banka tarafından reddedildi</li>
          </ul>
        </motion.div>

        {/* Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={() => router.push('/pricing')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
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

        {/* Destek Bilgisi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-600">
            Sorun devam ederse{' '}
            <button
              onClick={() => router.push('/contact')}
              className="text-blue-600 hover:underline font-medium"
            >
              destek ekibimizle iletişime geçin
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 