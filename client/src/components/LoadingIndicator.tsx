interface Props {
  label?: string;
  compact?: boolean;
}

export default function LoadingIndicator({ label = "Loading", compact = false }: Props) {
  return (
    <>
      <span className={`lb-wave${compact ? " lb-wave-compact" : ""}`} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </>
  );
}
