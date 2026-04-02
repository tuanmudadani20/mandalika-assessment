import { notFound } from 'next/navigation'
import { getSubmissionV2 } from '@/lib/kv-v2'
import { DIMENSIONS } from '@/lib/question-bank'

export const dynamic = 'force-dynamic'

export default async function ResultV2Page({ params }: { params: { id: string } }) {
  const submission = await getSubmissionV2(params.id)
  if (!submission) notFound()

  const dimEntries = Object.keys(DIMENSIONS).map((key) => ({
    key,
    label: DIMENSIONS[key as keyof typeof DIMENSIONS].label,
    score: submission.finalScores[key] ?? 0,
  }))

  return (
    <main className="min-h-screen bg-ink px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Assessment v2 Result</p>
            <h1 className="text-3xl font-semibold">{submission.name}</h1>
            <p className="text-sm text-muted">{submission.position}</p>
            <p className="text-sm text-muted">
              {new Date(submission.timestamp).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="rounded-card border border-border bg-white px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Klasifikasi</p>
            <p className="text-xl font-semibold">{submission.classification}</p>
            <p className="text-xs text-muted">
              Gate L1: {submission.layer1Gate.overallPassed ? 'Lolos' : 'Fail'} · Faking:{' '}
              {submission.fakingAlert.hasFakingAlert ? 'Ya' : 'Tidak'}
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <StatCard label="Tetrad Avg" value={avg(submission.tetradScores)} />
          <StatCard label="SJT Avg" value={avg(submission.sjtScores)} />
          <StatCard label="BEI Avg" value={avg(submission.beiScores)} />
          <StatCard label="Final Avg" value={avg(submission.finalScores)} />
        </section>

        <section className="surface-card p-5">
          <p className="eyebrow">Layer 1 Gate</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {Object.entries(submission.layer1Gate.gateResults).map(([key, res]) => (
              <div key={key} className="rounded-card border border-border bg-panel p-3">
                <p className="text-sm font-semibold">{DIMENSIONS[key as keyof typeof DIMENSIONS]?.label || key}</p>
                <p className="text-xs text-muted">Score {res.score}% | Threshold {res.threshold}%</p>
                <p className={`text-xs ${res.passed ? 'text-green-600' : 'text-red-600'}`}>{res.passed ? 'Lolos' : 'Fail'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <p className="eyebrow">Faking Alert</p>
          <p className="mt-2 text-sm text-muted">
            {submission.fakingAlert.hasFakingAlert
              ? `Alert (score ${submission.fakingAlert.inconsistencyScore}). Validasi manual disarankan.`
              : 'Tidak ada indikasi faking signifikan.'}
          </p>
        </section>

        <section className="surface-card p-5">
          <p className="eyebrow">Final Scores (13 Dimensi)</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dimEntries.map((d) => (
              <div key={d.key} className="rounded-card border border-border bg-panel p-3">
                <p className="text-sm font-semibold">{d.label}</p>
                <p className="text-xl font-semibold text-gold">{d.score}%</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <p className="eyebrow">BEI Responses</p>
          <div className="mt-3 space-y-3">
            {submission.beiAnswers.map((ans) => (
              <div key={ans.questionId} className="rounded-card border border-border bg-panel p-3">
                <p className="text-sm font-semibold">{ans.questionId}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{ans.answer || '-'}</p>
                {ans.evaluation ? (
                  <div className="mt-2 text-xs text-muted">
                    Skor: {ans.evaluation.score} · {ans.evaluation.justification}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function avg(obj: Record<string, number>) {
  const vals = Object.values(obj || {})
  if (!vals.length) return '0'
  const v = vals.reduce((a, b) => a + b, 0) / vals.length
  return `${Math.round(v)}`
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text">{value}</p>
    </div>
  )
}
