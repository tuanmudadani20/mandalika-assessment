import { notFound } from "next/navigation";

import { getSession } from "@/lib/kv/session";
import { computeScore, L1, L2, ALL_DIMS } from "@/lib/scoring/engine";
import { DIM_LABELS } from "@/lib/scoring/dimensions";
import { DimCard } from "@/components/results/DimCard";
import type { ScoringResult } from "@/lib/scoring/types";
import { FCPriorityPanel } from "@/components/results/FCPriorityPanel";
import { SJTJudgmentPanel } from "@/components/results/SJTJudgmentPanel";

const L3 = ["dampakTim", "resiliensi", "communicationClarity"] as const;
const L4 = ["decisive", "innovative"] as const;

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const session = await getSession(params.sessionId);
  if (!session) return notFound();

  const isNewSchema = Boolean(session.finalResult?.profileScore && (session.finalResult as any)?.dimResults);
  const recomputed =
    (!isNewSchema && session.fcScores && session.sjtScores) ? computeScore(session.fcScores, session.sjtScores) : null;
  const result: ScoringResult | null = (session.finalResult as any) ?? recomputed;

  if (!result) {
    return (
      <main className="min-h-screen px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <h1 className="font-display text-3xl text-gold">Session {params.sessionId.slice(0, 8)}...</h1>
          <div className="card p-6 text-muted">Analisis masih berjalan. Coba lagi dalam beberapa menit.</div>
        </div>
      </main>
    );
  }

  const categoryColor = getCategoryColor(result.finalCategory);

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Hasil Assessment</p>
          <h1 className="font-display text-4xl text-gold">Session {params.sessionId.slice(0, 8)}...</h1>
          <p className="text-sm text-muted">Status: {session.status}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Kategori Final</p>
            <p className={`text-3xl font-bold ${categoryColor}`}>{result.finalCategory}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <Row label="Profile Score (FC)" value={`${result.profileScore}%`} />
            <Row label="CSS (karakter)" value={`-${result.css}`} valueClass="text-red-600" />
            <Row label="PGS (performa)" value={`-${result.pgs}`} valueClass="text-amber-700" />
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Final Score</span>
              <span className={categoryColor}>{result.finalScore}%</span>
            </div>
          </div>
          {result.borderlineFlag && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-lg p-2 text-center">
              Skor borderline — lihat angka, bukan hanya label.
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FCPriorityPanel fcScores={result.fcScores} />
          <SJTJudgmentPanel sjtScores={result.sjtScores} />
        </div>

        {/* Dimensi per Layer */}
        {[
          { label: "Layer 1 — Fondasi Karakter", dims: L1, color: "text-green-800" },
          { label: "Layer 2 — Mesin Performa", dims: L2, color: "text-blue-800" },
          { label: "Layer 3 — Pengali Dampak", dims: L3, color: "text-amber-800" },
          { label: "Layer 4 — Amplifier", dims: L4, color: "text-purple-800" },
        ].map((layer) => (
          <div key={layer.label} className="space-y-2">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${layer.color}`}>{layer.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {layer.dims.map((dim) => {
                const dr = result.dimResults?.find((d) => d.dim === dim);
                if (!dr) return null;
                return <DimCard key={dim} dimResult={dr} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function getCategoryColor(cat?: string) {
  const cfg: Record<string, string> = {
    'A Player': 'text-green-700',
    'B Solid Player': 'text-blue-700',
    'B Player': 'text-amber-700',
    'C Player': 'text-red-700',
    'C Player Kritis': 'text-red-900',
  };
  return cfg[cat ?? ''] ?? 'text-text';
}
