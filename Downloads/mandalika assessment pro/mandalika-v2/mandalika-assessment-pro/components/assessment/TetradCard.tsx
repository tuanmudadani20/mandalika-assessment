import { Tetrad } from '@/lib/questions/tetrads';
import { dimensionMap } from '@/lib/scoring/dimensions';
import { TetradAnswer } from '@/lib/scoring/types';

interface Props {
  tetrad: Tetrad;
  index: number;
  total: number;
  value?: TetradAnswer;
  onChange: (value: TetradAnswer) => void;
}

export function TetradCard({ tetrad, index, total, value, onChange }: Props) {
  const most = value?.mostIndex;
  const least = value?.leastIndex;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Tetrad {String(index + 1).padStart(2, '0')} / {total}</p>
          <h3 className="font-display text-xl text-gold">Pilih Most & Least</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Gunakan tombol di bawah untuk tandai Most (★) dan Least (✕).</span>
        </div>
      </div>

      <div className="grid gap-3">
        {tetrad.items.map((item, i) => {
          const dim = dimensionMap[item.dim];
          const isMost = most === i;
          const isLeast = least === i;
          const pulseClass = isMost ? 'ring-2 ring-gold scale-[1.01]' : isLeast ? 'ring-2 ring-black scale-[0.995]' : '';
          const leastColor = '#000000';
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-3 py-3 ${
                isMost ? 'bg-gold/5 border-gold/40 shadow-sm' : 'bg-bg/40'
              } transition-all duration-200 ${pulseClass} ${isLeast ? 'border-black' : 'border-border'}`}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-text"
                style={{ background: `${dim?.color ?? '#444'}33`, border: `1px solid ${dim?.color ?? '#555'}` }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <div className="flex-1">
                <p className="text-sm text-text">{item.text}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onChange({ mostIndex: i, leastIndex: least ?? -1 })}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                    isMost ? 'bg-gold text-bg shadow' : 'border border-border text-text hover:border-gold/60'
                  }`}
                >
                  ★ Most
                </button>
                <button
                  onClick={() => onChange({ mostIndex: most ?? -1, leastIndex: i })}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-150 border ${
                    isLeast ? 'border-black bg-black text-white shadow' : 'border-border text-text hover:border-black/60'
                  }`}
                >
                  ✕ Least
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
