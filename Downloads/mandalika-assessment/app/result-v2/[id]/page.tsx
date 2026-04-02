import Link from 'next/link'
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
    color: DIMENSIONS[key as keyof typeof DIMENSIONS].color,
  }))

  return (
    <main className="min-h-screen bg-ink px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Assessment v2 Result</p>
            <h1 className="text-3xl font-semibold">{submission.name}</h1>
            <p className="text-sm text-muted">{submission.position}</p>
            <p className="text-sm text-muted">
              {new Date(submission.timestamp).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-card border border-border bg-white px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Klasifikasi</p>
              <p className="text-xl font-semibold">{submission.classification}</p>
              <p className="text-xs text-muted">
                Gate L1: {submission.layer1Gate.overallPassed ? 'Lolos' : 'Fail'} · Faking:{' '}
                {submission.fakingAlert.hasFakingAlert ? 'Ya' : 'Tidak'}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Link className="btn-secondary px-3 py-2 text-xs" href={`/print-v2/${submission.id}`}>
                Print / PDF
              </Link>
              <Link className="btn-secondary px-3 py-2 text-xs" href="/leader-v2">
                Kembali ke Leader
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-4">
          <StatCard label="Tetrad Avg" value={`${avg(submission.tetradScores)}%`} />
          <StatCard label="SJT Avg" value={`${avg(submission.sjtScores)}%`} />
          <StatCard label="BEI Avg" value={`${avg(submission.beiScores)}%`} />
          <StatCard label="Final Avg" value={`${avg(submission.finalScores)}%`} />
        </section>

        <section className="surface-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <p className="eyebrow">Radar 13 Dimensi</p>
              <div className="mt-2 rounded-card border border-border bg-panel p-3">
                <RadarChart data={dimEntries} />
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-3">
                  {dimEntries.map((d) => (
                    <div key={d.key} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="truncate">{d.label}</span>
                      <span className="ml-auto text-[11px] text-text">{d.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full space-y-3 lg:w-1/3">
              <div className="rounded-card border border-border bg-panel p-3">
                <p className="eyebrow">Gate CSS (L1)</p>
                <div className="mt-2 space-y-2">
                  {Object.entries(submission.layer1Gate.gateResults).map(([key, res]) => (
                    <div key={key} className="rounded-field border px-2 py-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>{DIMENSIONS[key as keyof typeof DIMENSIONS]?.label || key}</span>
                        <span className={res.passed ? 'text-emerald-600' : 'text-amber-700'}>
                          {res.passed ? 'OK' : 'Fail'}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">
                        {res.score}% · Threshold {res.threshold}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-card border border-border bg-panel p-3">
                <p className="eyebrow">Faking Alert</p>
                <p className="mt-1 text-sm text-muted">
                  {submission.fakingAlert.hasFakingAlert
                    ? `Alert (skor inkonsistensi ${submission.fakingAlert.inconsistencyScore}). Validasi manual.`
                    : 'Tidak ada indikasi faking signifikan.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card p-5">
          <p className="eyebrow">Final Scores (13 Dimensi)</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dimEntries.map((d) => (
              <div key={d.key} className="rounded-card border border-border bg-panel p-3">
                <p className="text-sm font-semibold">{d.label}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-2 flex-1 rounded-full bg-border">
                    <div className="h-2 rounded-full" style={{ width: `${d.score}%`, background: d.color }} />
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gold">{d.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <p className="eyebrow">BEI Responses</p>
          <div className="mt-3 space-y-3">
            {submission.beiAnswers.map((ans) => (
              <div
                key={ans.questionId}
                className={`rounded-card border border-border bg-panel p-3 ${
                  ans.evaluation?.score && ans.evaluation.score >= 3 ? 'outline outline-1 outline-emerald-100' : ''
                }`}
              >
                <p className="text-sm font-semibold">{ans.questionId}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{ans.answer || '-'}</p>
                {ans.evaluation ? (
                  <div className="mt-2 space-y-1 rounded-card bg-white/60 p-2 text-xs text-muted">
                    <div className="flex items-center justify-between">
                      <span>Skor {ans.evaluation.score}</span>
                      <span className="text-[11px]">{ans.evaluation.follow_up_needed ? 'Perlu follow-up' : 'Cukup'}</span>
                    </div>
                    <p>{ans.evaluation.justification}</p>
                    {ans.evaluation.strengths?.length ? (
                      <p>Kekuatan: {ans.evaluation.strengths.join(' • ')}</p>
                    ) : null}
                    {ans.evaluation.concerns?.length ? (
                      <p>Catatan: {ans.evaluation.concerns.join(' • ')}</p>
                    ) : null}
                    {ans.evaluation.follow_up_needed && ans.evaluation.follow_up_question ? (
                      <p>Follow-up: {ans.evaluation.follow_up_question}</p>
                    ) : null}
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
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text">{value}</p>
    </div>
  )
}

function RadarChart({ data }: { data: { key: string; label: string; score: number; color: string }[] }) {
  const size = 360
  const center = size / 2
  const radius = center - 24
  const step = (Math.PI * 2) / data.length
  const points = data.map((d, i) => {
    const angle = -Math.PI / 2 + i * step
    const r = (Math.min(100, Math.max(0, d.score)) / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'
  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
      <defs>
        <linearGradient id="radarFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#c5a159" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#b99246" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      {gridLevels.map((lv) => (
        <circle
          key={lv}
          cx={center}
          cy={center}
          r={radius * lv}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      ))}
      {data.map((d, i) => {
        const angle = -Math.PI / 2 + i * step
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return <line key={d.key} x1={center} y1={center} x2={x} y2={y} stroke="#e5e7eb" strokeWidth={1} />
      })}
      <path d={path} fill="url(#radarFill)" stroke="#b99246" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={data[i].color} stroke="white" strokeWidth={1.5} />
      ))}
      {data.map((d, i) => {
        const angle = -Math.PI / 2 + i * step
        const labelR = radius + 12
        const x = center + labelR * Math.cos(angle)
        const y = center + labelR * Math.sin(angle)
        const anchor = Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle'
        return (
          <text
            key={d.key}
            x={x}
            y={y}
            textAnchor={anchor as 'start' | 'middle' | 'end'}
            dominantBaseline="middle"
            className="fill-slate-700 text-[11px]"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}
