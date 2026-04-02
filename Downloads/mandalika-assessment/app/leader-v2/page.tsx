'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Submission = {
  id: string
  name: string
  position: string
  timestamp: string
  finalScores: Record<string, number>
  classification: string
  layer1Gate: { overallPassed: boolean }
  fakingAlert: { hasFakingAlert: boolean }
}

export default function LeaderV2Page() {
  const [pw, setPw] = useState('')
  const [sessionPw, setSessionPw] = useState('')
  const [subs, setSubs] = useState<Submission[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async (password: string) => {
    const resp = await fetch(`/api/results-v2?pw=${encodeURIComponent(password)}`)
    const data = await resp.json().catch(() => ([]))
    if (!resp.ok) throw new Error(data.error || 'Gagal load results v2')
    setSubs(data)
  }

  const login = async () => {
    setError('')
    setLoading(true)
    try {
      await load(pw)
      setSessionPw(pw)
      setPw('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    if (!sessionPw) return
    setLoading(true)
    try {
      await load(sessionPw)
    } finally {
      setLoading(false)
    }
  }

  const summary = useMemo(() => {
    const total = subs.length
    const gatePassed = subs.filter((s) => s.layer1Gate?.overallPassed).length
    const faking = subs.filter((s) => s.fakingAlert?.hasFakingAlert).length
    const avg = avgScore(subs.map((s) => s.finalScores))
    return { total, gatePassed, faking, avg }
  }, [subs])

  const exportCsv = () => {
    if (!subs.length) return
    const headers = ['id', 'nama', 'posisi', 'timestamp', 'final_avg', 'classification', 'gate_l1', 'faking']
    const rows = subs.map((s) => [
      s.id,
      wrap(s.name),
      wrap(s.position),
      new Date(s.timestamp).toISOString(),
      avgScore([s.finalScores]),
      s.classification,
      s.layer1Gate?.overallPassed ? 'PASS' : 'FAIL',
      s.fakingAlert?.hasFakingAlert ? 'YES' : 'NO',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessment-v2-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    // sengaja tidak auto-login demi keamanan
  }, [])

  return (
    <main className="min-h-screen bg-ink px-6 py-6">
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Leader v2</p>
          <h1 className="text-2xl font-semibold">Assessment v2 Dashboard</h1>
          {sessionPw ? (
            <p className="text-xs text-muted">Autentikasi ok · {subs.length} submission · {loading ? 'Memuat...' : 'Siap'}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-secondary" href="/assessment-v2">Buka Assessment v2</Link>
          <Link className="btn-secondary" href="/leader">Dashboard v1</Link>
          {sessionPw ? <button className="btn-secondary" onClick={refresh}>Reload</button> : null}
        </div>
      </header>

      {!sessionPw ? (
        <section className="mt-6 max-w-sm space-y-3">
          <input className="field-base" type="password" placeholder="Password leader" value={pw} onChange={(e) => setPw(e.target.value)} />
          {error ? <div className="rounded-card border border-danger bg-danger/10 px-3 py-2 text-sm text-[#f3c0c0]">{error}</div> : null}
          <button className="btn-primary w-full" onClick={login} disabled={loading}>{loading ? 'Memuat...' : 'Masuk'}</button>
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Total Submisi" value={summary.total} />
            <Stat label="Lolos Gate L1" value={`${summary.gatePassed}/${summary.total}`} hint="Gate CSS" />
            <Stat label="Faking Alert" value={summary.faking} hint="Butuh validasi manual" />
            <Stat label="Rata Final" value={`${summary.avg}%`} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={exportCsv}>Export CSV</button>
          </div>

          {subs.length === 0 ? <p className="text-sm text-muted">Belum ada submission v2.</p> : null}
          <div className="grid gap-3 md:grid-cols-2">
            {subs.map((s) => (
              <article key={s.id} className="rounded-card border border-border bg-white p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted">{s.position}</p>
                  </div>
                  <span className="rounded-field border px-2 py-1 text-xs">{s.classification}</span>
                </div>
                <p className="text-xs text-muted">{new Date(s.timestamp).toLocaleString('id-ID')}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge ok={s.layer1Gate?.overallPassed}>Gate L1 {s.layer1Gate?.overallPassed ? 'Lolos' : 'Fail'}</Badge>
                  <Badge ok={!s.fakingAlert?.hasFakingAlert}>Faking {s.fakingAlert?.hasFakingAlert ? 'Alert' : 'Bersih'}</Badge>
                  <Badge ok>{avgScore([s.finalScores])}% rata</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link className="btn-secondary px-3 py-1 text-xs" href={`/result-v2/${s.id}`}>Lihat hasil</Link>
                  <Link className="btn-secondary px-3 py-1 text-xs" href={`/print-v2/${s.id}?pw=${encodeURIComponent(sessionPw)}`}>Print PDF</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function wrap(value: string) {
  const v = value.replace(/"/g, '""')
  return `"${v}"`
}

function avgScore(arr: Record<string, number>[]) {
  if (!arr.length) return 0
  const vals = arr.flatMap((obj) => Object.values(obj || {}))
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {hint ? <p className="text-[11px] text-muted">{hint}</p> : null}
    </div>
  )
}

function Badge({ ok = true, children }: { ok?: boolean; children: React.ReactNode }) {
  return (
    <span className={`rounded-field border px-2 py-1 ${ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
      {children}
    </span>
  )
}
