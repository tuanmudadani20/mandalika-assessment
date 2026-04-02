'use client'

import { useEffect, useState } from 'react'
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

  const load = async (password: string) => {
    const resp = await fetch(`/api/results-v2?pw=${encodeURIComponent(password)}`)
    const data = await resp.json().catch(() => ([]))
    if (!resp.ok) throw new Error(data.error || 'Gagal load results v2')
    setSubs(data)
  }

  const login = async () => {
    setError('')
    try {
      await load(pw)
      setSessionPw(pw)
      setPw('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal login')
    }
  }

  useEffect(() => {
    // auto login with stored?
  }, [])

  return (
    <main className="min-h-screen bg-ink px-6 py-6">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="eyebrow">Leader v2</p>
          <h1 className="text-2xl font-semibold">Assessment v2 Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link className="btn-secondary" href="/assessment-v2">Buka Assessment v2</Link>
          <Link className="btn-secondary" href="/leader">Dashboard v1</Link>
        </div>
      </header>

      {!sessionPw ? (
        <section className="mt-6 max-w-sm space-y-3">
          <input className="field-base" type="password" placeholder="Password leader" value={pw} onChange={(e) => setPw(e.target.value)} />
          {error ? <div className="rounded-card border border-danger bg-danger/10 px-3 py-2 text-sm text-[#f3c0c0]">{error}</div> : null}
          <button className="btn-primary w-full" onClick={login}>Masuk</button>
        </section>
      ) : (
        <section className="mt-6 space-y-3">
          {subs.length === 0 ? <p className="text-sm text-muted">Belum ada submission v2.</p> : null}
          <div className="grid gap-3 md:grid-cols-2">
            {subs.map((s) => (
              <article key={s.id} className="rounded-card border border-border bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted">{s.position}</p>
                  </div>
                  <span className="rounded-field border px-2 py-1 text-xs">{s.classification}</span>
                </div>
                <p className="text-xs text-muted">{new Date(s.timestamp).toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted">Layer1 gate: {s.layer1Gate?.overallPassed ? 'Lolos' : 'Fail'} · Faking: {s.fakingAlert?.hasFakingAlert ? 'Ya' : 'Tidak'}</p>
                <p className="text-xs text-muted">Rata final: {avgScore(s.finalScores)}%</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function avgScore(obj: Record<string, number>) {
  const vals = Object.values(obj || {})
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}
