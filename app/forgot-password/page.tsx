'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock password reset - gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">E-posta Gönderildi!</h2>
            <p className="text-gray-600 mb-6">
              Şifre sıfırlama bağlantısını <strong>{email}</strong> adresine gönderdik. 
              E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
            </p>
            
            <div className="space-y-4">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/login">Giriş Sayfasına Dön</Link>
              </Button>
              
              <button
                onClick={() => setIsEmailSent(false)}
                className="w-full text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Farklı e-posta adresi dene
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
              E-posta gelmedi mi? Spam klasörünüzü kontrol edin veya birkaç dakika bekleyin.
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">DiyetUp</span>
          </Link>
        </motion.div>

        {/* Forgot Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Şifremi Unuttum</h2>
            <p className="text-gray-600">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Gönderiliyor...
                </div>
              ) : (
                'Şifre Sıfırlama Bağlantısı Gönder'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Giriş sayfasına dön
            </Link>
          </div>
        </motion.div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Yardıma mı ihtiyacınız var?</h3>
          <p className="text-blue-700 text-sm mb-4">
            Hesabınıza erişimde sorun yaşıyorsanız destek ekibimizle iletişime geçin.
          </p>
          <Link 
            href="/contact" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Destek ile İletişime Geç →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}