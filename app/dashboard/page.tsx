'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AppointmentCalendar from '@/components/dashboard/AppointmentCalendar';
import ProgressChart from '@/components/dashboard/ProgressChart';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import SubscriptionWarning from '@/components/dashboard/SubscriptionWarning';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Subscription Warning */}
        <SubscriptionWarning />

        {/* Header */}
        <WelcomeHeader />

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProgressChart />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AppointmentCalendar />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}