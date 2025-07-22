'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ödeme Başarısız ❌
        </h1>
        
        <p className="text-gray-600 mb-6">
          Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/dashboard/subscription')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Tekrar Dene
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Dashboard'a Dön
          </Button>
        </div>
      </div>
    </div>
  );
} 