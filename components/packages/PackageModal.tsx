'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (packageData: any) => void;
  editingPackage?: any;
}

export default function PackageModal({ isOpen, onClose, onSave, editingPackage }: PackageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sessions: '',
    duration: '',
    features: ['']
  });

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        name: editingPackage.name,
        price: editingPackage.price.toString(),
        sessions: editingPackage.sessions.toString(),
        duration: editingPackage.duration.toString(),
        features: editingPackage.features
      });
    } else {
      setFormData({
        name: '',
        price: '',
        sessions: '',
        duration: '',
        features: ['']
      });
    }
  }, [editingPackage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      name: formData.name,
      price: parseInt(formData.price),
      sessions: parseInt(formData.sessions),
      duration: parseInt(formData.duration),
      features: formData.features.filter(f => f.trim() !== '')
    };

    onSave(packageData);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

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
          <h2 className="text-xl font-bold text-gray-900">
            {editingPackage ? 'Paket Düzenle' : 'Yeni Paket'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paket Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="12 Seanslık Premium Paket"
              required
            />
          </div>

          {/* Price, Sessions, Duration */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="2800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seans Sayısı *
              </label>
              <input
                type="number"
                value={formData.sessions}
                onChange={(e) => setFormData(prev => ({ ...prev, sessions: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="12"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Süre (Gün) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="90"
                required
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Paket Özellikleri
              </label>
              <Button
                type="button"
                onClick={addFeature}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Özellik Ekle
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Kapsamlı sağlık değerlendirmesi"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeFeature(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              defaultChecked={true}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Paketi aktif yap
            </label>
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
              {editingPackage ? 'Güncelle' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}