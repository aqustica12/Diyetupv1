'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Clock, Package, DollarSign, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
  onDelete: (appointmentId: string) => void;
  appointment: any;
}

export default function EditAppointmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  appointment 
}: EditAppointmentModalProps) {
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
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const clientsWithPackages = savedClients.map(client => ({
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
    }));
    setRegisteredClients(clientsWithPackages);
    
    // Danışan paket bilgilerini yükle
    const savedPackages = JSON.parse(localStorage.getItem('clientPackages') || '{}');
    setClientPackages(savedPackages);
  }, []);

  useEffect(() => {
    if (appointment && isOpen) {
      // Mevcut randevu bilgilerini forma yükle
      setFormData({
        clientType: appointment.clientId ? 'existing' : 'new',
        clientId: appointment.clientId || '',
        clientName: appointment.clientName || '',
        clientEmail: appointment.clientEmail || '',
        clientPhone: appointment.clientPhone || '',
        date: appointment.date || '',
        time: appointment.time || '',
        type: appointment.type || 'in-person',
        status: appointment.status || 'confirmed',
        packageId: appointment.packageId || '',
        customPrice: appointment.price?.toString() || '',
        notes: appointment.notes || ''
      });
    }
  }, [appointment, isOpen]);

  const packages = [
    { id: 'pkg-1', name: '12 Seanslık Premium Paket', price: 2800, sessions: 12 },
    { id: 'pkg-2', name: '8 Seanslık Standart Paket', price: 2000, sessions: 8 },
    { id: 'pkg-3', name: '4 Seanslık Tanışma Paketi', price: 1200, sessions: 4 }
  ];

  // Saat seçenekleri (8:00-20:00, 30 dakikalık aralıklar)
  const timeOptions = [];
  for (let hour = 8; hour <= 19; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  timeOptions.push('20:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentDate = formData.date;
    
    let appointmentData = { 
      ...appointment, // Mevcut randevu verilerini koru
      ...formData,
      date: appointmentDate,
      clientName: formData.clientType === 'existing' 
        ? registeredClients.find(c => c.id === formData.clientId)?.name || formData.clientName
        : formData.clientName
    };
    
    // Paket bilgilerini güncelle
    if (formData.packageId) {
      const selectedPackage = packages.find(p => p.id === formData.packageId);
      
      // Eğer yeni bir paket seçildiyse ve ilk seans ise ücret ekle
      if (formData.packageId !== appointment.packageId) {
        appointmentData.price = selectedPackage?.price || 0;
      } else {
        appointmentData.price = 0; // Mevcut paket devam ediyorsa ücret 0
      }
      
      appointmentData.packageName = selectedPackage?.name;
    } else {
      appointmentData.price = parseInt(formData.customPrice) || 0;
    }

    onSave(appointmentData);
  };

  const handleDelete = () => {
    if (confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      onDelete(appointment.id);
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Randevu Düzenle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Danışan</h3>
            
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
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tarih ve Saat</h3>
            
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
          </div>

          {/* Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Randevu Türü</h3>
            
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

          {/* Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Randevu Durumu</h3>
            
            <div className="grid grid-cols-4 gap-4">
              {[
                { value: 'confirmed', label: 'Onaylandı', color: 'green' },
                { value: 'pending', label: 'Bekliyor', color: 'yellow' },
                { value: 'completed', label: 'Tamamlandı', color: 'blue' },
                { value: 'cancelled', label: 'İptal', color: 'red' }
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

          {/* Package/Price */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Paket/Fiyat</h3>
            
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
                  />
                </div>
              )}
            </div>
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
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Randevuyu Sil
            </Button>
            
            <div className="flex space-x-3">
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
                <Save className="w-4 h-4 mr-2" />
                Değişiklikleri Kaydet
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}