'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Clock, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
  prefilledData?: { date?: Date; time?: string };
}

export default function NewAppointmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  prefilledData 
}: NewAppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientType: 'existing',
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    date: '',
    time: '',
    type: 'in-person',
    status: 'confirmed',
    packageId: '',
    customPrice: '',
    notes: ''
  });

  const [registeredClients, setRegisteredClients] = useState([]);
  const [clientPackages, setClientPackages] = useState({});

  useEffect(() => {
    // localStorage'dan kayıtlı danışanları al
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    const savedClients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
    const clientsWithPackages = savedClients.map(client => ({
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
    }));
    setRegisteredClients(clientsWithPackages);
    
    // Danışan paket bilgilerini yükle
    const savedPackages = JSON.parse(localStorage.getItem(`clientPackages_${currentUserId}`) || '{}');
    setClientPackages(savedPackages);
  }, []);

  // Danışan değiştiğinde paket bilgisini kontrol et
  useEffect(() => {
    if (formData.clientId) {
      const clientPackage = clientPackages[formData.clientId];
      
      // Eğer danışanın aktif paketi varsa otomatik seç
      if (clientPackage && clientPackage.remainingSessions > 0) {
        setFormData(prev => ({
          ...prev,
          packageId: clientPackage.packageId
        }));
      } else {
        // Paket yoksa veya bittiyse temizle
        setFormData(prev => ({
          ...prev,
          packageId: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        packageId: ''
      }));
    }
  }, [formData.clientId, clientPackages]);

  const packages = [
    { id: 'pkg-1', name: '12 Seanslık Premium Paket', price: 2800, sessions: 12 },
    { id: 'pkg-2', name: '8 Seanslık Standart Paket', price: 2000, sessions: 8 },
    { id: 'pkg-3', name: '4 Seanslık Tanışma Paketi', price: 1200, sessions: 4 }
  ];

  useEffect(() => {
    if (prefilledData?.date) {
      setFormData(prev => ({
        ...prev,
        date: prefilledData.date.toISOString().split('T')[0]
      }));
    }
    if (prefilledData?.time) {
      setFormData(prev => ({
        ...prev,
        time: prefilledData.time
      }));
    }
  }, [prefilledData]);

  const selectedClient = registeredClients.find(c => c.id === formData.clientId);
  const selectedClientPackage = clientPackages[formData.clientId];
  const selectedPackage = packages.find(p => p.id === formData.packageId);
  
  // Saat seçenekleri (8:00-20:00, 30 dakikalık aralıklar)
  const timeOptions = [];
  for (let hour = 8; hour <= 19; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  timeOptions.push('20:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tarih formatını düzelt
    const appointmentDate = new Date(formData.date + 'T00:00:00');
    const formattedDate = appointmentDate.getFullYear() + '-' + 
                         String(appointmentDate.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(appointmentDate.getDate()).padStart(2, '0');
    
    let appointmentData = { 
      ...formData,
      date: formattedDate,
      clientName: formData.clientType === 'existing' 
        ? selectedClient?.name || formData.clientName
        : formData.clientName
    };
    
    // Paket bilgilerini güncelle
    if (selectedClientPackage && selectedClientPackage.remainingSessions > 0 && formData.packageId === selectedClientPackage.packageId) {
      // Mevcut paket devam ediyor
      appointmentData.sessionNumber = selectedClientPackage.usedSessions + 1;
      appointmentData.totalSessions = selectedClientPackage.totalSessions;
      appointmentData.price = 0;
      
      // Paket bilgilerini güncelle
      const updatedPackages = { ...clientPackages };
      updatedPackages[formData.clientId] = {
        ...selectedClientPackage,
        usedSessions: selectedClientPackage.usedSessions + 1,
        remainingSessions: selectedClientPackage.remainingSessions - 1
      };
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        localStorage.setItem(`clientPackages_${currentUserId}`, JSON.stringify(updatedPackages));
      }
      setClientPackages(updatedPackages);
    } else if (formData.packageId) {
      // Yeni paket başlatılıyor
      const newPackage = packages.find(p => p.id === formData.packageId);
      
      // İlk seansta paket ücretini ekle
      appointmentData.sessionNumber = 1;
      appointmentData.totalSessions = newPackage?.sessions;
      appointmentData.price = newPackage?.price || 0;
      
      // Yeni paket bilgisini kaydet
      const updatedPackages = { ...clientPackages };
      updatedPackages[formData.clientId] = {
        packageId: formData.packageId,
        packageName: newPackage?.name,
        packagePrice: newPackage?.price,
        totalSessions: newPackage?.sessions,
        usedSessions: 1,
        remainingSessions: (newPackage?.sessions || 1) - 1,
        startDate: formData.date
      };
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        localStorage.setItem(`clientPackages_${currentUserId}`, JSON.stringify(updatedPackages));
      }
      setClientPackages(updatedPackages);
    } else {
      // Paketsiz randevu
      appointmentData.price = parseInt(formData.customPrice);
    }

    onSave(appointmentData);
  };

  const getPackageStatus = () => {
    if (!selectedClient) return null;
    
    const clientPackage = selectedClientPackage;
    
    if (!clientPackage) {
      return {
        type: 'none',
        message: 'Bu danışanın aktif paketi yok'
      };
    }
    
    if (clientPackage.remainingSessions > 1) {
      return {
        type: 'active',
        message: `${clientPackage.packageName} - ${clientPackage.usedSessions + 1}/${clientPackage.totalSessions}. seans olacak`
      };
    } else if (clientPackage.remainingSessions === 1) {
      return {
        type: 'last',
        message: `${clientPackage.packageName} - ${clientPackage.usedSessions + 1}/${clientPackage.totalSessions}. seans (SON SEANS!)`
      };
    } else {
      return {
        type: 'finished',
        message: `${clientPackage.packageName} paketi tamamlandı! Yeni paket seçin.`
      };
    }
  };

  const packageStatus = getPackageStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Yeni Randevu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Client Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">1. Danışan Seçimi</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="existing"
                    checked={formData.clientType === 'existing'}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
                    className="mr-2"
                  />
                  Kayıtlı Danışan
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="new"
                    checked={formData.clientType === 'new'}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
                    className="mr-2"
                  />
                  Yeni Danışan
                </label>
              </div>

              {formData.clientType === 'existing' ? (
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Danışan seçin</option>
                  {registeredClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required={formData.clientType === 'new'}
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {/* Package Status */}
              {packageStatus && packageStatus.type !== 'none' && (
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  packageStatus.type === 'finished'
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : packageStatus.type === 'last'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  <Package className="w-5 h-5" />
                  <span className="text-sm">{packageStatus.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Date & Time */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">2. Tarih ve Saat</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saat</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Saat seçin</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Not:</strong> Tüm seanslar 30 dakika sürmektedir.
              </p>
            </div>
          </div>

          {/* Step 3: Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">3. Randevu Türü</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'in-person', label: 'Yüz Yüze', icon: User },
                { value: 'online', label: 'Online', icon: Calendar },
                { value: 'phone', label: 'Telefon', icon: Clock }
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.type === value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={formData.type === value}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="sr-only"
                  />
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 4: Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">4. Randevu Durumu</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'confirmed', label: 'Onaylandı', color: 'green' },
                { value: 'pending', label: 'Bekliyor', color: 'yellow' },
                { value: 'completed', label: 'Tamamlandı', color: 'blue' }
              ].map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.status === value
                      ? `border-${color}-500 bg-${color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={formData.status === value}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 5: Package/Price */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">5. Paket/Fiyat</h3>
            
            {selectedClientPackage && selectedClientPackage.remainingSessions > 0 && formData.packageId === selectedClientPackage.packageId ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Mevcut Paket Devam Ediyor</span>
                </div>
                <p className="text-green-700">
                  {selectedClientPackage.packageName} - {selectedClientPackage.usedSessions + 1}/{selectedClientPackage.totalSessions}. seans
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paket Seçimi</label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => setFormData(prev => ({ ...prev, packageId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Paketsiz randevu</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ₺{pkg.price} ({pkg.sessions} seans)
                      </option>
                    ))}
                  </select>
                </div>

                {!formData.packageId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Randevu Ücreti (₺)</label>
                    <input
                      type="number"
                      value={formData.customPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, customPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="300"
                      required={!formData.packageId}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Randevu ile ilgili notlar..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Randevu Oluştur
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}