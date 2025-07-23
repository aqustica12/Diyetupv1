'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingSettings() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getSubscriptionText = (subscription: string) => {
    switch (subscription) {
      case 'basic':
        return 'Başlangıç Plan';
      case 'professional':
        return 'Profesyonel Plan';
      case 'enterprise':
        return 'Kurumsal Plan';
      default:
        return 'Plan';
    }
  };

  const getSubscriptionPrice = (subscription: string) => {
    switch (subscription) {
      case 'basic':
        return '₺299';
      case 'professional':
        return '₺499';
      case 'enterprise':
        return '₺999';
      default:
        return '₺0';
    }
  };

  const billingHistory = [
    {
      id: 1,
      date: '15 Ocak 2024',
      amount: getSubscriptionPrice(user?.subscription || 'professional'),
      status: 'paid',
      plan: getSubscriptionText(user?.subscription || 'professional'),
      invoice: 'INV-2024-001'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Current Plan */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Mevcut Abonelik
          </h3>
          <p className="text-gray-600">Abonelik planınız ve fatura bilgileri</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-green-800">
                {user ? getSubscriptionText(user.subscription) : 'Profesyonel Plan'}
              </h4>
              <p className="text-green-600">Aktif abonelik</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">
                {user ? getSubscriptionPrice(user.subscription) : '₺499'}
              </div>
              <div className="text-green-600">/ aylık</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-green-600 mb-1">Sonraki Fatura Tarihi</p>
              <p className="font-medium text-green-800">15 Şubat 2024</p>
            </div>
            <div>
              <p className="text-sm text-green-600 mb-1">Fatura Durumu</p>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="font-medium text-green-800">Güncel</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Planı Yükselt
            </Button>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              Plan Değiştir
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ödeme Yöntemi</h3>
          <p className="text-gray-600">Varsayılan ödeme yönteminizi yönetin</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Son kullanma: 12/26</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Düzenle
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full">
            Yeni Kart Ekle
          </Button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fatura Geçmişi</h3>
          <p className="text-gray-600">Geçmiş ödemelerinizi görüntüleyin</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tutar</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fatura</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{item.date}</td>
                  <td className="py-3 px-4 text-gray-900">{item.plan}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{item.amount}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      Ödendi
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      İndir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}