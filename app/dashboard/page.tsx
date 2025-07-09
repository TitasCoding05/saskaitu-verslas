import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FinancialChart from '@/components/financial-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Year Navigation Header */}
          <FinancialChart />
    </div>
  );
}
