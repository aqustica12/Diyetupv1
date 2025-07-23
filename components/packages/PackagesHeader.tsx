'use client';

import { Package, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PackagesHeaderProps {
  onAddPackage: () => void;
  totalPackages: number;
}

export default function PackagesHeader({ onAddPackage, totalPackages }: PackagesHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-green-600" />
            Paket Yönetimi
          </h1>
          <p className="text-gray-600 mt-2">
            Danışanlarınız için özel paketler oluşturun ve yönetin.
          </p>
        </div>
        <Button 
          onClick={onAddPackage}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Paket
        </Button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalPackages}</div>
            <div className="text-sm text-gray-600">Toplam Paket</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2.000 ₺</div>
            <div className="text-sm text-gray-600">Ortalama Fiyat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Ortalama Seans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">60 dk</div>
            <div className="text-sm text-gray-600">Ortalama Süre</div>
          </div>
        </div>
      </div>
    </div>
  );
}