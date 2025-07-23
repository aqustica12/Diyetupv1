'use client';

import { useState } from 'react';
import { Search, Plus, Filter, Download, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateDietPlanModal from './CreateDietPlanModal';

interface DietPlansHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function DietPlansHeader({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}: DietPlansHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePlan = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-green-600" />
            Diyet Planları
          </h1>
          <p className="text-gray-600 mt-2">
            Danışanlarınız için diyet planları oluşturun ve yönetin.
          </p>
        </div>
        <Button 
          onClick={handleCreatePlan}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Plan
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Plan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="draft">Taslak</option>
            <option value="active">Aktif</option>
            <option value="completed">Tamamlanmış</option>
            <option value="archived">Arşivlenmiş</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="name">İsme Göre</option>
            <option value="clients">Danışan Sayısı</option>
          </select>

          {/* Export Button */}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
        </div>
      </div>
    </div>

    <CreateDietPlanModal 
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
    />
  </>
  );
}