import { dimensionMap } from '@/lib/scoring/dimensions';
import { BEI_QUESTIONS } from '@/lib/questions/bei';
import { DualSourcePanel } from './DualSource';

interface Props {
  data: any;
}

export default function Info({ data }: Props) {
  const profileFlags: string[] = data.finalResult?.profileFlags ?? [];

  return (
    <div className="space-y-3 print:space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <InfoCard title="Nama" value={data.profile?.name ?? "—"} />
        <InfoCard title="Email" value={data.profile?.email ?? "—"} />
        <InfoCard title="Status" value={data.status} />
        <InfoCard
          title="Final %"
          value={data.finalResult?.finalScore ? `${data.finalResult.finalScore.toFixed(1)}%` : "—"}
        />
        <InfoCard title="Kategori" value={data.finalResult?.finalCategory ?? "—"} />
        <InfoCard title="Created" value={new Date(data.createdAt).toLocaleString()} />
        <InfoCard
          title="Completed"
          value={data.completedAt ? new Date(data.completedAt).toLocaleString() : "Belum selesai"}
        />
      </div>

      {data.finalResult?.leaderSummary && (
        <div className="card p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Ringkasan</p>
          <p className="text-sm text-text">{data.finalResult.leaderSummary}</p>
        </div>
      )}

      <DualSourcePanel
        fcScores={data.fcScores ?? data.finalResult?.fcScores}
        sjtScores={data.sjtScores ?? data.finalResult?.sjtScores ?? data.dimensionScores}
        interpretations={data.finalResult?.dimInterpretations}
        alerts={data.finalResult?.dimensionAlerts}
      />

      <FlagUpdatePanel flags={profileFlags} />

      {data.beiAnalysis && (
        <div className="card p-3 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Hasil BEI</p>
          <div className="space-y-2 text-sm">
            {data.beiAnalysis.map((r: any) => {
              const q = BEI_QUESTIONS.find((qq) => qq.id === r.questionId);
              return (
                <div key={r.questionId} className="rounded-lg border border-border bg-bg/60 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-text">{q?.title ?? r.questionId}</p>
                      <p className="text-[11px] text-muted">{q?.question}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold">{Math.round(r.score)}%</p>
                      <p className="text-[11px] text-muted capitalize">{r.confidence} conf.</p>
                    </div>
                  </div>
                  {r.redFlags?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.redFlags.map((flag: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full border border-cat-c/30 bg-cat-c/10 text-cat-c px-2 py-[2px] text-[11px]"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 print:hidden"></div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-1 text-base font-semibold text-text break-words">{value}</p>
    </div>
  );
}

function FlagList({ flags }: { flags: string[] }) {
  const classify = (f: string) => {
    if (f.includes('collapse') || f.includes('character') || f.includes('faking')) return 'critical';
    if (f.includes('gap') || f.includes('risk')) return 'attention';
    return 'info';
  };
  const style = (c: string) =>
    c === 'critical'
      ? 'bg-cat-c/10 text-cat-c border border-cat-c/30'
      : c === 'attention'
      ? 'bg-amber-100 text-amber-800 border border-amber-200'
      : 'bg-border text-muted border border-border';

  return (
    <div className="flex flex-wrap gap-1.5 text-[11px]">
      {flags.map((f, i) => {
        const cls = classify(f);
        return (
          <span key={i} className={`rounded-full px-2 py-[3px] ${style(cls)}`}>
            {f.replace(/_/g, ' ')}
          </span>
        );
      })}
    </div>
  );
}

function FlagUpdatePanel({ flags }: { flags: string[] }) {
  if (!flags || flags.length === 0) return null;

  const buckets: Record<string, string[]> = {
    sjt_css: [],
    fc_sjt: [],
    fc_priority: [],
    other: [],
  };

  flags.forEach((f) => {
    if (f.includes('character') || f.includes('css') || f.includes('pgs') || f.includes('borderline')) {
      buckets.sjt_css.push(f);
    } else if (f.includes('sleeping_strength') || f.includes('possible_faking') || f.includes('gap_probe') || f.includes('genuine_gap')) {
      buckets.fc_sjt.push(f);
    } else if (f.includes('consistency') || f.includes('priority')) {
      buckets.fc_priority.push(f);
    } else {
      buckets.other.push(f);
    }
  });

  const renderBucket = (label: string, arr: string[]) => (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-[0.15em] text-muted">{label}</p>
      {arr.length === 0 ? (
        <p className="text-[11px] text-muted">Tidak ada flag.</p>
      ) : (
        <FlagList flags={arr} />
      )}
    </div>
  );

  return (
    <div className="card p-3 space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Analisis Flags</p>
      <div className="grid gap-3 md:grid-cols-3">
        {renderBucket('SJT + CSS', buckets.sjt_css)}
        {renderBucket('FC × SJT', buckets.fc_sjt)}
        {renderBucket('FC Priority Pattern', buckets.fc_priority)}
      </div>
      {buckets.other.length > 0 && (
        <div className="pt-1">{renderBucket('Lainnya', buckets.other)}</div>
      )}
    </div>
  );
}
