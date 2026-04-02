'use client'

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { essayQuestions, sjtQuestions, tetradQuestions } from '@/lib/assessment-data'
import type { SJTAnswer, TetradAnswer } from '@/lib/types'

type Stage = 'intro' | 'tetrad' | 'sjt' | 'essay' | 'submitting'

const DRAFT_KEY = 'mandalika-assessment-draft-v2'
const tenureOptions = ['Kurang dari 6 bulan', '6 bulan - 1 tahun', '1 - 2 tahun', '2 - 5 tahun', 'Lebih dari 5 tahun']
const blankChoice = () => ({ mostIndex: -1, leastIndex: -1 })

export function AssessmentClient() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('intro')
  const [name, setName] = useState('')
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')
  const [tenure, setTenure] = useState('')
  const [tetradIndex, setTetradIndex] = useState(0)
  const [sjtIndex, setSjtIndex] = useState(0)
  const [essayIndex, setEssayIndex] = useState(0)
  const [tetradAnswers, setTetradAnswers] = useState<TetradAnswer[]>(Array.from({ length: tetradQuestions.length }, blankChoice))
  const [sjtAnswers, setSjtAnswers] = useState<SJTAnswer[]>(Array.from({ length: sjtQuestions.length }, blankChoice))
  const [essayAnswers, setEssayAnswers] = useState<string[]>(Array.from({ length: essayQuestions.length }, () => ''))
  const [error, setError] = useState('')
  const [tetradSeconds, setTetradSeconds] = useState(30 * 60) // 30 menit sesi 1
  const [sjtSeconds, setSjtSeconds] = useState(30 * 60) // 30 menit sesi 2
  const [essaySeconds, setEssaySeconds] = useState(30 * 60) // opsional, tidak dikunci waktu

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as {
        stage?: Stage; name?: string; dept?: string; role?: string; tenure?: string
        tetradIndex?: number; sjtIndex?: number; essayIndex?: number
        tetradAnswers?: TetradAnswer[]; sjtAnswers?: SJTAnswer[]; essayAnswers?: string[]
      }
      setStage(draft.stage && draft.stage !== 'submitting' ? draft.stage : 'intro')
      setName(draft.name || ''); setDept(draft.dept || ''); setRole(draft.role || ''); setTenure(draft.tenure || '')
      setTetradIndex(clampIndex(draft.tetradIndex, tetradQuestions.length))
      setSjtIndex(clampIndex(draft.sjtIndex, sjtQuestions.length))
      setEssayIndex(clampIndex(draft.essayIndex, essayQuestions.length))
      setTetradAnswers(normalizeChoiceAnswers(draft.tetradAnswers, tetradQuestions.length))
      setSjtAnswers(normalizeChoiceAnswers(draft.sjtAnswers, sjtQuestions.length))
      setEssayAnswers(normalizeEssayAnswers(draft.essayAnswers, essayQuestions.length))
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    if (stage === 'submitting') return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        stage, name, dept, role, tenure, tetradIndex, sjtIndex, essayIndex, tetradAnswers, sjtAnswers, essayAnswers,
      }))
    } catch {}
  }, [dept, essayAnswers, essayIndex, name, role, sjtAnswers, sjtIndex, stage, tenure, tetradAnswers, tetradIndex])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (stage === 'tetrad') timer = setInterval(() => setTetradSeconds((prev) => Math.max(0, prev - 1)), 1000)
    else if (stage === 'sjt') timer = setInterval(() => setSjtSeconds((prev) => Math.max(0, prev - 1)), 1000)
    else if (stage === 'essay') timer = setInterval(() => setEssaySeconds((prev) => Math.max(0, prev - 1)), 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [stage])

  useEffect(() => {
    if (stage === 'tetrad' && tetradSeconds === 0) {
      setError('Waktu 30 menit untuk sesi 1 sudah habis. Segera kirim jawaban.')
    }
  }, [stage, tetradSeconds])

  useEffect(() => {
    if (stage === 'sjt' && sjtSeconds === 0) {
      setError('Waktu 30 menit untuk sesi 2 sudah habis. Segera kirim jawaban.')
    }
  }, [stage, sjtSeconds])

  const completedTetrad = tetradAnswers.filter(isCompletedChoice).length
  const completedSjt = sjtAnswers.filter(isCompletedChoice).length
  const completedEssay = essayAnswers.length // feedback opsional tetap dihitung selesai
  const totalBlocks = tetradQuestions.length + sjtQuestions.length + essayQuestions.length
  const overallProgress = Math.round(((completedTetrad + completedSjt + completedEssay) / totalBlocks) * 100)
  const canOpenSjt = completedTetrad === tetradQuestions.length || stage === 'sjt' || stage === 'essay'
  const canOpenEssay = completedSjt === sjtQuestions.length || stage === 'essay'

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const timerLabel =
    stage === 'tetrad' ? formatTime(tetradSeconds) : stage === 'sjt' ? formatTime(sjtSeconds) : 'Opsional'
  const isTimerCritical =
    stage === 'tetrad'
      ? tetradSeconds <= 5 * 60
      : stage === 'sjt'
        ? sjtSeconds <= 5 * 60
        : false

  const meta = useMemo(() => {
    if (stage === 'tetrad') return { title: `Tetrad ${tetradIndex + 1}`, subtitle: 'Pilih satu Most dan satu Least dari empat pernyataan.', description: '', current: tetradIndex, total: tetradQuestions.length }
    if (stage === 'sjt') return { title: `ML-SJT ${sjtIndex + 1}`, subtitle: 'Pilih respons yang paling mendekati dan paling tidak mendekati tindakan Anda.', description: sjtQuestions[sjtIndex].scenario, current: sjtIndex, total: sjtQuestions.length }
    if (stage === 'essay') return { title: `Kritik & Saran ${essayIndex + 1}`, subtitle: 'Opsional — berikan kritik, saran, atau ide yang ingin Anda bagi.', description: essayQuestions[essayIndex].question, current: essayIndex, total: essayQuestions.length }
    return { title: 'Identitas Peserta', subtitle: 'Lengkapi data singkat sebelum memulai.', description: '', current: 0, total: 0 }
  }, [essayIndex, sjtIndex, stage, tetradIndex])


  const sessionCards = [
    { key: 'tetrad' as const, part: 'Part 1', label: 'Tetrad Most/Least', progress: `${completedTetrad}/${tetradQuestions.length}`, active: stage === 'tetrad', disabled: false },
    { key: 'sjt' as const, part: 'Part 2', label: 'ML-SJT', progress: `${completedSjt}/${sjtQuestions.length}`, active: stage === 'sjt', disabled: !canOpenSjt },
    { key: 'essay' as const, part: 'Part 3', label: 'Kritik & Saran (Opsional)', progress: `${completedEssay}/${essayQuestions.length}`, active: stage === 'essay', disabled: !canOpenEssay },
  ]

  const startAssessment = () => {
    if (!name.trim() || !dept.trim() || !role.trim() || !tenure.trim()) return setError('Nama, departemen, role, dan masa kerja wajib diisi.')
    setError(''); setStage('tetrad')
  }

  const updateChoice = (type: 'tetrad' | 'sjt', kind: 'mostIndex' | 'leastIndex', value: number) => {
    const setter = type === 'tetrad' ? setTetradAnswers : setSjtAnswers
    const index = type === 'tetrad' ? tetradIndex : sjtIndex
    setter((prev) => {
      const next = [...prev]; const current = { ...next[index] }; current[kind] = value
      if (kind === 'mostIndex' && current.leastIndex === value) current.leastIndex = -1
      if (kind === 'leastIndex' && current.mostIndex === value) current.mostIndex = -1
      next[index] = current; return next
    })
  }

  const submitAssessment = async () => {
    const openTetrad = tetradAnswers.findIndex((answer) => !isCompletedChoice(answer))
    if (openTetrad >= 0) { setStage('tetrad'); setTetradIndex(openTetrad); return setError(`Tetrad ${openTetrad + 1} belum lengkap.`) }
    const openSjt = sjtAnswers.findIndex((answer) => !isCompletedChoice(answer))
    if (openSjt >= 0) { setStage('sjt'); setSjtIndex(openSjt); return setError(`ML-SJT ${openSjt + 1} belum lengkap.`) }
    setError(''); setStage('submitting')
    try {
      const response = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, dept, role, tenure, tetradAnswers, sjtAnswers, essayAnswers }) })
      const data = await response.json().catch(() => ({})) as { id?: string; error?: string }
      if (!response.ok || !data.id) throw new Error(data.error || 'Gagal menyimpan assessment.')
      localStorage.removeItem(DRAFT_KEY); router.push(`/result/${data.id}`)
    } catch (submissionError: unknown) {
      setStage('essay'); setError(submissionError instanceof Error ? submissionError.message : 'Gagal mengirim assessment.')
    }
  }

  const activeNumbers = stage === 'tetrad' ? tetradQuestions.length : stage === 'sjt' ? sjtQuestions.length : essayQuestions.length
  const activeIndex = stage === 'tetrad' ? tetradIndex : stage === 'sjt' ? sjtIndex : essayIndex

  const isNumberDone = (index: number) => {
    if (stage === 'tetrad') return isCompletedChoice(tetradAnswers[index])
    if (stage === 'sjt') return isCompletedChoice(sjtAnswers[index])
    return (essayAnswers[index] || '').trim().length > 0
  }

  const jumpToNumber = (index: number) => {
    setError('')
    if (stage === 'tetrad') setTetradIndex(index)
    else if (stage === 'sjt') setSjtIndex(index)
    else if (stage === 'essay') setEssayIndex(index)
  }

  const nextLabel =
    stage === 'tetrad'
      ? tetradIndex === tetradQuestions.length - 1
        ? 'Lanjut ke ML-SJT'
        : 'Soal Berikutnya'
      : stage === 'sjt'
        ? sjtIndex === sjtQuestions.length - 1
          ? 'Lanjut ke Feedback'
          : 'Soal Berikutnya'
        : essayIndex === essayQuestions.length - 1
          ? 'Kirim Assessment'
          : 'Respons Berikutnya'

  const goPrev = () => {
    setError('')
    if (stage === 'tetrad') {
      if (tetradIndex === 0) setStage('intro')
      else setTetradIndex((value) => value - 1)
    }
    if (stage === 'sjt') {
      if (sjtIndex === 0) setStage('tetrad')
      else setSjtIndex((value) => value - 1)
    }
    if (stage === 'essay') {
      if (essayIndex === 0) setStage('sjt')
      else setEssayIndex((value) => value - 1)
    }
  }

  const goNext = async () => {
    setError('')
    if (stage === 'tetrad') {
      if (!isCompletedChoice(tetradAnswers[tetradIndex])) return setError('Pilih satu Most dan satu Least yang berbeda.')
      if (tetradIndex === tetradQuestions.length - 1) setStage('sjt')
      else setTetradIndex((value) => value + 1)
    } else if (stage === 'sjt') {
      if (!isCompletedChoice(sjtAnswers[sjtIndex])) return setError('Pilih satu Most dan satu Least yang berbeda.')
      if (sjtIndex === sjtQuestions.length - 1) {
        await submitAssessment()
      } else {
        setSjtIndex((value) => value + 1)
      }
    } else if (stage === 'essay') {
      if (essayIndex === essayQuestions.length - 1) {
        void submitAssessment()
      } else {
        setEssayIndex((value) => value + 1)
      }
    }
  }

  return (
    <main className={`${stage === 'intro' ? 'min-h-screen xl:h-screen xl:overflow-hidden' : 'h-screen overflow-hidden'} bg-ink`}>
      <div className="w-full px-2.5 py-2.5 sm:px-3 lg:px-4 xl:px-5">
        <header className="surface-card sticky top-2.5 z-20 px-3.5 py-2.5 sm:px-4">
          <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="eyebrow">Mandalika Talent Assessment</p>
              <h1 className="mt-1.5 text-xl sm:text-2xl">Employee Assessment Center</h1>
              <p className="mt-1 text-[13px] leading-5 text-muted">
                Focused assessment workspace.
              </p>
            </div>
              <div className="min-w-[200px] rounded-card border border-border bg-white px-3.5 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    Progress
                  </p>
                  <p className="text-sm font-medium text-text">{overallProgress}%</p>
                </div>
                <div className="mt-2.5 h-2 rounded-full bg-[#ece4d7]">
                  <div
                    className="h-2 rounded-full bg-gold transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] leading-5 text-muted">Estimasi total waktu: 75 menit</p>
              </div>
          </div>
        </header>

        {stage === 'intro' ? (
          <section className="mt-3 grid min-h-[calc(100vh-104px)] gap-3 xl:grid-cols-[0.84fr_1.16fr]">
            <div className="surface-card flex flex-col justify-between p-4 sm:p-5">
              <div><p className="eyebrow">Assessment Brief</p><h2 className="mt-2.5 max-w-4xl text-[1.8rem] leading-[1.08] sm:text-[1.95rem]">Flow yang rapi, tenang, dan fokus ke pengerjaan.</h2><p className="mt-3 max-w-2xl text-[13px] leading-5 text-muted">Tiga sesi, satu viewport, dan fokus penuh ke kualitas jawaban.</p></div>
              <div className="mt-5 grid gap-2.5 md:grid-cols-3 xl:grid-cols-1">
                {[
                  ['Part 1', '26 Tetrad Most/Least', 'Sekitar 20 menit. Memetakan preferensi perilaku.'],
                  ['Part 2', '26 ML-SJT', 'Sekitar 30 menit. Menguji judgement kerja nyata.'],
                  ['Part 3', '5 Kritik, Saran, dan Ide', 'Opsional, alokasikan 25 menit bila perlu.'],
                ].map(([part, title, detail]) => <div key={part} className="rounded-card border border-border bg-white p-3.5"><p className="text-[10px] uppercase tracking-[0.18em] text-gold">{part}</p><p className="mt-1 text-[15px] font-medium leading-5 text-text">{title}</p><p className="mt-1 text-[13px] leading-5 text-muted">{detail}</p></div>)}
              </div>
            </div>
            <div className="surface-card p-4 sm:p-5">
              <p className="eyebrow">Identitas Peserta</p><h2 className="mt-2.5 text-[1.8rem] leading-[1.08] sm:text-[1.95rem]">Isi data singkat sebelum mulai.</h2>
              <div className="mt-5 grid gap-2.5 md:grid-cols-2">
                <Field label="Nama Lengkap" value={name} onChange={setName} placeholder="Nama lengkap" />
                <Field label="Departemen" value={dept} onChange={setDept} placeholder="Sales, Operations, Finance" />
                <Field label="Role / Posisi" value={role} onChange={setRole} placeholder="Staff, Supervisor, Manager" />
                <label className="space-y-2"><span className="text-sm text-muted">Masa kerja</span><select className="field-base" value={tenure} onChange={(event) => setTenure(event.target.value)}><option value="">Pilih masa kerja</option>{tenureOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              </div>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-3">{[['75', 'Menit total'], ['57', 'Blok'], ['13', 'Dimensi']].map(([value, label]) => <div key={label} className="rounded-card border border-border bg-white p-3"><p className="text-2xl font-semibold leading-none text-[#8f6f36]">{value}</p><p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p></div>)}</div>
              {error ? <ErrorBanner text={error} /> : null}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" className="btn-primary px-4 py-2.5" onClick={startAssessment}>Mulai Assessment</button></div>
            </div>
          </section>
        ) : null}

        {stage !== 'intro' ? (
          <section className="mt-2.5 grid h-[calc(100vh-82px)] gap-2 xl:grid-cols-[minmax(0,1fr)_248px]">
            <section className="order-1 flex h-full min-h-0 flex-col gap-3">
              {error ? <ErrorBanner text={error} /> : null}
              {stage === 'submitting' ? <div className="surface-card flex min-h-[420px] items-center justify-center p-8 text-center"><div><p className="eyebrow">Submitting</p><h2 className="mt-3 text-3xl sm:text-4xl">Menyimpan hasil assessment...</h2><p className="mt-4 text-sm leading-7 text-muted">Sistem sedang menghitung skor dan menyimpan data ke storage.</p></div></div> : null}
              {stage !== 'submitting' ? (
                <QuestionStage
                  stage={stage}
                  meta={meta}
                  tetradIndex={tetradIndex}
                  sjtIndex={sjtIndex}
                  essayIndex={essayIndex}
                  tetradAnswers={tetradAnswers}
                  sjtAnswers={sjtAnswers}
                  essayAnswers={essayAnswers}
                  setEssayAnswers={setEssayAnswers}
                  updateChoice={updateChoice}
                  activeNumbers={activeNumbers}
                  activeIndex={activeIndex}
                  isNumberDone={isNumberDone}
                  jumpToNumber={jumpToNumber}
                  goPrev={goPrev}
                  goNext={goNext}
                  nextLabel={nextLabel}
                  timerLabel={timerLabel}
                  isTimerCritical={isTimerCritical}
                />
              ) : null}
            </section>
            <aside className="order-2 space-y-2.5 xl:order-2 xl:sticky xl:top-24 xl:self-start">
              <div className="surface-card p-2.5">
                <div className="flex items-start justify-between gap-1.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gold">Navigasi Soal</p>
                    <p className="text-[10px] text-muted">Klik nomor untuk lompat</p>
                  </div>
                  <span
                    className={`rounded-field border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] ${
                      isTimerCritical ? 'border-[#e9b5b5] bg-[#fff1f1] text-[#c43d3d]' : 'border-border bg-panel text-muted'
                    }`}
                  >
                    {timerLabel}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {Array.from({ length: activeNumbers }, (_, index) => {
                    const done = isNumberDone(index)
                    const active = index === activeIndex
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => jumpToNumber(index)}
                        className={`h-7 rounded-field border px-2 text-[10px] font-medium transition-all ${
                          active
                            ? 'border-[#c5a159] bg-[#f6e9d4] text-[#7a5a1f]'
                            : done
                              ? 'border-[#d9c7a8] bg-white text-[#8a7037]'
                              : 'border-border bg-white text-muted'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="btn-secondary w-1/2 px-3 py-1.5 text-[10px]" onClick={goPrev}>
                    Sebelumnya
                  </button>
                  <button type="button" className="btn-primary w-1/2 px-3 py-1.5 text-[10px]" onClick={goNext}>
                    {nextLabel}
                  </button>
                </div>
              </div>
              <div className="surface-card p-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-gold">Sesi</p>
                <div className="mt-1.5 space-y-1">
                  {sessionCards.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      disabled={item.disabled}
                      onClick={() => {
                        if (!item.disabled) {
                          setError('')
                          setStage(item.key)
                        }
                      }}
                      className={`w-full rounded-card border px-2 py-1.5 text-left transition-all ${
                        item.active
                          ? 'border-[#c4a160] bg-[#fbf5e9] shadow-[0_8px_18px_rgba(151,117,56,0.12)]'
                          : item.disabled
                            ? 'border-border bg-[#faf7f1] text-muted opacity-60'
                            : 'border-border bg-white'
                      }`}
                    >
                      <p className="text-[9px] uppercase tracking-[0.18em] text-gold">{item.part}</p>
                      <p className="mt-0.5 text-[11px] font-medium leading-[1.05rem] text-text">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted">{item.progress}</p>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function QuestionStage({
  stage,
  meta,
  tetradIndex,
  sjtIndex,
  essayIndex,
  tetradAnswers,
  sjtAnswers,
  essayAnswers,
  setEssayAnswers,
  updateChoice,
  activeNumbers,
  activeIndex,
  isNumberDone,
  jumpToNumber,
  goPrev,
  goNext,
  nextLabel,
  timerLabel,
  isTimerCritical,
}: {
  stage: Exclude<Stage, 'intro' | 'submitting'>
  meta: { title: string; subtitle: string; description: string; current: number; total: number }
  tetradIndex: number
  sjtIndex: number
  essayIndex: number
  tetradAnswers: TetradAnswer[]
  sjtAnswers: SJTAnswer[]
  essayAnswers: string[]
  setEssayAnswers: Dispatch<SetStateAction<string[]>>
  updateChoice: (type: 'tetrad' | 'sjt', kind: 'mostIndex' | 'leastIndex', value: number) => void
  activeNumbers: number
  activeIndex: number
  isNumberDone: (index: number) => boolean
  jumpToNumber: (index: number) => void
  goPrev: () => void
  goNext: () => void
  nextLabel: string
  timerLabel: string
  isTimerCritical: boolean
}) {
  const essayQuestion = essayQuestions[essayIndex]
  const answer = stage === 'tetrad' ? tetradAnswers[tetradIndex] : sjtAnswers[sjtIndex]
  const choiceOptions =
    stage === 'tetrad' ? tetradQuestions[tetradIndex].items : stage === 'sjt' ? sjtQuestions[sjtIndex].options : []

  return (
    <div className="surface-card relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-border bg-[#fcf8f1] px-3 py-2 sm:px-4">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div>
            <p className="eyebrow">Question View</p>
            <h2 className="mt-1 text-lg sm:text-xl">{meta.title}</h2>
            <p className="mt-1 text-[13px] leading-5 text-muted">{meta.subtitle}</p>
          </div>
          {meta.description ? (
            <div className="rounded-card border border-border bg-white px-3 py-2 text-[13px] leading-5 text-text">
              {meta.description}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 px-2 py-2 sm:px-4">
        <div className="flex h-full flex-col gap-3">
          {/* Mobile/Tablet navigator & timer */}
          <div className="flex flex-col gap-1.5 rounded-card border border-border bg-[#fcf8f1] px-3 py-2 shadow-sm lg:hidden">
            <div className={`rounded-field border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-center ${isTimerCritical ? 'border-[#e9b5b5] bg-[#fff1f1] text-[#c43d3d]' : 'border-border bg-white text-muted'}`}>
              Timer: {timerLabel}
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted">No. Soal</p>
              <span className="rounded-field border border-border bg-panel px-2 py-1 text-[10px] text-text">
                {meta.current + 1}/{meta.total}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: activeNumbers }, (_, index) => {
                const done = isNumberDone(index)
                const active = index === activeIndex
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => jumpToNumber(index)}
                    className={`h-7 rounded-field border px-2 text-[10px] font-medium transition-all ${
                      active
                        ? 'border-[#c5a159] bg-[#f6e9d4] text-[#7a5a1f]'
                        : done
                          ? 'border-[#d9c7a8] bg-white text-[#8a7037]'
                          : 'border-border bg-white text-muted'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          <div className="flex w-full justify-end gap-2">
            <button type="button" className="btn-secondary w-1/2 px-3 py-2 text-[10px]" onClick={goPrev}>
              Sebelumnya
            </button>
            <button type="button" className="btn-primary w-1/2 px-3 py-2 text-[10px]" onClick={goNext}>
              {nextLabel}
            </button>
          </div>
          </div>

          {stage === 'essay' ? (
            <div className="surface-panel h-full p-3.5 sm:p-4">
              <p className="text-[13px] leading-5 text-muted">{essayQuestion.hint}</p>
              <textarea
                className="field-base mt-3 min-h-[210px] resize-none text-sm leading-5"
                value={essayAnswers[essayIndex]}
                onChange={(event) =>
                  setEssayAnswers((prev) => {
                    const next = [...prev]
                    next[essayIndex] = event.target.value
                    return next
                  })
                }
                placeholder="Tulis kritik, saran, atau ide yang konkret."
              />
              <div className="mt-2.5 flex items-center justify-between gap-4 text-[13px]">
                <span className="text-muted">Opsional - semakin detail semakin berguna.</span>
                <span className="text-muted">
                  {(essayAnswers[essayIndex] || '').trim().length} karakter
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-1.5">
              {choiceOptions.map((text: string | { text: string }, index: number) => {
                const optionText = typeof text === 'string' ? text : text.text
                const mostSelected = answer?.mostIndex === index
                const leastSelected = answer?.leastIndex === index

                return (
                  <div
                    key={index}
                    className={`rounded-card border px-2.5 py-2 transition-all duration-200 ${
                      mostSelected
                        ? 'border-[#c39c53] bg-[#f9f1df] shadow-[0_8px_18px_rgba(185,146,70,0.12)]'
                        : leastSelected
                          ? 'border-[#ca9c7d] bg-[#f2ddd0] shadow-[0_8px_18px_rgba(154,93,58,0.08)]'
                          : 'border-border bg-white shadow-[0_2px_8px_rgba(76,62,39,0.04)]'
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-field border border-border bg-[#fbf5ea] text-[11px] font-semibold text-[#8f6f36]">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <p
                        className={`flex-1 text-[14px] leading-[1.35rem] ${
                          mostSelected || leastSelected ? 'font-medium text-slate-700' : 'text-slate-600'
                        }`}
                      >
                        {optionText}
                      </p>
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => updateChoice(stage, 'mostIndex', index)}
                          className={`min-w-[92px] rounded-field border px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
                            mostSelected
                              ? 'border-transparent bg-gradient-to-b from-[#c5a159] to-[#b99246] text-white shadow-[0_8px_16px_rgba(151,117,56,0.16)]'
                              : 'border-[#d7c5a2] bg-[#fff8ec] text-[#8f6f36]'
                          }`}
                        >
                          Most
                        </button>
                        <button
                          type="button"
                          onClick={() => updateChoice(stage, 'leastIndex', index)}
                          className={`min-w-[92px] rounded-field border px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
                            leastSelected
                              ? 'border-[#c88d68] bg-[#eecfbc] text-[#894c2d] shadow-[0_8px_14px_rgba(154,93,58,0.08)]'
                              : 'border-[#ddc0ac] bg-[#f7ebe2] text-[#9b6542]'
                          }`}
                        >
                          Least
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="space-y-2"><span className="text-sm text-muted">{label}</span><input className="field-base" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>
}

function ErrorBanner({ text }: { text: string }) {
  return <div className="rounded-card border border-[#d9b7a5] bg-[#fff6f0] px-4 py-3 text-sm text-[#9a5c43]">{text}</div>
}

function clampIndex(value: number | undefined, size: number) {
  if (!Number.isInteger(value)) return 0
  return Math.min(Math.max(value as number, 0), size - 1)
}

function normalizeChoiceAnswers(answers: TetradAnswer[] | SJTAnswer[] | undefined, size: number) {
  if (!Array.isArray(answers)) return Array.from({ length: size }, blankChoice)
  return Array.from({ length: size }, (_, index) => ({ mostIndex: Number.isInteger(answers[index]?.mostIndex) ? answers[index].mostIndex : -1, leastIndex: Number.isInteger(answers[index]?.leastIndex) ? answers[index].leastIndex : -1 }))
}

function normalizeEssayAnswers(answers: string[] | undefined, size: number) {
  if (!Array.isArray(answers)) return Array.from({ length: size }, () => '')
  return Array.from({ length: size }, (_, index) => (typeof answers[index] === 'string' ? answers[index] : ''))
}

function isCompletedChoice(answer: TetradAnswer | SJTAnswer) {
  return !!answer && Number.isInteger(answer.mostIndex) && Number.isInteger(answer.leastIndex) && answer.mostIndex >= 0 && answer.leastIndex >= 0 && answer.mostIndex !== answer.leastIndex
}




