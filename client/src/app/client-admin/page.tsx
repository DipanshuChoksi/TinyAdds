import type { Metadata } from "next";
import StatCard from "@/components/client-admin/StatCard";
import ChartCard from "@/components/client-admin/charts/ChartCard";
import BarChart from "@/components/client-admin/charts/BarChart";
import AreaChart from "@/components/client-admin/charts/AreaChart";
import DonutChart from "@/components/client-admin/charts/DonutChart";
import { CLIENT_STATS, PROFILE_VIEWS_MONTHLY, RATING_SPLIT, REVIEWS_MONTHLY } from "@/data/clientAdmin";

export const metadata: Metadata = { title: "Dashboard – TinyAdds" };

export default function ClientDashboard() {
  return (
    <>
      <h6 className="lb-ca-title">Dashboard</h6>

      <div className="lb-ca-stats">
        {CLIENT_STATS.map((s) => <StatCard key={s.title} {...s} />)}
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
      </div>
    </>
  );
}
