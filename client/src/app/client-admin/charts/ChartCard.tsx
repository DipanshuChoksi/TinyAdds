import type { ReactNode } from "react";

export default function ChartCard({ title, subtitle, className = "", children }: { title: string; subtitle?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`lb-ca-chart ${className}`}>
      <div className="lb-ca-chart-head">
        <h6>{title}</h6>
        {subtitle && <small>{subtitle}</small>}
      </div>
      {children}
    </div>
  );
}
