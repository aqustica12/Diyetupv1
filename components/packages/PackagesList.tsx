'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Package {
  id: number;
  name: string;
  price: number;
  sessions: number;
  duration: number;
  isActive: boolean;
  features: string[];
}

interface PackagesListProps {
  packages: Package[];
  onEdit: (pkg: Package) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export default function PackagesList({ packages, onEdit, onDelete, onToggleStatus }: PackagesListProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`bg-white rounded-lg p-6 shadow-sm border-2 transition-all duration-200 ${
            pkg.isActive 
              ? 'border-green-200 hover:border-green-300' 
              : 'border-gray-200 opacity-60'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {pkg.isActive ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                pkg.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {pkg.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(pkg)}
                className="p-2"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(pkg.id)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Package Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
            <div className="text-3xl font-bold text-green-600 mb-4">
              {pkg.price.toLocaleString()} ₺
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{pkg.sessions} Seans</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{pkg.duration} Gün</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Özellikler</h4>
            <div className="space-y-2">
              {pkg.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
              <div className="text-xs text-gray-500 mt-2">
                +{Math.floor(Math.random() * 5) + 1} özellik daha
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => onToggleStatus(pkg.id)}
              className={`w-full ${
                pkg.isActive 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {pkg.isActive ? 'Pasif Yap' : 'Aktif Yap'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onEdit(pkg)}
              className="w-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}