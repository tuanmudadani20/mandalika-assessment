interface Props {
  value: number;
  total: number;
  label?: string;
}

export function ProgressBar({ value, total, label }: Props) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label ?? 'Progress'}</span>
        <span className="text-gold font-semibold">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
