import { useMemo } from 'react';

import { BEIQuestion as BEIQuestionType } from '@/lib/questions/bei';
import { dimensionMap } from '@/lib/scoring/dimensions';

interface Props {
  question: BEIQuestionType;
  index: number;
  value: string;
  onChange: (text: string) => void;
}

export function BEIQuestion({ question, index, value, onChange }: Props) {
  const wordCount = useMemo(() => value.trim().split(/\s+/).filter(Boolean).length, [value]);
  const dimLabels = question.targetDims.map((d) => dimensionMap[d]?.label ?? d).join(' • ');

  const wordColor = wordCount > 0 ? 'text-gold' : 'text-muted';

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">BEI {String(index + 1).padStart(2, '0')} / 8</p>
          <h3 className="font-display text-2xl text-gold">{question.title}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-2 text-[11px] uppercase tracking-wide">
          {question.targetDims.map((dim) => (
            <span
              key={dim}
              className="rounded-full border border-border px-3 py-1"
              style={{ color: dimensionMap[dim]?.color, borderColor: `${dimensionMap[dim]?.color}33` }}
            >
              {dimensionMap[dim]?.label ?? dim}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-text leading-relaxed">{question.question}</p>

      {question.probe.length > 0 && (
        <details className="rounded-lg border border-border bg-bg/60 p-3 text-sm text-muted">
          <summary className="cursor-pointer text-text">Butuh bantuan?</summary>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {question.probe.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] rounded-lg border border-border bg-bg/70 p-3 text-sm text-text focus:border-gold focus:outline-none"
          placeholder="Ceritakan dengan contoh nyata dan spesifik..."
        />
        <div className="flex items-center justify-between text-xs text-muted">
          <span className={wordColor}>{wordCount} kata</span>
          <span className="text-muted">Tidak ada minimal kata</span>
        </div>
      </div>

      <div className="text-xs uppercase tracking-[0.2em] text-muted">{dimLabels}</div>
    </div>
  );
}
