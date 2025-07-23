'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DietPlansHeader from '@/components/diet-plans/DietPlansHeader';
import DietPlansList from '@/components/diet-plans/DietPlansList';
import DietPlansStats from '@/components/diet-plans/DietPlansStats';

export default function DietPlansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DietPlansHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <DietPlansStats />
        <DietPlansList 
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          sortBy={sortBy}
        />
      </div>
    </DashboardLayout>
  );
}