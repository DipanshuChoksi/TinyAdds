type Props = { title: string; value: string; icon: string };

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className="lb-ca-stat">
      <h6>{title}</h6>
      <i className={`bi ${icon}`}></i>
      <strong>{value}</strong>
    </div>
  );
}
