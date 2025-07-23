import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock, CheckCircle, X } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // PayTR entegrasyonu simülasyonu
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (step === 1) {
        setStep(2);
        setIsLoading(false);
        return;
      }
      
      // Ödeme başarılı
      const paymentData = {
        paymentMethod: 'PayTR',
        paymentId: `paytr_${Date.now()}`,
        cardLast4: formData.cardNumber.slice(-4),
        amount: planPrice,
        plan: planName
      };
      
      onSuccess(paymentData);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg max-w-md w-full p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">3D Secure Doğrulama</h2>
            <p className="text-gray-600">
              Bankanızın 3D Secure doğrulama ekranına yönlendiriliyorsunuz...
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Paket:</span>
              <span className="font-medium">{planName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tutar:</span>
              <span className="font-medium">{planPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kart:</span>
              <span className="font-medium">**** **** **** {formData.cardNumber.slice(-4)}</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>İşleniyor...</span>
                </div>
              ) : (
                <span>Doğrula ve Tamamla</span>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-md w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Güvenli Ödeme</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">PayTR</div>
          </div>
          <p className="text-gray-600">
            PayTR güvenli ödeme altyapısı ile ödemenizi tamamlayın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Paket:</span>
              <span className="font-medium">{planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tutar:</span>
              <span className="font-medium">{planPrice}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Numarası
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Üzerindeki İsim
            </label>
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              placeholder="AD SOYAD"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son Kullanma Tarihi
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleInputChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
              Kartımı güvenli bir şekilde kaydet
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>İşleniyor...</span>
              </div>
            ) : (
              <span>Ödemeyi Tamamla</span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">TROY</div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            Tüm ödemeler 256-bit SSL ile şifrelenir ve güvenle saklanır.
            <br />PayTR güvenli ödeme altyapısı kullanılmaktadır.
          </p>
        </div>
      </motion.div>
    </div>
  );
}