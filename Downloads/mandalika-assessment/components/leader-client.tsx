'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  dimensions,
  essayQuestions,
  sjtQuestions,
  tetradQuestions,
} from '@/lib/assessment-data'
import {
  getCategoryColor,
  getDimensionAlerts,
  getLayer1GateStatuses,
  getProfileFlagDefinitions,
} from '@/lib/scoring'
import type { Submission } from '@/lib/types'

const STORAGE_KEY = 'mandalika-leader-password'
const AI_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AI === 'true'

export function LeaderClient() {
  const [password, setPassword] = useState('')
  const [sessionPassword, setSessionPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [info, setInfo] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'name'>('newest')

  const authed = sessionPassword.length > 0

  const selected = useMemo(
    () => submissions.find((item) => item.id === selectedId) || null,
    [selectedId, submissions],
  )

  const departments = useMemo(
    () => Array.from(new Set(submissions.map((item) => item.dept).filter(Boolean))).sort(),
    [submissions],
  )

  const filtered = useMemo(() => {
    return [...submissions]
      .filter((submission) => {
        const query = search.trim().toLowerCase()
        if (
          query &&
          !submission.name.toLowerCase().includes(query) &&
          !submission.dept.toLowerCase().includes(query) &&
          !submission.role.toLowerCase().includes(query)
        ) {
          return false
        }

        if (categoryFilter && submission.scores.finalCategory !== categoryFilter) return false
        if (departmentFilter && submission.dept !== departmentFilter) return false
        return true
      })
      .sort((left, right) => {
        if (sortBy === 'name') return left.name.localeCompare(right.name)
        if (sortBy === 'highest') return right.scores.finalScore - left.scores.finalScore
        if (sortBy === 'lowest') return left.scores.finalScore - right.scores.finalScore
        return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
      })
  }, [categoryFilter, departmentFilter, search, sortBy, submissions])

  const stats = useMemo(() => {
    const total = submissions.length
    if (!total) {
      return { total: 0, avg: 0, aRate: 0, cRate: 0 }
    }

    const avg =
      submissions.reduce((sum, item) => sum + item.scores.finalScore, 0) / submissions.length
    const aRate =
      (submissions.filter((item) => item.scores.finalCategory === 'A Player').length /
        total) *
      100
    const cRate =
      (submissions.filter((item) => item.scores.finalCategory === 'C Player').length /
        total) *
      100

    return {
      total,
      avg: Math.round(avg * 10) / 10,
      aRate: Math.round(aRate),
      cRate: Math.round(cRate),
    }
  }, [submissions])

  const refresh = useCallback(
    async (pw: string, keepSelectedId?: string) => {
      const response = await fetch(`/api/results?pw=${encodeURIComponent(pw)}`)
      const data = (await response.json().catch(() => ({}))) as Submission[] & {
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat submissions.')
      }

      setSubmissions(data)
      const nextSelectedId = keepSelectedId || data[0]?.id || ''
      setSelectedId(nextSelectedId)

      const selectedSubmission = data.find((item) => item.id === nextSelectedId)
      setNotes(selectedSubmission?.leaderNotes || '')
    },
    [],
  )

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY) || ''
    if (!stored) return

    setSessionPassword(stored)
    void refresh(stored).catch((loadError: unknown) => {
      sessionStorage.removeItem(STORAGE_KEY)
      setSessionPassword('')
      setError(loadError instanceof Error ? loadError.message : 'Gagal memuat dashboard.')
    })
  }, [refresh])

  useEffect(() => {
    if (selected) {
      setNotes(selected.leaderNotes || '')
    }
  }, [selectedId, selected])

  const login = async () => {
    setLoading(true)
    setError('')
    setInfo('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Password salah.')
      }

      sessionStorage.setItem(STORAGE_KEY, password)
      setSessionPassword(password)
      await refresh(password)
      setPassword('')
    } catch (loginError: unknown) {
      setError(loginError instanceof Error ? loginError.message : 'Gagal login.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSessionPassword('')
    setSubmissions([])
    setSelectedId('')
    setNotes('')
    setInfo('')
    setError('')
  }

  const quickPrint = useCallback(
    (id: string) => {
      if (!sessionPassword) {
        setError('Login dulu sebelum print.')
        return
      }
      const win = window.open(
        `/print/${id}?pw=${encodeURIComponent(sessionPassword)}`,
        '_blank',
        'noopener,noreferrer',
      )
      if (!win) setError('Popup diblokir browser. Izinkan pop-up lalu coba lagi.')
    },
    [sessionPassword],
  )

  const saveNotes = async () => {
    if (!selected) return

    setSavingNotes(true)
    setError('')
    setInfo('')

    try {
      const response = await fetch(`/api/result/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderNotes: notes, pw: sessionPassword }),
      })

      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan catatan.')
      }

      await refresh(sessionPassword, selected.id)
      setInfo('Catatan leader tersimpan.')
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : 'Gagal menyimpan catatan.')
    } finally {
      setSavingNotes(false)
    }
  }

  const runAnalysis = async () => {
    if (!selected) return

    setAnalyzing(true)
    setError('')
    setInfo('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          leaderNotes: notes,
          pw: sessionPassword,
        }),
      })

      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menjalankan analisis AI.')
      }

      await refresh(sessionPassword, selected.id)
      setInfo('Analisis AI selesai diperbarui.')
    } catch (analysisError: unknown) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : 'Gagal menjalankan analisis AI.',
      )
    } finally {
      setAnalyzing(false)
    }
  }

  const exportCsv = () => {
    const header = [
      'Timestamp',
      'Start',
      'Finish',
      'Total Seconds',
      'Tetrad Start',
      'Tetrad End',
      'SJT Start',
      'SJT End',
      'Essay Start',
      'Essay End',
      'Name',
      'Department',
      'Role',
      'Tenure',
      'Final Category',
      'Raw Category',
      'Weighted Score',
      'Final Score',
      'Layer1 Avg',
      'Layer2 Avg',
      'Layer3 Avg',
      'Layer4 Avg',
      'Gate1 Passed',
      'Gate1 Failed Count',
      'Gate1 Critical Count',
      'Gate2 Passed',
      'Gate2 Average',
      'Profile Flags',
      'Strengths',
      'Gaps',
      'Leader Notes',
      'AI Category',
      'AI Score',
      'AI Summary',
      ...Object.values(dimensions).map((item) => `${item.label} Score`),
      ...tetradQuestions.flatMap((question) => [`${question.code} Most`, `${question.code} Least`]),
      ...sjtQuestions.flatMap((question) => [`${question.code} Most`, `${question.code} Least`]),
      ...essayQuestions.map((question) => question.code),
    ]

    const rows = submissions.map((submission) => [
      submission.timestamp,
      submission.timings.startedAt,
      submission.timings.finishedAt,
      submission.timings.totalSeconds,
      submission.timings.tetrad.start || '',
      submission.timings.tetrad.end || '',
      submission.timings.sjt.start || '',
      submission.timings.sjt.end || '',
      submission.timings.essay.start || '',
      submission.timings.essay.end || '',
      submission.name,
      submission.dept,
      submission.role,
      submission.tenure,
      submission.scores.finalCategory,
      submission.scores.rawCategory,
      submission.scores.weightedScore,
      submission.scores.finalScore,
      submission.scores.layer1Avg,
      submission.scores.layer2Avg,
      submission.scores.layer3Avg,
      submission.scores.layer4Avg,
      submission.scores.gate1.passed,
      submission.scores.gate1.failedCount,
      submission.scores.gate1.criticalCount,
      submission.scores.gate2.passed,
      submission.scores.gate2.average,
      submission.scores.profileFlags.join(' | '),
      submission.scores.strengths.join(' | '),
      submission.scores.gaps.join(' | '),
      submission.leaderNotes,
      submission.aiResult?.kategori || '',
      submission.aiResult?.skor || '',
      submission.aiResult?.ringkasan || '',
      ...Object.keys(dimensions).map(
        (key) => submission.scores.dims[key as keyof typeof submission.scores.dims],
      ),
      ...submission.tetradAnswers.flatMap((answer) => [
        letter(answer.mostIndex),
        letter(answer.leastIndex),
      ]),
      ...submission.sjtAnswers.flatMap((answer) => [
        letter(answer.mostIndex),
        letter(answer.leastIndex),
      ]),
      ...submission.essayAnswers,
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mandalika-talent-assessment-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportSelectedPdf = () => {
    if (!selected) return

    const printWindow = window.open(
      `/print/${selected.id}?pw=${encodeURIComponent(sessionPassword)}`,
      '_blank',
      'noopener,noreferrer',
    )

    if (!printWindow) {
      setError('Popup export diblokir browser. Izinkan pop-up lalu coba lagi.')
      return
    }
  }

  const deleteSelected = async () => {
    if (!selected) return

    const confirmed = window.confirm(
      `Hapus data peserta ${selected.name}? Tindakan ini tidak bisa dibatalkan.`,
    )
    if (!confirmed) return

    setDeleting(true)
    setError('')
    setInfo('')

    try {
      const response = await fetch(`/api/result/${selected.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: sessionPassword }),
      })

      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus data peserta.')
      }

      await refresh(sessionPassword)
      setInfo('Data peserta berhasil dihapus.')
    } catch (deleteError: unknown) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Gagal menghapus data peserta.',
      )
    } finally {
      setDeleting(false)
    }
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-8">
        <div className="surface-card w-full max-w-md p-8">
          <p className="eyebrow">Leader Access</p>
          <h1 className="mt-3 text-3xl">Masuk ke dashboard leader.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Dashboard ini menampilkan ringkasan hasil, breakdown 13 dimensi, feedback peserta,
            dan catatan leader untuk review operasional.
          </p>
          <div className="mt-8 space-y-4">
            <label className="space-y-2">
              <span className="text-sm text-muted">Password</span>
              <input
                className="field-base"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void login()
                }}
              />
            </label>
            {error ? (
              <div className="rounded-card border border-danger bg-danger/10 px-4 py-3 text-sm text-[#f3c0c0]">
                {error}
              </div>
            ) : null}
            <button type="button" className="btn-primary w-full" onClick={login} disabled={loading}>
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-4 lg:px-6">
        <header className="surface-card px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Leader Dashboard</p>
              <h1 className="mt-2 text-3xl sm:text-[2.2rem]">Mandalika Talent Assessment</h1>
              <p className="mt-1 text-sm leading-6 text-muted">
                Review kandidat, buka report PDF, dan simpan keputusan leader dalam satu dashboard yang rapi.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => void refresh(sessionPassword, selectedId)}
              >
                Refresh
              </button>
              <button type="button" className="btn-secondary" onClick={exportCsv}>
                Export CSV
              </button>
              <button type="button" className="btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Peserta" value={String(stats.total)} />
            <StatCard label="% A Player" value={`${stats.aRate}%`} />
            <StatCard label="% C Player" value={`${stats.cRate}%`} />
            <StatCard label="Avg Score" value={String(stats.avg)} />
          </section>
        </header>

        {info ? <Banner tone="info" text={info} /> : null}
        {error ? <Banner tone="error" text={error} /> : null}

        <section className="mt-4 grid gap-4 xl:grid-cols-[296px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
            <div className="surface-card p-4">
              <p className="eyebrow">Filter</p>
              <div className="mt-4 space-y-3">
                <input
                  className="field-base"
                  placeholder="Cari nama, dept, role"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select
                  className="field-base"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="">Semua kategori</option>
                  <option value="A Player">A Player</option>
                  <option value="B Solid Player">B Solid Player</option>
                  <option value="B Player">B Player</option>
                  <option value="C Player">C Player</option>
                </select>
                <select
                  className="field-base"
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                >
                  <option value="">Semua departemen</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <select
                  className="field-base"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as 'newest' | 'highest' | 'lowest' | 'name')
                  }
                >
                  <option value="newest">Terbaru</option>
                  <option value="highest">Skor tertinggi</option>
                  <option value="lowest">Skor terendah</option>
                  <option value="name">Nama</option>
                </select>
              </div>
            </div>

            <div className="surface-card max-h-[calc(100vh-290px)] overflow-y-auto">
              {filtered.length ? (
                filtered.map((submission) => {
                  const active = submission.id === selectedId
                  return (
                    <button
                      key={submission.id}
                      type="button"
                      onClick={() => setSelectedId(submission.id)}
                      className={`w-full border-b border-border px-4 py-3 text-left last:border-b-0 ${
                        active ? 'bg-panel' : 'bg-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-text">{submission.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                            {submission.dept} | {submission.role}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p
                            className="text-sm"
                            style={{ color: getCategoryColor(submission.scores.finalCategory) }}
                          >
                            {submission.scores.finalScore}
                          </p>
                          <button
                            type="button"
                            className="rounded-field border border-border bg-white px-2 py-1 text-[11px] text-text transition hover:border-gold hover:text-gold"
                            onClick={(event) => {
                              event.stopPropagation()
                              quickPrint(submission.id)
                            }}
                          >
                            Print
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xs text-muted">{submission.scores.finalCategory}</p>
                        <p className="text-xs text-muted">
                          {new Date(submission.timestamp).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="p-5 text-sm text-muted">Tidak ada submission yang cocok.</div>
              )}
            </div>
          </aside>

          <section>
            {selected ? (
              <LeaderDetail
                submission={selected}
                notes={notes}
                onChangeNotes={setNotes}
                onSaveNotes={saveNotes}
                onExportPdf={exportSelectedPdf}
                onDelete={deleteSelected}
                onAnalyze={runAnalysis}
                savingNotes={savingNotes}
                deleting={deleting}
                analyzing={analyzing}
              />
            ) : (
              <div className="surface-card flex min-h-[360px] items-center justify-center p-8 text-sm text-muted">
                Belum ada submission yang dipilih.
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

function LeaderDetail({
  submission,
  notes,
  onChangeNotes,
  onSaveNotes,
  onExportPdf,
  onDelete,
  onAnalyze,
  savingNotes,
  deleting,
  analyzing,
}: {
  submission: Submission
  notes: string
  onChangeNotes: (value: string) => void
  onSaveNotes: () => void
  onExportPdf: () => void
  onDelete: () => void
  onAnalyze: () => void
  savingNotes: boolean
  deleting: boolean
  analyzing: boolean
}) {
  const categoryColor = getCategoryColor(submission.scores.finalCategory)
  const flags = getProfileFlagDefinitions(submission.scores.profileFlags)
  const alerts = getDimensionAlerts(submission.scores.dims)
  const layer1Statuses = getLayer1GateStatuses(submission.scores.dims)

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="surface-card p-5">
          <p className="eyebrow">Selected Submission</p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl sm:text-[2rem]">{submission.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {submission.dept} | {submission.role} | {submission.tenure}
              </p>
              <p className="mt-1.5 text-sm text-muted">
                Submit{' '}
                {new Date(submission.timestamp).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="rounded-card border border-border bg-panel px-4 py-4 lg:min-w-[220px]">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Final Category</p>
              <p className="mt-2 text-2xl leading-tight" style={{ color: categoryColor }}>
                {submission.scores.finalCategory}
              </p>
              <p className="mt-2 text-sm text-muted">Final score {submission.scores.finalScore}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <TimingCard label="Mulai" value={formatDateTime(submission.timings.startedAt)} />
            <TimingCard label="Selesai" value={formatDateTime(submission.timings.finishedAt)} />
            <TimingCard label="Total Waktu" value={formatDurationText(submission.timings.totalSeconds)} />
            <TimingCard
              label="Sesi 1 · Tetrad"
              value={formatRangeWithDuration(submission.timings.tetrad.start, submission.timings.tetrad.end)}
            />
            <TimingCard
              label="Sesi 2 · ML-SJT"
              value={formatRangeWithDuration(submission.timings.sjt.start, submission.timings.sjt.end)}
            />
            <TimingCard
              label="Sesi 3 · Feedback (Opsional)"
              value={formatRangeWithDuration(submission.timings.essay.start, submission.timings.essay.end, true)}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Weighted Score" value={String(submission.scores.weightedScore)} />
            <StatCard label="Gate 1" value={submission.scores.gate1.passed ? 'Passed' : 'Failed'} />
            <StatCard label="Gate 2" value={submission.scores.gate2.passed ? 'Passed' : 'Failed'} />
            <StatCard label="Raw Category" value={submission.scores.rawCategory} />
          </div>

          {submission.scores.downgradeReason ? (
            <div className="mt-4 rounded-card border border-border bg-panel p-4 text-sm leading-7 text-muted">
              <span className="text-text">Downgrade reason:</span>{' '}
              {submission.scores.downgradeReason}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="surface-card p-5">
            <p className="eyebrow">Actions</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Buka report PDF peserta atau hapus data jika memang perlu dibersihkan dari dashboard.
            </p>
            <div className="mt-5 rounded-card border border-border bg-panel p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Peserta aktif</p>
              <p className="mt-2 text-sm font-medium text-text">{submission.name}</p>
              <p className="mt-1 text-sm text-muted">
                {submission.scores.finalCategory} | Score {submission.scores.finalScore}
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              <button type="button" className="btn-primary w-full" onClick={onExportPdf}>
                Print Report PDF
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-field border border-[#d9b7a5] bg-[#fff3eb] px-4 py-3 text-sm font-medium text-[#9a5c43] transition-colors hover:bg-[#fbe5d8]"
                onClick={onDelete}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus Data Peserta'}
              </button>
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Leader Notes</p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Simpan observasi interview, referensi, dan keputusan tindak lanjut.
                </p>
              </div>
              <div className="flex gap-3">
                {AI_ENABLED ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? 'Analyzing...' : 'Analisis AI'}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="btn-primary"
                  onClick={onSaveNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? 'Saving...' : 'Simpan Notes'}
                </button>
              </div>
            </div>
            <textarea
              className="field-base mt-5 min-h-[220px] resize-y"
              value={notes}
              onChange={(event) => onChangeNotes(event.target.value)}
              placeholder="Tulis catatan leader..."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="Strengths" items={submission.scores.strengths} />
        <InfoCard title="Gaps" items={submission.scores.gaps} />
        <div className="surface-card p-5">
          <p className="eyebrow">Profile Flags</p>
          <div className="mt-5 space-y-3">
            {flags.length ? (
              flags.map((flag) => (
                <div key={flag.key} className="rounded-card border border-border bg-panel p-4">
                  <p className="text-sm text-text">{flag.label}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{flag.description}</p>
                  <p className="mt-2 text-xs leading-6 text-muted">{flag.placement}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Tidak ada profile flag aktif.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card p-5">
          <p className="eyebrow">13 Dimension Breakdown</p>
          <div className="mt-5 space-y-4">
            {Object.entries(submission.scores.dims).map(([key, score]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text">
                      {dimensions[key as keyof typeof dimensions].label}
                    </p>
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
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">{status.status}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {status.score}% | gate {status.gateThreshold}% | critical {status.criticalThreshold}%
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
                  <div
                    key={`${alert.key}-${alert.level}`}
                    className="rounded-card border border-border bg-panel p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-text">{alert.label}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">{alert.level}</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted">{alert.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">Tidak ada alerts khusus.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={AI_ENABLED ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]' : 'grid gap-4'}>
        <div className="surface-card p-5">
          <p className="eyebrow">Kritik, Saran, dan Ide</p>
          <div className="mt-5 space-y-4">
            {essayQuestions.map((question, index) => (
              <div key={question.code} className="rounded-card border border-border bg-panel p-4">
                <p className="text-sm text-text">
                  {question.code} | {question.question}
                </p>
                <p className="mt-2 text-xs leading-6 text-muted">{question.hint}</p>
                <p className="mt-4 text-sm leading-7 text-text">{submission.essayAnswers[index]}</p>
              </div>
            ))}
          </div>
        </div>

        {AI_ENABLED ? (
          <div className="surface-card p-5">
            <p className="eyebrow">AI Essay Analysis</p>
            {submission.aiResult ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-card border border-border bg-panel p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-text">{submission.aiResult.kategori}</p>
                    <p className="text-sm text-gold">{submission.aiResult.skor}</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {submission.aiResult.ringkasan}
                  </p>
                </div>
                <InfoCard title="Pola" items={submission.aiResult.pola} compact />
                <InfoCard title="Kekuatan" items={submission.aiResult.kekuatan} compact />
                <InfoCard title="Risiko" items={submission.aiResult.risiko} compact />
                <div className="rounded-card border border-border bg-panel p-4">
                  <p className="text-sm leading-7 text-muted">
                    {submission.aiResult.rekomendasi}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-muted">
                Belum ada hasil AI. Jalankan analisis setelah notes leader siap.
              </p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2.5 text-xl font-semibold text-text">{value}</p>
    </div>
  )
}

function TimingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-panel px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1.5 text-sm text-text">{value}</p>
    </div>
  )
}

function formatDateTime(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
}

function formatClock(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatDurationText(seconds?: number | null) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '-'
  const totalSeconds = Math.max(0, Math.round(seconds))
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  if (hours > 0) {
    return `${hours}j ${remainingMins}m${secs ? ` ${secs}d` : ''}`.trim()
  }
  if (mins > 0) {
    return `${mins}m${secs ? ` ${secs}d` : ''}`.trim()
  }
  return `${secs}d`
}

function diffSeconds(start?: string, end?: string) {
  if (!start || !end) return null
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null
  return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 1000))
}

function formatRangeWithDuration(start?: string, end?: string, allowEmpty = false) {
  if (!start && !end) return allowEmpty ? '-' : 'Belum tercatat'
  const range = start && end ? `${formatClock(start)} - ${formatClock(end)}` : start ? `Mulai ${formatClock(start)}` : `Selesai ${formatClock(end)}`
  const duration = diffSeconds(start, end)
  return duration !== null ? `${range} • ${formatDurationText(duration)}` : range
}

function InfoCard({
  title,
  items,
  compact = false,
}: {
  title: string
  items: string[]
  compact?: boolean
}) {
  return (
    <div className={compact ? 'rounded-card border border-border bg-panel p-4' : 'surface-card p-5'}>
      <p className={compact ? 'text-xs uppercase tracking-[0.18em] text-gold' : 'eyebrow'}>
        {title}
      </p>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item} className="rounded-card border border-border bg-panel p-4 text-sm leading-7 text-text">
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-card border border-border bg-panel p-4 text-sm text-muted">
            Tidak ada data.
          </div>
        )}
      </div>
    </div>
  )
}

function Banner({ tone, text }: { tone: 'info' | 'error'; text: string }) {
  return (
    <div
      className={`mt-6 rounded-card border px-4 py-3 text-sm ${
        tone === 'info'
          ? 'border-border bg-panel text-gold'
          : 'border-danger bg-danger/10 text-[#f3c0c0]'
      }`}
    >
      {text}
    </div>
  )
}

function buildLeaderPdfHtml(submission: Submission, currentNotes: string) {
  const categoryColor = getCategoryColor(submission.scores.finalCategory)
  const flags = getProfileFlagDefinitions(submission.scores.profileFlags)
  const layer1Statuses = getLayer1GateStatuses(submission.scores.dims)
  const alerts = getDimensionAlerts(submission.scores.dims)
  const notes = currentNotes.trim() || submission.leaderNotes || '-'

  const scoreCards = [
    ['Final Category', submission.scores.finalCategory],
    ['Final Score', String(submission.scores.finalScore)],
    ['Raw Category', submission.scores.rawCategory],
    ['Weighted Score', String(submission.scores.weightedScore)],
    ['Gate 1', submission.scores.gate1.passed ? 'Passed' : 'Failed'],
    ['Gate 2', submission.scores.gate2.passed ? 'Passed' : 'Failed'],
  ]

  const dimsHtml = Object.entries(submission.scores.dims)
    .map(
      ([key, score]) => `
        <tr>
          <td>${escapeHtml(dimensions[key as keyof typeof dimensions].label)}</td>
          <td>${score}%</td>
        </tr>`,
    )
    .join('')

  const flagsHtml = (flags.length ? flags : [{ label: 'Tidak ada profile flag aktif.', description: '' }])
    .map(
      (flag) => `
        <div class="chip-block">
          <div class="chip-title">${escapeHtml(flag.label)}</div>
          ${flag.description ? `<div class="chip-copy">${escapeHtml(flag.description)}</div>` : ''}
        </div>`,
    )
    .join('')

  const alertsHtml = (alerts.length ? alerts : [{ label: 'Tidak ada alert khusus.', level: 'info', description: '' }])
    .map(
      (alert) => `
        <div class="chip-block">
          <div class="chip-title">${escapeHtml(alert.label)} | ${escapeHtml(alert.level.toUpperCase())}</div>
          ${alert.description ? `<div class="chip-copy">${escapeHtml(alert.description)}</div>` : ''}
        </div>`,
    )
    .join('')

  const gateHtml = layer1Statuses
    .map(
      (status) => `
        <tr>
          <td>${escapeHtml(status.label)}</td>
          <td>${status.score}%</td>
          <td>${escapeHtml(status.status)}</td>
        </tr>`,
    )
    .join('')

  const feedbackHtml = essayQuestions
    .map(
      (question, index) => `
        <div class="qa-block">
          <div class="qa-title">${escapeHtml(question.code)} | ${escapeHtml(question.question)}</div>
          <div class="qa-copy">${formatMultilineHtml(submission.essayAnswers[index] || '-')}</div>
        </div>`,
    )
    .join('')

  const strengthsHtml = submission.scores.strengths
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')

  const gapsHtml = submission.scores.gaps
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(submission.name)} | Mandalika Assessment Report</title>
    <style>
      :root {
        --bg: #f7f2e8;
        --surface: #fffdf9;
        --panel: #f8f2e8;
        --text: #2f3944;
        --muted: #66727f;
        --border: rgba(151, 117, 56, 0.2);
        --gold: #b99246;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.55;
      }
      .page {
        padding: 28px;
      }
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
      }
      .eyebrow {
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--gold);
        font-weight: 700;
      }
      h1 {
        margin: 10px 0 8px;
        font-size: 30px;
        line-height: 1.05;
      }
      h2 {
        margin: 0 0 14px;
        font-size: 18px;
      }
      .muted {
        color: var(--muted);
        font-size: 13px;
      }
      .grid {
        display: grid;
        gap: 14px;
      }
      .grid-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .grid-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .metric {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 14px;
      }
      .metric-label {
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .metric-value {
        margin-top: 8px;
        font-size: 24px;
        font-weight: 700;
        color: ${categoryColor};
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      th, td {
        text-align: left;
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
      }
      th {
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
      }
      ul {
        margin: 10px 0 0;
        padding-left: 18px;
      }
      li {
        margin: 6px 0;
      }
      .chip-block, .qa-block {
        border: 1px solid var(--border);
        background: var(--panel);
        border-radius: 10px;
        padding: 14px;
        margin-bottom: 10px;
      }
      .chip-title, .qa-title {
        font-size: 13px;
        font-weight: 700;
      }
      .chip-copy, .qa-copy {
        margin-top: 8px;
        font-size: 13px;
        color: var(--muted);
        white-space: normal;
      }
      .notes {
        font-size: 13px;
      }
      @media print {
        body { background: white; }
        .page { padding: 0; }
        .card { break-inside: avoid; box-shadow: none; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <section class="card">
        <div class="eyebrow">Leader PDF Report</div>
        <h1>${escapeHtml(submission.name)}</h1>
        <div class="muted">${escapeHtml([submission.dept, submission.role, submission.tenure].filter(Boolean).join(' | '))}</div>
        <div class="muted">Submitted ${escapeHtml(new Date(submission.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</div>
      </section>

      <section class="card">
        <h2>Ringkasan Hasil</h2>
        <div class="grid grid-3">
          ${scoreCards
            .map(
              ([label, value]) => `
                <div class="metric">
                  <div class="metric-label">${escapeHtml(label)}</div>
                  <div class="metric-value">${escapeHtml(value)}</div>
                </div>`,
            )
            .join('')}
        </div>
      </section>

      <section class="grid grid-2">
        <div class="card">
          <h2>Strengths</h2>
          <ul>${strengthsHtml || '<li>-</li>'}</ul>
        </div>
        <div class="card">
          <h2>Gaps</h2>
          <ul>${gapsHtml || '<li>-</li>'}</ul>
        </div>
      </section>

      <section class="grid grid-2">
        <div class="card">
          <h2>Profile Flags</h2>
          ${flagsHtml}
        </div>
        <div class="card">
          <h2>Dimension Alerts</h2>
          ${alertsHtml}
        </div>
      </section>

      <section class="grid grid-2">
        <div class="card">
          <h2>Gate 1 Status</h2>
          <table>
            <thead>
              <tr>
                <th>Dimensi</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${gateHtml}</tbody>
          </table>
        </div>
        <div class="card">
          <h2>13 Dimension Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Dimensi</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>${dimsHtml}</tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h2>Kritik, Saran, dan Ide</h2>
        ${feedbackHtml}
      </section>

      <section class="card">
        <h2>Leader Notes</h2>
        <div class="notes">${formatMultilineHtml(notes)}</div>
      </section>
    </div>
  </body>
</html>`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatMultilineHtml(value: string) {
  return escapeHtml(value || '-').replace(/\n/g, '<br />')
}

function letter(index: number) {
  return ['A', 'B', 'C', 'D'][index] || ''
}

