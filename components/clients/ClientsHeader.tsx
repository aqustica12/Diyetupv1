'use client';

import { Search, Plus, Filter, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function ClientsHeader({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}: ClientsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-green-600" />
            Danışanlar
          </h1>
          <p className="text-gray-600 mt-2">
            Tüm danışanlarınızı yönetin ve ilerlemelerini takip edin.
          </p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => window.location.href = '/dashboard/clients/new'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Danışan
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
              placeholder="Danışan ara..."
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
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="completed">Tamamlanmış</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="name">İsme Göre</option>
            <option value="date">Tarihe Göre</option>
            <option value="progress">İlerlemeye Göre</option>
            <option value="lastVisit">Son Ziyarete Göre</option>
          </select>

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