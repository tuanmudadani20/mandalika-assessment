import {
  TETRADS,
  SJT_QUESTIONS,
  BEI_QUESTIONS,
  DIMENSIONS,
  LAYER1_THRESHOLDS,
} from './question-bank'

type DimensionCode = keyof typeof DIMENSIONS
const zeroDimensions = (): Record<DimensionCode, number> => {
  const obj = {} as Record<DimensionCode, number>
  ;(Object.keys(DIMENSIONS) as DimensionCode[]).forEach((dim) => {
    obj[dim] = 0
  })
  return obj
}

// Helpers
function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

type TetradItemV2 = { dim: string; text: string; positive?: boolean }

export type TetradAnswerV2 = {
  tetradId: string
  rankings: number[] // length 4, values 1-4
  timeSpentSeconds?: number
}

export type SJTAnswerV2 = {
  questionId: string
  chosenKey: string // "A" | "B" | "C" | "D"
  timeSpentSeconds?: number
}

export type BEIEvaluation = {
  questionId: string
  score: number // 1-4
  strengths?: string[]
  concerns?: string[]
  follow_up_needed?: boolean
  follow_up_question?: string | null
}

export function calculateTetradScores(answers: TetradAnswerV2[]) {
  const makeZeros: () => Record<DimensionCode, number> = () => {
    const obj = {} as Record<DimensionCode, number>
    ;(Object.keys(DIMENSIONS) as DimensionCode[]).forEach((dim) => {
      obj[dim] = 0
    })
    return obj
  }
  const rawScores = makeZeros()
  const maxScores = makeZeros()
  const minScores = makeZeros()

  answers.forEach((answer) => {
    const tetrad = TETRADS.find((t) => t.id === answer.tetradId)
    if (!tetrad) return

    tetrad.items.forEach((itemRaw, idx) => {
      const item = itemRaw as TetradItemV2
      const rank = answer.rankings?.[idx]
      if (typeof rank !== 'number' || rank < 1 || rank > 4) return
      const dim = item.dim as DimensionCode

      let isPositive: boolean
      if (tetrad.type === 'positive') isPositive = true
      else if (tetrad.type === 'negative') isPositive = false
      else isPositive = item.positive !== false // mixed: item[0] default true

      const score = isPositive ? rank : 5 - rank
      rawScores[dim] = (rawScores[dim] || 0) + score
      maxScores[dim] = (maxScores[dim] || 0) + 4
      minScores[dim] = (minScores[dim] || 0) + 1
    })
  })

  const pctScores = {} as Record<DimensionCode, number>
  Object.keys(DIMENSIONS).forEach((dimKey) => {
    const dim = dimKey as DimensionCode
    pctScores[dim] = 0
  })
  Object.keys(DIMENSIONS).forEach((dimKey) => {
    const dim = dimKey as DimensionCode
    const range = (maxScores[dim] || 1) - (minScores[dim] || 0)
    const raw = rawScores[dim] - (minScores[dim] || 0)
    pctScores[dim] = Math.max(0, Math.min(100, Math.round((raw / range) * 100)))
  })

  return pctScores
}

export function detectFakingAlert(answers: TetradAnswerV2[]) {
  const mixedTetrads = TETRADS.filter((t) => t.type === 'mixed')
  let inconsistencyScore = 0

  mixedTetrads.forEach((tetrad) => {
    const answer = answers.find((a) => a.tetradId === tetrad.id)
    if (!answer) return
    const rankings = answer.rankings || []
    const positiveRank = rankings[0]
    const negativeRanks = [rankings[1], rankings[2], rankings[3]].filter(
      (r) => typeof r === 'number',
    ) as number[]
    if (negativeRanks.length !== 3 || typeof positiveRank !== 'number') return
    const avgNegative = negativeRanks.reduce((a, b) => a + b, 0) / 3
    if (positiveRank <= 2 && avgNegative >= 3) inconsistencyScore++
  })

  return {
    hasFakingAlert: inconsistencyScore >= 2,
    inconsistencyScore,
    message:
      inconsistencyScore >= 2
        ? '⚠️ Terdeteksi potensi inkonsistensi dalam pola jawaban. Validasi lebih lanjut disarankan.'
        : null,
  }
}

export function calculateSJTScores(sjtAnswers: SJTAnswerV2[]) {
  const scores: Partial<Record<DimensionCode, number>> = {}
  const counts: Partial<Record<DimensionCode, number>> = {}

  sjtAnswers.forEach((answer) => {
    const question = SJT_QUESTIONS.find((q) => q.id === answer.questionId)
    if (!question) return
    const chosen = question.options.find((o) => o.key === answer.chosenKey)
    if (!chosen) return
    const dim = question.dim as DimensionCode
    scores[dim] = (scores[dim] || 0) + chosen.score
    counts[dim] = (counts[dim] || 0) + 1
  })

  const pctScores = {} as Record<DimensionCode, number>
  Object.keys(DIMENSIONS).forEach((key) => {
    const dim = key as DimensionCode
    const maxPossible = (counts[dim] || 1) * 4
    pctScores[dim] = Math.round(((scores[dim] || 0) / maxPossible) * 100)
  })

  return pctScores
}

export function evaluateLayer1Gate(tetradScores: Record<string, number>, sjtScores: Record<string, number>) {
  const layer1Dims: DimensionCode[] = ['INT', 'OWN', 'STP', 'CBP']
  const combinedScores: Record<string, number> = {}
  const gateResults: Record<
    string,
    { score: number; threshold: number; passed: boolean }
  > = {}

  layer1Dims.forEach((dim) => {
    const t = tetradScores[dim] || 0
    const s = sjtScores[dim] || 0
    const combined = Math.round(t * 0.5 + s * 0.5)
    combinedScores[dim] = combined
    const threshold = (LAYER1_THRESHOLDS as Record<string, number>)[dim] || 0
    gateResults[dim] = {
      score: combined,
      threshold,
      passed: combined >= threshold,
    }
  })

  const overallPassed = layer1Dims.every((dim) => gateResults[dim].passed)

  return {
    gateResults,
    combinedScores,
    overallPassed,
    recommendation: overallPassed ? 'proceed_to_phase2' : 'flag_for_review',
  }
}

export function aggregateBEIScores(beiEvaluations: BEIEvaluation[]) {
  const dimScores: Partial<Record<DimensionCode, number>> = {}
  const dimCounts: Partial<Record<DimensionCode, number>> = {}

  beiEvaluations.forEach((ev) => {
    const question = BEI_QUESTIONS.find((q) => q.id === ev.questionId)
    if (!question) return
    question.dims.forEach((dimCode: string) => {
      const dim = dimCode as DimensionCode
      dimScores[dim] = (dimScores[dim] || 0) + ev.score
      dimCounts[dim] = (dimCounts[dim] || 0) + 1
    })
  })

  const pctScores = {} as Record<DimensionCode, number>
  Object.keys(DIMENSIONS).forEach((key) => {
    const dim = key as DimensionCode
    const max = (dimCounts[dim] || 1) * 4
    pctScores[dim] = Math.round(((dimScores[dim] || 0) / max) * 100)
  })

  return pctScores
}

export function computeFinalScores(
  tetradScores: Record<string, number>,
  sjtScores: Record<string, number>,
  beiScores: Record<string, number>,
) {
  const finalScores: Record<string, number> = {}
  const WEIGHTS = { tetrad: 0.3, sjt: 0.3, bei: 0.4 }

  Object.keys(DIMENSIONS).forEach((dim) => {
    const t = tetradScores[dim] ?? 50
    const s = sjtScores[dim] ?? 50
    const b = beiScores[dim]
    const hasBEI = typeof b === 'number'

    if (hasBEI) {
      finalScores[dim] = Math.round(t * WEIGHTS.tetrad + s * WEIGHTS.sjt + (b ?? 50) * WEIGHTS.bei)
    } else {
      finalScores[dim] = Math.round(t * 0.5 + s * 0.5)
    }
  })

  return finalScores
}

export function classifyABCPlayer(
  finalScores: Record<string, number>,
  layer1Gate: { overallPassed: boolean },
  fakingAlert: { hasFakingAlert: boolean },
) {
  const layer1Dims: DimensionCode[] = ['INT', 'OWN', 'STP', 'CBP']
  const layer24Dims: DimensionCode[] = ['GRW', 'DCS', 'DPT', 'CMC', 'RSL', 'EMO', 'KOL', 'INS', 'FHS']

  const layer1Avg = average(layer1Dims.map((d) => finalScores[d] ?? 0))
  const layer24Avg = average(layer24Dims.map((d) => finalScores[d] ?? 0))
  const allValues = Object.values(finalScores)
  const overallAvg = average(allValues.length ? allValues : [0])

  if (!layer1Gate.overallPassed) {
    return {
      classification: 'C',
      reason: 'Layer 1 CSS gate tidak terpenuhi',
      color: '#dc2626',
    }
  }

  if (fakingAlert.hasFakingAlert) {
    return {
      classification: 'C*',
      reason: 'Terdeteksi inkonsistensi jawaban — validasi manual diperlukan',
      color: '#f97316',
    }
  }

  if (layer1Avg >= 75 && layer24Avg >= 70 && overallAvg >= 72) {
    return {
      classification: 'A',
      reason: 'Top performer — fondasi kuat dan kapabilitas tinggi',
      color: '#16a34a',
    }
  }

  if (layer1Avg >= 60 && layer24Avg >= 55 && overallAvg >= 60) {
    return {
      classification: 'B',
      reason: 'Solid contributor — ada area pengembangan spesifik',
      color: '#d97706',
    }
  }

  return {
    classification: 'C',
    reason: 'Perlu pengembangan signifikan atau tidak cocok untuk peran ini',
    color: '#dc2626',
  }
}

// (helpers moved to top)
