'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSubscriptionExpired, getSubscriptionWarning } from '@/lib/subscription';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // WebContainer ortamında mock giriş işlemi
      console.log('Giriş bilgileri:', {
        email: formData.email,
        password: formData.password
      });
      
      // Demo hesaplar
      const demoAccounts = {
        'admin@diyetup.com': {
          password: '2571998aF.',
          user: {
            id: 'admin-1',
            firstName: 'Admin', 
            lastName: 'User',
            email: 'admin@diyetup.com',
            title: 'Dr.',
            subscription: 'enterprise'
          }
        },
        'demo@diyetup.com': {
          password: 'demo123',
          user: {
            id: 'demo-1',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@diyetup.com',
            title: 'Diyetisyen',
            subscription: 'professional'
          }
        }
      };
      
      // Kayıtlı kullanıcıları localStorage'dan al
      const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      // Demo hesap kontrolü
      if (demoAccounts[formData.email] && demoAccounts[formData.email].password === formData.password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const userId = demoAccounts[formData.email].user.id;
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(demoAccounts[formData.email].user));
        localStorage.setItem('currentUserId', userId);
        
        if (formData.email === 'admin@diyetup.com') {
          window.location.href = '/admin';
        } else {
          // Demo hesap için abonelik kontrolü
          const expired = isSubscriptionExpired(userId);
          const warning = getSubscriptionWarning(userId);
          
          if (expired) {
            alert('Aboneliğiniz sona erdi. Devam etmek için lütfen ödeme yapın veya paket seçin.');
          } else if (warning) {
            alert(warning);
          }
          
          window.location.href = '/dashboard';
        }
      }
      // Kayıtlı kullanıcı kontrolü
      else if (savedUsers[formData.email] && savedUsers[formData.email].password === formData.password) {
        const user = savedUsers[formData.email].user;
        const userId = user.id;
        
        // Danışanların diyetisyen paneline giriş yapmasını engelle
        if (user.userType === 'client' || user.subscription === 'client' || user.title === 'Danışan') {
          setErrorMessage('Bu hesap danışan hesabıdır. Danışan uygulamasını kullanmanız gerekmektedir.');
          setShowErrorModal(true);
          return;
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('currentUserId', userId);
        
        // Abonelik kontrolü
        const expired = isSubscriptionExpired(userId);
        const warning = getSubscriptionWarning(userId);
        
        if (expired) {
          // Abonelik süresi dolmuşsa uyarı göster
          alert('Aboneliğiniz sona erdi. Devam etmek için lütfen ödeme yapın veya paket seçin.');
          // Yine de dashboard'a yönlendir ama kısıtlamalar aktif olacak
        } else if (warning) {
          // Uyarı varsa göster
          alert(warning);
        }
        
        window.location.href = '/dashboard';
      }
      else {
        setErrorMessage('Geçersiz e-posta veya şifre!');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Şık hata modalı
  const ErrorModal = () => {
    if (!showErrorModal) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={() => setShowErrorModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Giriş Hatası</h3>
                <p className="text-gray-600">Lütfen bilgilerinizi kontrol edin</p>
              </div>
            </div>
            <button 
              onClick={() => setShowErrorModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg mb-6">
            <p className="text-red-700">{errorMessage}</p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowErrorModal(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Tamam
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Hata Modalı */}
      <ErrorModal />
      
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
          <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">Beni hatırla</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 transition-colors duration-200">
                Şifremi unuttum
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Giriş Yap
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">veya</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Demo Account */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-green-800 mb-2">Demo Hesap</h4>
            <p className="text-sm text-green-700 mb-3">
              Platformu test etmek için demo hesabı kullanabilirsiniz:
            </p>
            <div className="text-sm text-green-600 space-y-1">
              <div><strong>E-posta:</strong> demo@diyetup.com</div>
              <div><strong>Şifre:</strong> demo123</div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
                Ücretsiz kayıt olun
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>
            Giriş yaparak{' '}
            <Link href="/terms" className="text-green-600 hover:text-green-700">
              Kullanım Şartları
            </Link>{' '}
            ve{' '}
            <Link href="/privacy" className="text-green-600 hover:text-green-700">
              Gizlilik Politikası
            </Link>
            'nı kabul etmiş olursunuz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}