import { notFound } from "next/navigation";

import { getSession } from "@/lib/kv/session";
import { DIMENSIONS, dimensionMap } from "@/lib/scoring/dimensions";

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const session = await getSession(params.sessionId);
  if (!session) return notFound();

  const result = session.finalResult;
  const dimensionScores: Record<import("@/lib/scoring/types").DimensionKey, number> =
    session.sjtScores ?? session.dimensionScores ?? ({} as Record<import("@/lib/scoring/types").DimensionKey, number>);

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Hasil Assessment</p>
          <h1 className="font-display text-4xl text-gold">Session {params.sessionId.slice(0, 8)}...</h1>
          <p className="text-sm text-muted">Status: {session.status}</p>
        </div>

        {!result ? (
          <div className="card p-6 text-muted">Analisis masih berjalan. Coba lagi dalam beberapa menit.</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Metric label="Profile Score" value={`${result.profileScore.toFixed(1)}%`} />
              <Metric label="CSS" value={`-${result.css}`} />
              <Metric label="PGS" value={`-${result.pgs}`} />
              <Metric label="Final Score" value={`${result.finalScore.toFixed(1)}%`} highlight />
              <Metric label="Kategori" value={result.finalCategory} highlight />
              <Metric label="Override" value={result.wasDowngraded ? result.downgradeReason ?? "Applied" : "None"} />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="font-display text-2xl text-gold">Dimensi</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.key} className="rounded-lg border border-border bg-bg/60 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{dim.label}</p>
                    <p className="mt-1 text-xl font-semibold" style={{ color: dim.color }}>
                      {Math.round(dimensionScores[dim.key] ?? 0)}%
                    </p>
                    <p className="text-[11px] text-muted">Layer {dim.layer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-display text-xl text-gold">Strengths</h4>
                <ul className="mt-2 space-y-1 text-sm text-text">
                  {result.strengths.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-display text-xl text-gold">Gaps</h4>
                <ul className="mt-2 space-y-1 text-sm text-text">
                  {result.gaps.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card p-6 space-y-2">
              <h4 className="font-display text-xl text-gold">Leader Summary</h4>
              <p className="text-sm text-text">{result.leaderSummary}</p>
              {result.profileFlags.length > 0 && (
                <p className="text-xs text-muted">Flags: {result.profileFlags.join(", ")}</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`card p-4 ${highlight ? "border-gold/50" : ""}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
    </div>
  );
}
