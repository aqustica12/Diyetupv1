'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsList from '@/components/clients/ClientsList';
import ClientsStats from '@/components/clients/ClientsStats';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ClientsHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <ClientsStats />
        <ClientsList 
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          sortBy={sortBy}
        />
      </div>
    </DashboardLayout>
  );
}