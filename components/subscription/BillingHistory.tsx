'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingHistory() {
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillingHistory();
  }, []);

  const loadBillingHistory = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        setBillingHistory([]);
        setLoading(false);
        return;
      }

      const subscriptionData = localStorage.getItem(`subscription_${user.id}`);
      if (subscriptionData) {
        const subscription = JSON.parse(subscriptionData);
        setBillingHistory(subscription.billingHistory || []);
      } else {
        setBillingHistory([]);
      }
    } catch (error) {
      console.error('Fatura geçmişi yüklenirken hata:', error);
      setBillingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (invoice: any) => {
    // Mock PDF indirme
    const invoiceData = {
      invoiceNumber: invoice.invoice,
      date: invoice.date,
      amount: invoice.amount,
      plan: invoice.plan,
      customerName: JSON.parse(localStorage.getItem('user') || '{}').firstName + ' ' + JSON.parse(localStorage.getItem('user') || '{}').lastName,
      customerEmail: JSON.parse(localStorage.getItem('user') || '{}').email
    };

    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoice}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fatura Geçmişi</h3>
        <p className="text-gray-600">Geçmiş ödemelerinizi ve faturalarınızı görüntüleyin</p>
      </div>

      {billingHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz fatura yok</h3>
          <p className="text-gray-500 mb-6">
            İlk ödemenizden sonra fatura geçmişiniz burada görünecek
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Ücretsiz Deneme Aktif</span>
            </div>
            <p className="text-blue-700 text-sm">
              Şu anda ücretsiz deneme sürenizi kullanıyorsunuz. 
              Deneme süresi bittiğinde ilk faturanız oluşturulacak.
            </p>
          </div>
        </div>
      ) : (
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
              {billingHistory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {new Date(item.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{item.plan}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{item.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Ödendi
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadInvoice(item)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      İndir
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {billingHistory.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Toplam {billingHistory.length} fatura gösteriliyor
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Önceki
            </Button>
            <Button variant="outline" size="sm" disabled>
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}