'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PackagesHeader from '@/components/packages/PackagesHeader';
import PackagesList from '@/components/packages/PackagesList';
import PackageModal from '@/components/packages/PackageModal';

export default function PackagesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: '12 Seanslık Premium Paket',
      price: 2800,
      sessions: 12,
      duration: 90,
      isActive: true,
      features: [
        'Kapsamlı sağlık değerlendirmesi',
        'Detaylı beslenme ve yaşam tarzı planı',
        'Haftalık takip seansları'
      ]
    },
    {
      id: 2,
      name: '8 Seanslık Standart Paket',
      price: 2000,
      sessions: 8,
      duration: 60,
      isActive: true,
      features: [
        'Detaylı vücut analizi',
        'Kişiselleştirilmiş beslenme planı',
        'Haftalık kontrol seansları'
      ]
    },
    {
      id: 3,
      name: '4 Seanslık Tanışma Paketi',
      price: 1200,
      sessions: 4,
      duration: 30,
      isActive: true,
      features: [
        'İlk görüşme',
        'Beslenme planı',
        'Takip'
      ]
    }
  ]);

  const handleAddPackage = (packageData) => {
    const newPackage = {
      id: Date.now(),
      ...packageData,
      isActive: true
    };
    setPackages(prev => [...prev, newPackage]);
    setShowModal(false);
  };

  const handleEditPackage = (packageData) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === editingPackage.id ? { ...pkg, ...packageData } : pkg
    ));
    setEditingPackage(null);
    setShowModal(false);
  };

  const handleDeletePackage = (id) => {
    if (confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PackagesHeader 
          onAddPackage={() => setShowModal(true)}
          totalPackages={packages.length}
        />
        
        <PackagesList 
          packages={packages}
          onEdit={openEditModal}
          onDelete={handleDeletePackage}
          onToggleStatus={handleToggleStatus}
        />

        {showModal && (
          <PackageModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingPackage(null);
            }}
            onSave={editingPackage ? handleEditPackage : handleAddPackage}
            editingPackage={editingPackage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}