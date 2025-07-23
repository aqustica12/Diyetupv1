'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
import CurrentPlan from '@/components/subscription/CurrentPlan';
import PlanComparison from '@/components/subscription/PlanComparison';
import BillingHistory from '@/components/subscription/BillingHistory';

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SubscriptionHeader />
        <CurrentPlan />
        <PlanComparison />
        <BillingHistory />
      </div>
    </DashboardLayout>
  );
}