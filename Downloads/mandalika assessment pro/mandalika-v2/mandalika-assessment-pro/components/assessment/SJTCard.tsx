import { SJTQuestion } from '@/lib/questions/sjt';
import { dimensionMap } from '@/lib/scoring/dimensions';
import { SJTAnswer } from '@/lib/scoring/types';

interface Props {
  question: SJTQuestion;
  index: number;
  value?: SJTAnswer;
  onChange: (value: SJTAnswer) => void;
}

export function SJTCard({ question, index, value, onChange }: Props) {
  const most = value?.mostIndex;
  const least = value?.leastIndex;
  const dim = dimensionMap[question.dim];

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">SJT {String(index + 1).padStart(2, '0')} / 30</p>
          <h3 className="font-display text-xl text-gold">{dim?.label}</h3>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold border border-border"
          style={{ background: `${dim?.color ?? '#1D4D8A'}26`, color: dim?.color ?? '#1D4D8A' }}
        >
          Layer {question.layer}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-bg/50 p-3 text-sm text-text leading-relaxed">
        {question.scenario}
      </div>

      <div className="grid gap-3">
        {question.options.map((opt, i) => {
          const isMost = most === i;
          const isLeast = least === i;
          const leastColor = '#000000';
          const pulseClass = isMost ? 'ring-2 ring-gold scale-[1.01]' : isLeast ? 'ring-2 ring-black scale-[0.995]' : '';
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-3 py-3 ${
                isMost ? 'bg-gold/5 border-gold/40 shadow-sm' : 'bg-bg/40'
              } transition-all duration-200 ${pulseClass} ${isLeast ? 'border-black' : 'border-border'}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-xs font-semibold">
                {String.fromCharCode(65 + i)}
              </span>
              <div className="flex-1 pr-3">
                <p className="text-sm">{opt}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => onChange({ mostIndex: i, leastIndex: least ?? -1 })}
                  className={`rounded-full px-3 py-2 font-semibold transition-all duration-150 ${
                    isMost ? 'bg-gold text-bg shadow' : 'border border-border text-text hover:border-gold/60'
                  }`}
                >
                  ★ Most
                </button>
                <button
                  onClick={() => onChange({ mostIndex: most ?? -1, leastIndex: i })}
                  className={`rounded-full px-3 py-2 font-semibold transition-all duration-150 border ${
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
