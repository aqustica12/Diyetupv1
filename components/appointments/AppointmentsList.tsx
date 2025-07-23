'use client';

import { motion } from 'framer-motion';
import { Clock, User, Video, Phone, MoreHorizontal, CheckCircle, XCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointmentsListProps {
  appointments: any[];
  onEdit: (appointment: any) => void;
}

export default function AppointmentsList({ appointments, onEdit }: AppointmentsListProps) {

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return Video;
      case 'phone':
        return Phone;
      default:
        return User;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Bekliyor';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'online':
        return 'Online';
      case 'phone':
        return 'Telefon';
      case 'in-person':
        return 'Yüz Yüze';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Randevu Listesi ({appointments.length})
        </h3>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {appointments.map((appointment, index) => {
          const TypeIcon = getTypeIcon(appointment.type);
          
          return (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                  <img
                    src={appointment.clientAvatar}
                    alt={appointment.clientName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {appointment.clientName}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <TypeIcon className="w-4 h-4" />
                        <span>{getTypeText(appointment.type)}</span>
                      </div>
                      
                      <span>({appointment.duration} dk)</span>
                    </div>
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(appointment)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Düzenle
                  </Button>
                  
                  {appointment.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Onayla
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-1" />
                        İptal Et
                      </Button>
                    </>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={() => onEdit(appointment)}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {appointments.length} randevunun tümü gösteriliyor
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Önceki
            </Button>
            <Button variant="outline" size="sm" disabled>
              Sonraki
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}