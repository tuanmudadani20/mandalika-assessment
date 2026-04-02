import { notFound } from 'next/navigation'
import { checkLeaderPassword } from '@/lib/auth'
import { getSubmissionV2 } from '@/lib/kv-v2'
import { DIMENSIONS } from '@/lib/question-bank'
import { PrintTrigger } from '@/components/print-trigger'

export const dynamic = 'force-dynamic'

type PrintPageProps = {
  params: { id: string }
  searchParams: { pw?: string }
}

export default async function PrintV2Page({ params, searchParams }: PrintPageProps) {
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

  const submission = await getSubmissionV2(params.id)
  if (!submission) notFound()

  const dimEntries = Object.keys(DIMENSIONS).map((key) => ({
    key,
    label: DIMENSIONS[key as keyof typeof DIMENSIONS].label,
    score: submission.finalScores[key] ?? 0,
    color: DIMENSIONS[key as keyof typeof DIMENSIONS].color,
  }))

  return (
    <main className="min-h-screen bg-[#f6f1e7] px-4 py-5 text-slate-700 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-[980px] space-y-4 print:max-w-none print:space-y-3">
        <PrintTrigger />

        <section className="rounded-card border border-[#d9c8a7] bg-white p-6 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            Mandalika Assessment v2
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <h1 className="text-[2rem] leading-none text-slate-800">{submission.name}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">{submission.position}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Submitted {formatDate(submission.timestamp)}
              </p>
            </div>
            <div className="rounded-card border border-[#dcc9a5] bg-[#fbf6ec] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Klasifikasi
              </p>
              <p className="mt-2 text-2xl leading-tight text-[#b99246]">
                {submission.classification}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Gate L1: {submission.layer1Gate.overallPassed ? 'Lolos' : 'Fail'} · Faking:{' '}
                {submission.fakingAlert.hasFakingAlert ? 'Alert' : 'Bersih'}
              </p>
              <p className="text-sm text-slate-500">Rata final {avg(submission.finalScores)}%</p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3 print:break-inside-avoid">
          {[
            ['Tetrad', avg(submission.tetradScores)],
            ['SJT', avg(submission.sjtScores)],
            ['BEI', avg(submission.beiScores)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-card border border-[#dcc9a5] bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-[#b99246]">{value}%</p>
            </div>
          ))}
        </section>

        <section className="rounded-card border border-[#dcc9a5] bg-white p-5 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            Gate & Faking
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
              <p className="text-sm font-semibold text-slate-700">Layer 1 CSS</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {Object.entries(submission.layer1Gate.gateResults).map(([key, res]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="w-2.5 shrink-0 rounded-full" style={{ background: DIMENSIONS[key as keyof typeof DIMENSIONS]?.color || '#b99246', height: 10 }} />
                    <span className="flex-1">
                      {DIMENSIONS[key as keyof typeof DIMENSIONS]?.label ?? key} · {res.score}% (min {res.threshold}%)
                    </span>
                    <span className={`text-xs ${res.passed ? 'text-emerald-600' : 'text-amber-700'}`}>{res.passed ? 'OK' : 'Fail'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
              <p className="text-sm font-semibold text-slate-700">Faking Alert</p>
              <p className="mt-1 text-sm text-slate-600">
                {submission.fakingAlert.hasFakingAlert
                  ? `Alert (skor inkonsistensi ${submission.fakingAlert.inconsistencyScore}). Validasi manual disarankan.`
                  : 'Tidak ada indikasi faking signifikan.'}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-card border border-[#dcc9a5] bg-white p-5 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            13 Dimensi
          </p>
          <div className="mt-4 space-y-3">
            {dimEntries.map((d) => (
              <div key={d.key} className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    <p className="text-sm font-medium text-slate-700">{d.label}</p>
                  </div>
                  <p className="text-sm font-medium text-[#b99246]">{d.score}%</p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#ebe2d2]">
                  <div className="h-2 rounded-full" style={{ width: `${d.score}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-[#dcc9a5] bg-white p-5 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b99246]">
            Jawaban BEI
          </p>
          <div className="mt-3 space-y-3">
            {submission.beiAnswers.map((ans) => (
              <div key={ans.questionId} className="rounded-card border border-[#eee5d3] bg-[#fcf8f1] p-3">
                <p className="text-sm font-semibold text-slate-700">{ans.questionId}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{ans.answer || '-'}</p>
                {ans.evaluation ? (
                  <div className="mt-2 text-xs text-slate-600">
                    Skor: {ans.evaluation.score} · {ans.evaluation.justification}
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

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
