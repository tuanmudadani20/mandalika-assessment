import { DIMENSIONS } from '@/lib/scoring/dimensions';
import { DimInterpretation, DimensionKey } from '@/lib/scoring/types';

type Scores = Record<DimensionKey, number | undefined>;
type Interpretations = Record<DimensionKey, DimInterpretation | undefined>;

export function DualSourcePanel({
  fcScores,
  sjtScores,
  interpretations,
  alerts,
  title = 'Data FC & SJT per dimensi',
}: {
  fcScores?: Scores;
  sjtScores?: Scores;
  interpretations?: Interpretations;
  alerts?: Array<{ dimension: DimensionKey; note: string }>;
  title?: string;
}) {
  if (!fcScores || !sjtScores || !interpretations) {
    return null;
  }

  return (
    <div className="card p-4 space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Dual Source</p>
        <h3 className="font-display text-lg text-gold">{title}</h3>
        <p className="text-xs text-muted">
          FC = prioritas relatif (ipsatif), SJT = kemampuan absolut (non-ipsatif)
        </p>
      </div>

      <div className="space-y-3">
        {DIMENSIONS.map((dim) => {
          const fc = clamp(fcScores[dim.key] ?? 0);
          const sjt = clamp(sjtScores[dim.key] ?? 0);
          const interp = interpretations[dim.key] ?? 'moderate';
          const badge = interpLabel(interp);
          const dimAlerts = (alerts ?? []).filter((a) => a.dimension === dim.key);
          return (
            <div key={dim.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-text">{dim.label}</p>
                <span
                  className={`rounded-full px-2 py-[3px] text-[11px] font-semibold ${badge.className}`}
                  style={badge.style}
                >
                  {badge.label}
                </span>
              </div>
              <Bar label="FC" value={fc} color="#3564c6" />
              <Bar label="SJT" value={sjt} color="#1c9e7a" />
              {dimAlerts.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-[2px]">
                  {dimAlerts.map((a, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-cat-c/10 text-cat-c border border-cat-c/20 px-2 py-[2px] text-[10px]"
                    >
                      {a.note}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-[11px] text-muted">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-border relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="w-10 text-[11px] text-text text-right">{Math.round(value)}%</span>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function interpLabel(code: DimInterpretation) {
  switch (code) {
    case 'strong':
      return { label: 'Kuat', className: 'bg-l1/10 text-l1 border border-l1/20', style: undefined };
    case 'sleeping_strength':
      return { label: 'Sleeping strength', className: 'bg-l2/10 text-l2 border border-l2/20', style: undefined };
    case 'gap_probe':
      return { label: 'Gap — probe', className: 'bg-amber-100 text-amber-800 border border-amber-200', style: undefined };
    case 'genuine_gap':
      return { label: 'Gap besar', className: 'bg-cat-c/10 text-cat-c border border-cat-c/20', style: undefined };
    default:
      return { label: 'Moderat', className: 'bg-border text-muted border border-border', style: undefined };
  }
}
