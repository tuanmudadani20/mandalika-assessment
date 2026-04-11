import { DIM_LABELS } from '@/lib/scoring/dimensions';
import { ALL_DIMS, L1, L2 } from '@/lib/scoring/engine';
import type { DimensionKey } from '@/lib/scoring/types';

type FCMap = Record<DimensionKey, number>;

export function FCPriorityPanel({ fcScores }: { fcScores: FCMap }) {
  const ranked = [...ALL_DIMS].map((dim) => ({ dim, score: fcScores[dim] ?? 0 }));
  ranked.sort((a, b) => b.score - a.score);

const top = ranked.slice(0, 5);
const mid = ranked.slice(5, ranked.length - 3);
const bottom = ranked.slice(-3);

  const notes: { text: string; tone: 'info' | 'warn' }[] = [];
  if (top.slice(0, 3).every((d) => L1.includes(d.dim))) {
    notes.push({ text: 'Top 3 semuanya L1 — orientasi karakter kuat.', tone: 'info' });
  }
  if ([...bottom, ...mid.slice(-2)].some((d) => L1.includes(d.dim))) {
    notes.push({ text: 'Perhatikan: ada dimensi fondasi (L1) di prioritas rendah.', tone: 'warn' });
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">FC — Prioritas Profil</p>
        <p className="text-sm text-muted">
          Ipsatif (pilihan bersaing). Menunjukkan apa yang secara natural diutamakan.
        </p>
      </div>

      <Section title="Prioritas tertinggi" items={top} />
      <Section title="Prioritas moderat" items={mid} />
      <Section title="Diprioritaskan rendah" items={bottom} />

      {notes.length > 0 && (
        <div className="space-y-1 pt-1">
          {notes.map((n, i) => (
            <p
              key={i}
              className={`text-xs rounded-lg px-2 py-1 ${
                n.tone === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'
              }`}
            >
              {n.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: { dim: DimensionKey; score: number }[] }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{title}</p>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <Row key={item.dim} rank={idx + 1} dim={item.dim} score={item.score} />
        ))}
      </div>
    </div>
  );
}

function Row({ rank, dim, score }: { rank: number; dim: DimensionKey; score: number }) {
  const layer = L1.includes(dim) ? 'L1' : L2.includes(dim) ? 'L2' : 'L3/L4';
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1 bg-white">
      <span className="w-6 text-xs font-semibold text-muted text-center">{rank}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-text">{DIM_LABELS[dim]}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
            />
          </div>
          <span className="text-xs text-muted">{score.toFixed(1)}%</span>
        </div>
      </div>
      <span className="text-[10px] px-2 py-[2px] rounded-full bg-border text-muted">{layer}</span>
    </div>
  );
}
