const R = 70;
const C = 2 * Math.PI * R;
const SHADES = ["#d4572b", "#e8845f", "#f2a98a", "#f7c9b3", "#fbe2d6"];

export default function DonutChart({ data }: { data: { stars: number; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const average = data.reduce((sum, d) => sum + d.stars * d.count, 0) / total;
  let offset = 0;

  return (
    <div className="lb-ca-donut">
      <svg viewBox="0 0 200 200" className="lb-ca-donut-svg" role="img" aria-label="Rating split">
        <circle cx="100" cy="100" r={R} className="lb-ca-donut-bg" />
        {data.map((d, i) => {
          const len = (d.count / total) * C;
          const seg = (
            <circle key={d.stars} cx="100" cy="100" r={R} fill="none" stroke={SHADES[i % SHADES.length]} strokeWidth="26"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 100 100)">
              <title>{`${d.stars} star: ${d.count}`}</title>
            </circle>
          );
          offset += len;
          return seg;
        })}
        <text x="100" y="98" textAnchor="middle" className="lb-ca-donut-num">{average.toFixed(1)}</text>
        <text x="100" y="120" textAnchor="middle" className="lb-ca-axis">out of 5</text>
      </svg>
      <ul className="lb-ca-legend">
        {data.map((d, i) => (
          <li key={d.stars}><span style={{ background: SHADES[i % SHADES.length] }}></span>{d.stars} <i className="bi bi-star-fill"></i><b>{d.count}</b></li>
        ))}
      </ul>
    </div>
  );
}
