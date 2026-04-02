import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dimensions } from '@/lib/assessment-data'
import { getSubmission } from '@/lib/kv'
import { getLeaderPassword } from '@/lib/auth'
import {
  getCategoryColor,
  getDimensionAlerts,
  getLayer1GateStatuses,
  getProfileFlagDefinitions,
} from '@/lib/scoring'

export const dynamic = 'force-dynamic'

function formatDateTime(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatClock(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(seconds?: number | null) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '-'
  const total = Math.max(0, Math.round(seconds))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  const hours = Math.floor(mins / 60)
  const restMins = mins % 60
  if (hours > 0) return `${hours}j ${restMins}m${secs ? ` ${secs}d` : ''}`.trim()
  if (mins > 0) return `${mins}m${secs ? ` ${secs}d` : ''}`.trim()
  return `${secs}d`
}

function formatRange(start?: string, end?: string) {
  if (!start && !end) return '-'
  const range = start && end ? `${formatClock(start)} - ${formatClock(end)}` : start ? `Mulai ${formatClock(start)}` : `Selesai ${formatClock(end)}`
  if (start && end) {
    const duration = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000))
    return `${range} • ${formatDuration(duration)}`
  }
  return range
}

export default async function ResultPage({
  params,
}: {
  params: { id: string }
}) {
  const submission = await getSubmission(params.id)
  if (!submission) notFound()
  const printUrl = `/print/${params.id}?pw=${encodeURIComponent(getLeaderPassword())}`

  const categoryColor = getCategoryColor(submission.scores.finalCategory)
  const layer1Statuses = getLayer1GateStatuses(submission.scores.dims)
  const alerts = getDimensionAlerts(submission.scores.dims)
  const flags = getProfileFlagDefinitions(submission.scores.profileFlags)

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Assessment Result</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">{submission.name}</h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Assessment tersimpan pada{' '}
              {new Date(submission.timestamp).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={printUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Print PDF
            </Link>
            <Link href="/" className="btn-secondary">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Mulai', formatDateTime(submission.timings.startedAt)],
            ['Selesai', formatDateTime(submission.timings.finishedAt)],
            ['Total Waktu', formatDuration(submission.timings.totalSeconds)],
            ['Sesi 1 · Tetrad', formatRange(submission.timings.tetrad.start, submission.timings.tetrad.end)],
            ['Sesi 2 · ML-SJT', formatRange(submission.timings.sjt.start, submission.timings.sjt.end)],
            ['Sesi 3 · Feedback', formatRange(submission.timings.essay.start, submission.timings.essay.end)],
          ].map(([label, value]) => (
            <div key={label} className="surface-card p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
              <p className="mt-1.5 text-sm text-text">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card p-6 sm:p-8">
            <p className="eyebrow">Final Category</p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-4xl sm:text-5xl" style={{ color: categoryColor }}>
                  {submission.scores.finalCategory}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                  Kategori akhir sudah memperhitungkan gate karakter dan gate performa,
                  jadi bukan sekadar rata-rata skor mentah.
                </p>
                <p className="mt-4 text-sm text-muted">
                  {submission.dept} | {submission.role} | {submission.tenure}
                </p>
              </div>
              <div className="rounded-card border border-border bg-panel px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Final Score</p>
                <p className="metric-value mt-2">{submission.scores.finalScore}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard label="Raw Category" value={submission.scores.rawCategory} />
            <ScoreCard label="Weighted Score" value={String(submission.scores.weightedScore)} />
            <ScoreCard
              label="Gate 1"
              value={submission.scores.gate1.passed ? 'Passed' : 'Failed'}
            />
            <ScoreCard
              label="Gate 2"
              value={submission.scores.gate2.passed ? 'Passed' : 'Failed'}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <InfoPanel title="Strengths" items={submission.scores.strengths} />
          <InfoPanel title="Gaps" items={submission.scores.gaps} />
          <div className="surface-card p-5">
            <p className="eyebrow">Profile Flags</p>
            <div className="mt-5 space-y-4">
              {flags.length ? (
                flags.map((flag) => (
                  <div key={flag.key} className="rounded-card border border-border bg-panel p-4">
                    <p className="text-lg text-text">{flag.label}</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{flag.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">Tidak ada profile flag yang aktif.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card p-6">
            <p className="eyebrow">13 Dimension Scores</p>
            <div className="mt-6 space-y-4">
              {Object.entries(submission.scores.dims).map(([key, score]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-text">{dimensions[key as keyof typeof dimensions].label}</p>
                      <p className="text-xs leading-6 text-muted">
                        {dimensions[key as keyof typeof dimensions].description}
                      </p>
                    </div>
                    <p className="text-sm text-gold">{score}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-panel">
                    <div className="h-2 rounded-full bg-gold" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-5">
              <p className="eyebrow">Gate 1 Status</p>
              <div className="mt-5 space-y-3">
                {layer1Statuses.map((status) => (
                  <div key={status.key} className="rounded-card border border-border bg-panel p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-text">{status.label}</p>
                      <p
                        className={`text-xs uppercase tracking-[0.18em] ${
                          status.status === 'critical'
                            ? 'text-[#f3c0c0]'
                            : status.status === 'failed'
                              ? 'text-[#e3c07c]'
                              : 'text-gold'
                        }`}
                      >
                        {status.status}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      Skor {status.score}% | gate {status.gateThreshold}% | critical{' '}
                      {status.criticalThreshold}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <p className="eyebrow">Dimension Alerts</p>
              <div className="mt-5 space-y-3">
                {alerts.length ? (
                  alerts.map((alert) => (
                    <div key={`${alert.key}-${alert.level}`} className="rounded-card border border-border bg-panel p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-text">{alert.label}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {alert.level}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-muted">{alert.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">Tidak ada alert khusus dari skor saat ini.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ScoreCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-2xl text-text">{value}</p>
    </div>
  )
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface-card p-5">
      <p className="eyebrow">{title}</p>
      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item} className="rounded-card border border-border bg-panel p-4 text-sm leading-7 text-text">
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-card border border-border bg-panel p-4 text-sm leading-7 text-muted">
            Tidak ada data.
          </div>
        )}
      </div>
    </div>
  )
}
