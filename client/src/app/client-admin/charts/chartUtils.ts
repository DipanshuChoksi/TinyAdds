/** Round a max value up to a "nice" axis number (e.g. 25600 -> 30000). */
export function niceMax(value: number): number {
  if (value <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 4 ? 4 : n <= 5 ? 5 : 10;
  return nice * pow;
}

export const formatNumber = (v: number) => (v >= 1000 ? `${+(v / 1000).toFixed(1)}K` : String(v));
