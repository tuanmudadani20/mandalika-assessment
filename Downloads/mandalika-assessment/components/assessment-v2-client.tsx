/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BEI_QUESTIONS, DIMENSIONS, SJT_QUESTIONS, TETRADS } from '@/lib/question-bank'
import {
  aggregateBEIScores,
  calculateSJTScores,
  calculateTetradScores,
  classifyABCPlayer,
  computeFinalScores,
  detectFakingAlert,
  evaluateLayer1Gate,
  type BEIEvaluation,
  type SJTAnswerV2,
  type TetradAnswerV2,
} from '@/lib/scoring-v2'

type Phase = 'identity' | 'p1a' | 'p1b' | 'p2' | 'review' | 'submitting' | 'done'
const DRAFT_KEY = 'mandalika-assessment-v2-draft'

const TETRAD_SECONDS = 20 * 60
const SJT_SECONDS = 10 * 60
const BEI_SECONDS = 35 * 60

export function AssessmentV2Client() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('identity')
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [tetradAnswers, setTetradAnswers] = useState<TetradAnswerV2[]>([])
  const [sjtAnswers, setSjtAnswers] = useState<SJTAnswerV2[]>([])
  const [beiAnswers, setBeiAnswers] = useState<Record<string, string>>({})
  const [tSeconds, setTSeconds] = useState(TETRAD_SECONDS)
  const [sjtSeconds, setSjtSeconds] = useState(SJT_SECONDS)
  const [beiSeconds, setBeiSeconds] = useState(BEI_SECONDS)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          name: string
          position: string
          tetradAnswers: TetradAnswerV2[]
          sjtAnswers: SJTAnswerV2[]
          beiAnswers: Record<string, string>
          phase: Phase
          tSeconds: number
          sjtSeconds: number
          beiSeconds: number
        }>
        setName(parsed.name ?? '')
        setPosition(parsed.position ?? '')
        setTetradAnswers(parsed.tetradAnswers ?? [])
        setSjtAnswers(parsed.sjtAnswers ?? [])
        setBeiAnswers(parsed.beiAnswers ?? {})
        setPhase(parsed.phase ?? 'identity')
        setTSeconds(parsed.tSeconds ?? TETRAD_SECONDS)
        setSjtSeconds(parsed.sjtSeconds ?? SJT_SECONDS)
        setBeiSeconds(parsed.beiSeconds ?? BEI_SECONDS)
      }
    } catch {}
  }, [])

  // autosave
  useEffect(() => {
    const data = {
      name,
      position,
      tetradAnswers,
      sjtAnswers,
      beiAnswers,
      phase,
      tSeconds,
      sjtSeconds,
      beiSeconds,
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    } catch {}
  }, [name, position, tetradAnswers, sjtAnswers, beiAnswers, phase, tSeconds, sjtSeconds, beiSeconds])

  // timers
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    if (phase === 'p1a') timers.push(setInterval(() => setTSeconds((v) => Math.max(0, v - 1)), 1000))
    if (phase === 'p1b') timers.push(setInterval(() => setSjtSeconds((v) => Math.max(0, v - 1)), 1000))
    if (phase === 'p2') timers.push(setInterval(() => setBeiSeconds((v) => Math.max(0, v - 1)), 1000))
    return () => {
      timers.forEach((t) => clearInterval(t))
    }
  }, [phase])

  const tetradProgress = tetradAnswers.length
  const sjtProgress = sjtAnswers.length
  const beiProgress = Object.values(beiAnswers).filter((v) => (v || '').trim().length > 0).length

  const canGoP1a = name.trim() && position.trim()
  const canSubmit = tetradProgress === TETRADS.length && sjtProgress === SJT_QUESTIONS.length && beiProgress === BEI_QUESTIONS.length

  const setTetradRanking = (tetradId: string, idx: number, rank: number) => {
    setTetradAnswers((prev) => {
      const existing = prev.find((p) => p.tetradId === tetradId)
      const others = prev.filter((p) => p.tetradId !== tetradId)
      const rankings = existing?.rankings ? [...existing.rankings] : [0, 0, 0, 0]
      rankings[idx] = rank
      // pastikan unik: hapus rank yang sama di indeks lain
      rankings.forEach((val, i) => {
        if (i !== idx && val === rank) rankings[i] = 0
      })
      return [...others, { tetradId, rankings }]
    })
  }

  const setSjtChoice = (questionId: string, key: string) => {
    setSjtAnswers((prev) => {
      const others = prev.filter((p) => p.questionId !== questionId)
      return [...others, { questionId, chosenKey: key }]
    })
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Pastikan semua phase terisi.')
      return
    }
    setError('')
    setLoading(true)
    setPhase('submitting')
    try {
      // evaluate BEI locally (placeholder API)
      const beiEvaluations: BEIEvaluation[] = []
      for (const q of BEI_QUESTIONS) {
        const answer = beiAnswers[q.id] || ''
        const resp = await fetch('/api/bei-eval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: q.id, answer }),
        })
        const data = (await resp.json().catch(() => ({}))) as BEIEvaluation
        beiEvaluations.push({
          questionId: q.id,
          score: data.score ?? 2,
          strengths: data.strengths ?? [],
          concerns: data.concerns ?? [],
          follow_up_needed: data.follow_up_needed ?? false,
          follow_up_question: data.follow_up_question ?? null,
        })
      }

      const tetradScores = calculateTetradScores(tetradAnswers)
      const sjtScores = calculateSJTScores(sjtAnswers)
      const beiScores = aggregateBEIScores(beiEvaluations)
      const layer1Gate = evaluateLayer1Gate(tetradScores, sjtScores)
      const fakingAlert = detectFakingAlert(tetradAnswers)
      const finalScores = computeFinalScores(tetradScores, sjtScores, beiScores)
      const classification = classifyABCPlayer(finalScores, layer1Gate, fakingAlert)

      const payload = {
        name,
        position,
        tetradAnswers,
        sjtAnswers,
        beiAnswers: BEI_QUESTIONS.map((q) => ({
          questionId: q.id,
          answer: beiAnswers[q.id] || '',
          evaluation: beiEvaluations.find((b) => b.questionId === q.id),
        })),
        tetradScores,
        sjtScores,
        beiScores,
        finalScores,
        layer1Gate,
        fakingAlert,
        classification: classification.classification,
      }

      const resp = await fetch('/api/submit-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || !data.id) throw new Error(data.error || 'Gagal submit assessment v2.')

      localStorage.removeItem(DRAFT_KEY)
      router.push(`/leader-v2?id=${data.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal submit.')
      setPhase('review')
    } finally {
      setLoading(false)
    }
  }

  const currentTimer =
    phase === 'p1a' ? tSeconds : phase === 'p1b' ? sjtSeconds : phase === 'p2' ? beiSeconds : null

  const fmt = (s: number | null) => {
    if (s === null) return ''
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const currentIdx = phase === 'p1a' ? tetradProgress : phase === 'p1b' ? sjtProgress : beiProgress
  const currentTotal = phase === 'p1a' ? TETRADS.length : phase === 'p1b' ? SJT_QUESTIONS.length : BEI_QUESTIONS.length

  return (
    <div className="min-h-screen bg-ink px-4 py-4">
      <header className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <p className="eyebrow">Assessment v2</p>
          <h1 className="text-xl font-semibold">33 Tetrad · 30 SJT · 5 BEI</h1>
        </div>
        <div className="text-sm text-muted">
          Phase: {phase.toUpperCase()} {currentTimer !== null ? `| Timer ${fmt(currentTimer)}` : ''}
        </div>
      </header>

      {error ? <div className="mt-3 rounded-card border border-danger bg-danger/10 px-4 py-3 text-sm text-[#f3c0c0]">{error}</div> : null}

      {phase === 'identity' && (
        <section className="mt-4 space-y-3">
          <p className="text-sm text-muted">Isi identitas singkat sebelum mulai.</p>
          <input className="field-base" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="field-base" placeholder="Posisi / Jabatan" value={position} onChange={(e) => setPosition(e.target.value)} />
          <button className="btn-primary" disabled={!canGoP1a} onClick={() => setPhase('p1a')}>
            Mulai Phase 1A
          </button>
        </section>
      )}

      {phase === 'p1a' && (
        <section className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Phase 1A · Tetrad (33)</h2>
          <p className="text-sm text-muted">Rank 1-4 (1 = paling sesuai, 4 = paling tidak).</p>
          {TETRADS.map((tetrad) => {
            const answer = tetradAnswers.find((a) => a.tetradId === tetrad.id)
            return (
              <div key={tetrad.id} className="rounded-card border border-border bg-white p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{tetrad.id}</span>
                  <span className="text-muted">type: {tetrad.type}</span>
                </div>
                {tetrad.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-semibold text-muted">A{idx + 1}</span>
                    <p className="flex-1 text-sm">{item.text}</p>
                    <select
                      className="field-base w-24"
                      value={answer?.rankings?.[idx] || ''}
                      onChange={(e) => setTetradRanking(tetrad.id, idx, Number(e.target.value))}
                    >
                      <option value="">Rank</option>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )
          })}
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setPhase('identity')}>
              Kembali
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                const incomplete = TETRADS.find((t) => {
                  const ans = tetradAnswers.find((a) => a.tetradId === t.id)
                  const ranks = ans?.rankings ?? []
                  const hasAll = ranks.length === 4 && [1, 2, 3, 4].every((r) => ranks.includes(r))
                  return !hasAll
                })
                if (incomplete) {
                  setError(`Tetrad ${incomplete.id} belum lengkap (rank 1-4 harus unik).`)
                  return
                }
                setError('')
                setPhase('p1b')
              }}
            >
              Lanjut Phase 1B
            </button>
          </div>
        </section>
      )}

      {phase === 'p1b' && (
        <section className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Phase 1B · ML-SJT (30)</h2>
          {SJT_QUESTIONS.map((q) => {
            const choice = sjtAnswers.find((a) => a.questionId === q.id)?.chosenKey
            return (
              <div key={q.id} className="rounded-card border border-border bg-white p-3 space-y-2">
                <div className="text-sm font-medium">{q.id}</div>
                <p className="text-sm text-muted">{q.scenario}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => (
                    <label key={opt.key} className="flex items-start gap-2 rounded-card border border-border bg-panel p-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        checked={choice === opt.key}
                        onChange={() => setSjtChoice(q.id, opt.key)}
                      />
                      <span>
                        <strong className="mr-1">{opt.key}.</strong>
                        {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setPhase('p1a')}>
              Kembali
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                const missing = SJT_QUESTIONS.find((q) => !sjtAnswers.find((a) => a.questionId === q.id))
                if (missing) {
                  setError(`SJT ${missing.id} belum dipilih.`)
                  return
                }
                setError('')
                setPhase('p2')
              }}
            >
              Lanjut Phase 2 (BEI)
            </button>
          </div>
        </section>
      )}

      {phase === 'p2' && (
        <section className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Phase 2 · BEI (5)</h2>
          {BEI_QUESTIONS.map((q) => (
            <div key={q.id} className="rounded-card border border-border bg-white p-3 space-y-2">
              <div className="text-sm font-medium">{q.id} · {q.question}</div>
              <textarea
                className="field-base min-h-[140px]"
                value={beiAnswers[q.id] || ''}
                onChange={(e) => setBeiAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Jawab dengan format STAR (Situation, Task, Action, Result)."
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setPhase('p1b')}>
              Kembali
            </button>
            <button className="btn-primary" disabled={loading} onClick={() => setPhase('review')}>
              Review & Submit
            </button>
          </div>
        </section>
      )}

      {phase === 'review' && (
        <section className="mt-4 space-y-3">
          <h2 className="text-lg font-semibold">Review & Submit</h2>
          <p className="text-sm text-muted">Tetrad {tetradProgress}/{TETRADS.length} · SJT {sjtProgress}/{SJT_QUESTIONS.length} · BEI {beiProgress}/{BEI_QUESTIONS.length}</p>
          <button className="btn-primary" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Mengirim...' : 'Kirim Assessment v2'}
          </button>
        </section>
      )}

      {phase === 'submitting' && (
        <section className="mt-6">
          <div className="rounded-card border border-border bg-white p-6 text-center">
            <p className="eyebrow">Submitting</p>
            <p className="mt-2 text-lg">Menyimpan assessment v2...</p>
          </div>
        </section>
      )}
    </div>
  )
}
