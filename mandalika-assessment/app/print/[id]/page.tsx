import { notFound } from 'next/navigation'
import { essayQuestions } from '@/lib/assessment-data'
import { checkLeaderPassword } from '@/lib/auth'
import { getSubmission } from '@/lib/kv'
import {
  dimensions,
  dimensionOrder,
} from '@/lib/assessment-data'
import {
  getCategoryColor,
  getDimensionAlerts,
  getLayer1GateStatuses,
  getProfileFlagDefinitions,
} from '@/lib/scoring'
import { PrintTrigger } from '@/components/print-trigger'

export const dynamic = 'force-dynamic'

type PrintPageProps = {
  params: { id: string }
  searchParams: { pw?: string }
}

export default async function PrintParticipantReportPage({
  params,
  searchParams,
}: PrintPageProps) {
  const password = typeof searchParams.pw === 'string' ? searchParams.pw : ''

  if (!checkLeaderPassword(password)) {
    return (
      <main className="min-h-screen bg-ink px-6 py-8">
        <div className="mx-auto max-w-xl">
          <div className="surface-card p-6">
            <p className="eyebrow">Unauthorized</p>
            <h1 className="mt-3 text-3xl">Akses report ditolak.</h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Buka report ini dari dashboard leader agar password tervalidasi dengan benar.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const submission = await getSubmission(params.id)
  if (!submission) notFound()

  const categoryColor = getCategoryColor(submission.scores.finalCategory)
  const flags = getProfileFlagDefinitions(submission.scores.profileFlags)
  const alerts = getDimensionAlerts(submission.scores.dims)
  const layer1Statuses = getLayer1GateStatuses(submission.scores.dims)

  return (
    <main className="min-h-screen bg-[#f6f1e7] px-4 py-5 text-slate-700 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-[980px] space-y-4 print:max-w-none print:space-y-3">
        <PrintTrigger />

        <section className="rounded-card border border-[#d9c8a7] bg-white p-6 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            Mandalika Assessment Report
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <h1 className="text-[2rem] leading-none text-slate-800">{submission.name}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {submission.dept} | {submission.role} | {submission.tenure}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Submitted{' '}
                {new Date(submission.timestamp).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="rounded-card border border-[#dcc9a5] bg-[#fbf6ec] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Final Category
              </p>
              <p className="mt-2 text-2xl leading-tight" style={{ color: categoryColor }}>
                {submission.scores.finalCategory}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Final score {submission.scores.finalScore}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3 print:break-inside-avoid">
          {[
            ['Weighted Score', String(submission.scores.weightedScore)],
            ['Gate 1', submission.scores.gate1.passed ? 'Passed' : 'Failed'],
            ['Gate 2', submission.scores.gate2.passed ? 'Passed' : 'Failed'],
            ['Raw Category', submission.scores.rawCategory],
            ['Strengths', submission.scores.strengths.join(' | ') || '-'],
            ['Gaps', submission.scores.gaps.join(' | ') || '-'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-card border border-[#dcc9a5] bg-white px-4 py-4"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-card border border-[#dcc9a5] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
              13 Dimension Breakdown
            </p>
            <div className="mt-4 space-y-3">
              {dimensionOrder.map((key) => {
                const score = submission.scores.dims[key]
                const detail = dimensions[key]
                return (
                  <div key={key} className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{detail.label}</p>
                        <p className="text-xs leading-5 text-slate-500">{detail.description}</p>
                      </div>
                      <p className="text-sm font-medium text-[#b99246]">{score}%</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#ebe2d2]">
                      <div
                        className="h-2 rounded-full bg-[#b99246]"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-card border border-[#dcc9a5] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
                Gate 1 Status
              </p>
              <div className="mt-4 space-y-3">
                {layer1Statuses.map((status) => (
                  <div key={status.key} className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-700">{status.label}</p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {status.status}
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {status.score}% | gate {status.gateThreshold}% | critical {status.criticalThreshold}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-card border border-[#dcc9a5] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
                Profile Flags
              </p>
              <div className="mt-4 space-y-3">
                {flags.length ? (
                  flags.map((flag) => (
                    <div key={flag.key} className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
                      <p className="text-sm font-medium text-slate-700">{flag.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{flag.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3 text-sm text-slate-500">
                    Tidak ada profile flag aktif.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-card border border-[#dcc9a5] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
                Dimension Alerts
              </p>
              <div className="mt-4 space-y-3">
                {alerts.length ? (
                  alerts.map((alert) => (
                    <div
                      key={`${alert.key}-${alert.level}`}
                      className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-700">{alert.label}</p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          {alert.level}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{alert.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3 text-sm text-slate-500">
                    Tidak ada alerts khusus.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-card border border-[#dcc9a5] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            Kritik, Saran, dan Ide
          </p>
          <div className="mt-4 space-y-4">
            {essayQuestions.map((question, index) => (
              <div key={question.code} className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-4">
                <p className="text-sm font-medium text-slate-700">
                  {question.code} | {question.question}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{question.hint}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {submission.essayAnswers[index] || '-'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-[#dcc9a5] bg-white p-5 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            Leader Notes
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {submission.leaderNotes || '-'}
          </p>
        </section>
      </div>
    </main>
  )
}
