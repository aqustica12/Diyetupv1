'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportsOverview from '@/components/reports/ReportsOverview';
import ReportsCharts from '@/components/reports/ReportsCharts';
import ReportsExport from '@/components/reports/ReportsExport';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('overview');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ReportsHeader 
          dateRange={dateRange}
          setDateRange={setDateRange}
          reportType={reportType}
          setReportType={setReportType}
        />
        <ReportsOverview />
        <ReportsCharts />
        <ReportsExport />
      </div>
    </DashboardLayout>
  );
}