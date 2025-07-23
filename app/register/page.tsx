'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone, Building, CheckCircle, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: 'Diyetisyen',
    clinic: '',
    selectedPlan: 'basic',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Başlangıç',
      price: 'Ücretsiz',
      period: '/ aylık',
      description: 'Yeni başlayan diyetisyenler için ideal',
      features: [
        '25 aktif danışan',
        'Temel diyet planları',
        'Randevu yönetimi',
        'Temel raporlar',
        'E-posta desteği',
        'Mobil erişim'
      ],
      color: 'gray'
    },
    {
      id: 'professional',
      name: 'Profesyonel',
      price: '₺499',
      period: '/ aylık',
      description: 'Gelişen pratiğiniz için kapsamlı çözüm',
      features: [
        '100 aktif danışan',
        'Gelişmiş diyet planları',
        'Randevu + hatırlatmalar',
        'Detaylı raporlar',
        'Mesajlaşma sistemi',
        'Öncelikli destek',
        'API entegrasyonu',
        'Özel branding'
      ],
      color: 'green',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: '₺999',
      period: '/ aylık',
      description: 'Büyük klinikler ve kurumlar için',
      features: [
        'Sınırsız danışan',
        'Tüm özellikler',
        'Çoklu diyetisyen',
        'Gelişmiş analizler',
        'WhatsApp entegrasyonu',
        '7/24 telefon desteği',
        'Özel geliştirmeler',
        'Eğitim ve danışmanlık',
        'Yıllık abonelikte özel web sitesi'
      ],
      color: 'purple'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // İlk adım validasyonu
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setErrorMessage('Lütfen zorunlu alanları doldurun');
        setShowErrorModal(true);
        return;
      }
      setStep(2);
      return;
    }

    // İkinci adım - kayıt işlemi
    if (!formData.password || !formData.confirmPassword) {
      setErrorMessage('Lütfen şifre alanlarını doldurun');
      setShowErrorModal(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Şifreler eşleşmiyor');
      setShowErrorModal(true);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Şifre en az 6 karakter olmalı');
      setShowErrorModal(true);
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('Kullanım şartlarını kabul etmelisiniz');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Kayıt işlemi
      const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        clinic: formData.clinic,
        subscription: formData.selectedPlan,
        createdAt: new Date().toISOString()
      };

      // localStorage'a kaydet
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      registeredUsers[formData.email] = {
        password: formData.password,
        user: newUser
      };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Kullanıcıya özel veri alanları oluştur
      const userId = newUser.id;
      localStorage.setItem(`clients_${userId}`, JSON.stringify([]));
      localStorage.setItem(`appointments_${userId}`, JSON.stringify([]));
      localStorage.setItem(`clientPackages_${userId}`, JSON.stringify({}));
      localStorage.setItem(`packages_${userId}`, JSON.stringify([]));

      // Abonelik bilgilerini kaydet
      const subscriptionData = {
        plan: formData.selectedPlan,
        planName: plans.find(p => p.id === formData.selectedPlan)?.name || 'Başlangıç',
        planPrice: plans.find(p => p.id === formData.selectedPlan)?.price || 'Ücretsiz',
        startDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün sonra
        isTrialActive: true,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'trial',
        selectedPlanAtRegistration: formData.selectedPlan,
        billingHistory: []
      };
      localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscriptionData));

      // Başarı modalını göster
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setErrorMessage('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Başarı modalı
  const SuccessModal = () => {
    if (!showSuccessModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kayıt Başarılı!</h3>
            <p className="text-gray-600 mb-6">
              Hesabınız başarıyla oluşturuldu. Seçtiğiniz {plans.find(p => p.id === formData.selectedPlan)?.name} paketinde 1 ay ücretsiz deneme süreniz başladı.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              Giriş Yap
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Hata modalı
  const ErrorModal = () => {
    if (!showErrorModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hata</h3>
                <p className="text-gray-600">Kayıt sırasında bir sorun oluştu</p>
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Başarı Modalı */}
      <SuccessModal />
      
      {/* Hata Modalı */}
      <ErrorModal />
      
      <div className="max-w-4xl w-full">
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
          <p className="text-gray-600 mt-2">
            {step === 1 ? 'Hesap oluşturun' : 'Paket seçin ve şifre oluşturun'}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              // Adım 1: Kişisel Bilgiler
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgiler</h2>
                  <p className="text-gray-600">Hesabınızı oluşturmak için bilgilerinizi girin</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Adınız"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Soyadınız"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi *
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Unvan
                    </label>
                    <select
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Diyetisyen">Diyetisyen</option>
                      <option value="Klinik Diyetisyeni">Klinik Diyetisyeni</option>
                      <option value="Beslenme Uzmanı">Beslenme Uzmanı</option>
                      <option value="Prof. Dr.">Prof. Dr.</option>
                      <option value="Doç. Dr.">Doç. Dr.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-2">
                      Kurum/Klinik
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="clinic"
                        name="clinic"
                        value={formData.clinic}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Çalıştığınız kurum"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                >
                  <div className="flex items-center justify-center">
                    Devam Et
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </Button>
              </div>
            ) : (
              // Adım 2: Paket Seçimi ve Şifre
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Paket Seçimi</h2>
                  <p className="text-gray-600">Size uygun paketi seçin ve şifrenizi oluşturun</p>
                </div>

                {/* Paket Seçimi */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        formData.selectedPlan === plan.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedPlan"
                        value={plan.id}
                        checked={formData.selectedPlan === plan.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            En Popüler
                          </span>
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {plan.price}
                          <span className="text-sm font-normal text-gray-600">{plan.period}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                        
                        <div className="text-left space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                          {plan.features.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{plan.features.length - 3} özellik daha
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Şifre Alanları */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre *
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
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre Tekrar *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                    <Link href="/terms" className="text-green-600 hover:text-green-700">
                      Kullanım Şartları
                    </Link>{' '}
                    ve{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-700">
                      Gizlilik Politikası
                    </Link>
                    'nı kabul ediyorum
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Hesap Oluşturuluyor...
                      </div>
                    ) : (
                      'Hesap Oluştur'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Giriş yapın
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
            Kayıt olarak{' '}
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