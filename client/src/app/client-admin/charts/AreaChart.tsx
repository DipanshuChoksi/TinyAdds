import type { ChartPoint } from "@/data/clientAdmin";
import { formatNumber, niceMax } from "./chartUtils";

const W = 900, H = 260, PAD = { l: 46, r: 20, t: 14, b: 32 };

export default function AreaChart({ data }: { data: ChartPoint[] }) {
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (data.length === 1 ? iw / 2 : (iw / (data.length - 1)) * i);
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="lb-ca-svg" role="img" aria-label="Line chart">
      <defs>
        <linearGradient id="lbCaArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--lb-primary)", stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: "var(--lb-primary)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="lb-ca-grid" />
          <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" className="lb-ca-axis">{formatNumber(t)}</text>
        </g>
      ))}
      <path d={area} fill="url(#lbCaArea)" />
      <path d={line} className="lb-ca-line" />
      {data.map((d, i) => (
        <g key={d.label} className="lb-ca-dot">
          <circle cx={x(i)} cy={y(d.value)} r={5}><title>{`${d.label}: ${d.value.toLocaleString()}`}</title></circle>
          <text x={x(i)} y={H - 10} textAnchor="middle" className="lb-ca-axis">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}
