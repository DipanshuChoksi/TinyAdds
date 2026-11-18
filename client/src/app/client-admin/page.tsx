'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import StatCard from '@/components/client-admin/StatCard';
import ChartCard from '@/components/client-admin/charts/ChartCard';
import BarChart from '@/components/client-admin/charts/BarChart';
import AreaChart from '@/components/client-admin/charts/AreaChart';
import DonutChart from '@/components/client-admin/charts/DonutChart';
import { PROFILE_VIEWS_MONTHLY, RATING_SPLIT, REVIEWS_MONTHLY } from '@/data/clientAdmin';
import { getUserAnalytics } from '@/lib/api';
import type { UserAnalyticsResponse } from '@/src/lib/analyticsApi';

// export const metadata: Metadata = { title: 'Dashboard – TinyAdds' };

export default function ClientDashboard() {
  const [analytics, setAnalytics] = useState<UserAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getUserAnalytics()
      .then((data) => {
        if (!active) return;
        setAnalytics(data);
      })
      .catch(() => {
        if (!active) return;
        setAnalytics({ totalPosts: 0, pendingPosts: 0, approvedPosts: 0, rejectedPosts: 0 });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { title: 'Total Posts', value: loading ? '...' : String(analytics?.totalPosts ?? 0), icon: 'bi-card-list' },
    { title: 'Pending Posts', value: loading ? '...' : String(analytics?.pendingPosts ?? 0), icon: 'bi-hourglass-split' },
    { title: 'Approved Posts', value: loading ? '...' : String(analytics?.approvedPosts ?? 0), icon: 'bi-check-circle' },
  ];

  return (
    <>
      <h6 className="lb-ca-title">Dashboard</h6>

      {/* <div className="lb-ca-stats">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="lb-ca-charts">
        <ChartCard title="Total Profile view" subtitle="Last 6 months" className="span-2">
          <BarChart data={PROFILE_VIEWS_MONTHLY} />
        </ChartCard>
        <ChartCard title="Rating" subtitle="Rating split">
          <DonutChart data={RATING_SPLIT} />
        </ChartCard>
        <ChartCard title="Total Review" subtitle="Reviews per month" className="span-3">
          <AreaChart data={REVIEWS_MONTHLY} />
        </ChartCard>
      </div> */}
    </>
  );
}
