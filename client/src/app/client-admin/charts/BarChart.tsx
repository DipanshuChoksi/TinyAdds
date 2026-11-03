import type { ChartPoint } from "@/data/clientAdmin";
import { formatNumber, niceMax } from "./chartUtils";

const W = 600, H = 260, PAD = { l: 46, r: 12, t: 14, b: 32 };

export default function BarChart({ data }: { data: ChartPoint[] }) {
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const slot = iw / data.length;
  const bw = slot * 0.5;
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="lb-ca-svg" role="img" aria-label="Bar chart">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="lb-ca-grid" />
          <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" className="lb-ca-axis">{formatNumber(t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = PAD.l + slot * i + (slot - bw) / 2;
        return (
          <g key={d.label} className="lb-ca-bar">
            <rect x={x} y={y(d.value)} width={bw} height={y(0) - y(d.value)} rx={6}>
              <title>{`${d.label}: ${d.value.toLocaleString()}`}</title>
            </rect>
            <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="lb-ca-axis">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
