import { DIM_LABELS } from '@/lib/scoring/dimensions';
import { L1, L2, ALL_DIMS } from '@/lib/scoring/engine';
import type { DimensionKey } from '@/lib/scoring/types';

const SJT_THRESHOLDS: Record<DimensionKey, number> = {
  integritas: 50,
  ownership: 50,
  standarPribadi: 45,
  emotionallyControlled: 40,
  caraBerpikir: 50,
  responsFeedback: 50,
  growthMindset: 50,
  conscientious: 50,
  dampakTim: 50,
  resiliensi: 50,
  communicationClarity: 50,
  decisive: 50,
  innovative: 50,
};

type SJTReliability = 'genuine_gap' | 'moderate' | 'ambiguous';

function getReliability(dim: DimensionKey, sjtScore: number): SJTReliability {
  const t = SJT_THRESHOLDS[dim] ?? 50;
  if (sjtScore < t - 5) return 'genuine_gap';
  if (sjtScore < t + 10) return 'moderate';
  return 'ambiguous';
}

export function SJTJudgmentPanel({ sjtScores }: { sjtScores: Record<DimensionKey, number> }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">SJT — Profil Judgment Situasional</p>
        <p className="text-sm text-muted">
          Skor tinggi bisa cermin kemampuan nyata atau jawaban “seharusnya benar”. Skor rendah lebih reliabel sebagai gap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ALL_DIMS.map((dim) => {
          const score = sjtScores[dim] ?? 0;
          const rel = getReliability(dim, score);
          const t = SJT_THRESHOLDS[dim] ?? 50;
          const cfg = RELIABILITY_STYLE[rel];
          return (
            <div key={dim} className="p-2 rounded-lg border border-border bg-white space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">{DIM_LABELS[dim]}</p>
                <span className={`text-[11px] px-2 py-[2px] rounded-full ${cfg.badge}`}>{cfg.label}</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
                <div
                  className="absolute top-[-4px] h-4 w-[2px] bg-red-500/70"
                  style={{ left: `${t}%` }}
                  title={`Threshold ${t}%`}
                />
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>SJT: {score.toFixed(1)}%</span>
                <span>Threshold: {t}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RELIABILITY_STYLE: Record<SJTReliability, { label: string; badge: string }> = {
  genuine_gap: { label: 'Gap Nyata', badge: 'bg-red-100 text-red-800 border border-red-200' },
  moderate: { label: 'Moderat', badge: 'bg-amber-100 text-amber-800 border border-amber-200' },
  ambiguous: { label: 'Ambigu — perlu validasi', badge: 'bg-green-100 text-green-800 border border-green-200' },
};
