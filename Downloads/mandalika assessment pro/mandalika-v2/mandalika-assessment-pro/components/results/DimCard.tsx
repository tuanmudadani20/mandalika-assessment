import type { DimResult } from '@/lib/scoring/types';
import { DIM_LABELS } from '@/lib/scoring/dimensions';

const INTERP_CONFIG: Record<string, { label: string; color: string; border: string }> = {
  kuat: { label: 'Kuat', color: 'bg-green-100 text-green-800', border: 'border-green-300' },
  sleeping_strength: { label: 'Potensi Terpendam', color: 'bg-blue-100 text-blue-800', border: 'border-blue-300' },
  gap_probe: { label: 'Perlu Probe', color: 'bg-amber-100 text-amber-800', border: 'border-amber-300' },
  genuine_gap: { label: 'Gap Nyata', color: 'bg-red-100 text-red-800', border: 'border-red-300' },
  moderate: { label: 'Moderat', color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
};

export function DimCard({ dimResult }: { dimResult: DimResult }) {
  const cfg = INTERP_CONFIG[dimResult.interpretation] ?? INTERP_CONFIG.moderate;
  const label = DIM_LABELS[dimResult.dim] ?? dimResult.dim;
  return (
    <div className={`p-3 rounded-lg border ${cfg.border} bg-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
      </div>

      <Bar label="FC" color="bg-blue-500" value={dimResult.fcScore} />
      <Bar label="SJT" color="bg-emerald-500" value={dimResult.sjtScore} />
    </div>
  );
}

function Bar({ label, color, value }: { label: string; color: string; value: number }) {
  return (
    <div className="flex items-center gap-2 mb-1 last:mb-0">
      <span className="text-xs w-10 text-gray-600 font-medium">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="text-xs w-10 text-right text-gray-700">{Math.round(value)}%</span>
    </div>
  );
}
