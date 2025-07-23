'use client';

import { Calendar, List, Plus, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointmentsHeaderProps {
  viewMode: 'calendar' | 'week' | 'list';
  setViewMode: (mode: 'calendar' | 'week' | 'list') => void;
  onNewAppointment: () => void;
}

export default function AppointmentsHeader({ viewMode, setViewMode, onNewAppointment }: AppointmentsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-green-600" />
            Randevular
          </h1>
          <p className="text-gray-600 mt-2">
            Randevularınızı yönetin ve takip edin.
          </p>
        </div>
        <Button 
          onClick={onNewAppointment}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Randevu
        </Button>
      </div>

      {/* View Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Aylık
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Haftalık
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              Liste
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}