import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
  planId: string;
  planName: string;
  planPrice: string;
}

export default function PaymentForm({ 
  isOpen, 
  onClose, 
  onSuccess, 
  planId, 
  planName, 
  planPrice 
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Backend'den ödeme URL'si al
      const response = await fetch('https://diyetup.com/api/payment/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(planPrice.replace('₺', '')),
          package_id: planId,
          package_name: planName
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.payment_url) {
        // Ödeme sayfasına yönlendir
        window.location.href = data.payment_url;
      } else {
        alert('Ödeme başlatılamadı. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme işlemi sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-md w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ödeme Onayı</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Güvenli Ödeme</h3>
          <p className="text-gray-600">
            PayTR güvenli ödeme sayfasına yönlendirileceksiniz
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Paket:</span>
            <span className="font-medium">{planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tutar:</span>
            <span className="font-medium text-green-600">{planPrice}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Yönlendiriliyor...</span>
              </div>
            ) : (
              <span>Ödeme Sayfasına Git</span>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            İptal
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">TROY</div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            256-bit SSL ile şifreli güvenli ödeme
            <br />PayTR güvenli ödeme altyapısı
          </p>
        </div>
      </motion.div>
    </div>
  );
}