import {
  categoryColors,
  dimensionOrder,
  dimensions,
  layerWeights,
  profileFlagMeta,
  sjtQuestions,
  tetradQuestions,
} from './assessment-data'
import type {
  DimScores,
  DimensionAlert,
  DimensionKey,
  Layer1GateStatus,
  PlayerCategory,
  ProfileFlagKey,
  Scores,
  SJTAnswer,
  TetradAnswer,
} from './types'

const TETRAD_MIN = -16
const TETRAD_MAX = 16
const SJT_MIN = -2
const SJT_MAX = 12

export const categoryOrder: PlayerCategory[] = [
  'A Player',
  'B Solid Player',
  'B Player',
  'C Player',
  'C Player Kritis',
]

export const layerDimensions: Record<1 | 2 | 3 | 4, DimensionKey[]> = {
  1: ['integritas', 'ownership', 'standarPribadi', 'emotionallyControlled'],
  2: ['caraBerpikir', 'responsFeedback', 'growthMindset', 'conscientious'],
  3: ['dampakTim', 'resiliensi', 'communicationClarity'],
  4: ['decisive', 'innovative'],
}

export function createEmptyDimScores(initial = 0): DimScores {
  return dimensionOrder.reduce((accumulator, key) => {
    accumulator[key] = initial
    return accumulator
  }, {} as DimScores)
}

export function getDimensionLabel(key: DimensionKey) {
  return dimensions[key].label
}

export function getCategoryColor(category: PlayerCategory) {
  return categoryColors[category]
}

export function computeScores(
  tetradAnswers: TetradAnswer[],
  sjtAnswers: SJTAnswer[],
): Scores {
  const tetradRaw = createEmptyDimScores(0)
  const sjtRaw = createEmptyDimScores(0)

  tetradAnswers.forEach((answer, questionIndex) => {
    const question = tetradQuestions[questionIndex]
    if (!question) return

    const mostItem = question.items[answer.mostIndex]
    const leastItem = question.items[answer.leastIndex]
    if (!mostItem || !leastItem) return

    tetradRaw[mostItem.dim] += 2
    tetradRaw[leastItem.dim] -= 2
  })

  sjtAnswers.forEach((answer, questionIndex) => {
    const question = sjtQuestions[questionIndex]
    if (!question) return

    const mostScore = question.mostScores[answer.mostIndex] ?? 0
    const leastScore = question.leastScores[answer.leastIndex] ?? 0
    sjtRaw[question.dim] += mostScore + leastScore
  })

  const dims = createEmptyDimScores(0)
  for (const key of dimensionOrder) {
    const tetradPct = normalizePercent(tetradRaw[key], TETRAD_MIN, TETRAD_MAX)
    const sjtPct = normalizePercent(sjtRaw[key], SJT_MIN, SJT_MAX)
    dims[key] = Math.round(tetradPct * 0.55 + sjtPct * 0.45)
  }

  const layer1AvgExact = average(layerDimensions[1].map((key) => dims[key]))
  const layer2AvgExact = average(layerDimensions[2].map((key) => dims[key]))
  const layer3AvgExact = average(layerDimensions[3].map((key) => dims[key]))
  const layer4AvgExact = average(layerDimensions[4].map((key) => dims[key]))

  const gateStatuses = getLayer1GateStatuses(dims)
  const failedCount = gateStatuses.filter((item) => item.status !== 'passed').length
  const criticalCount = gateStatuses.filter((item) => item.status === 'critical').length
  const gate1Passed = failedCount === 0
  const gate2Passed = layer2AvgExact >= 55

  const weightedScoreExact =
    layer1AvgExact * layerWeights[1] +
    layer2AvgExact * layerWeights[2] +
    layer3AvgExact * layerWeights[3] +
    layer4AvgExact * layerWeights[4]

  const { css, breakdown: cssBreakdown } = computeCSS(dims)
  const pgs = computePGS(dims)
  const totalDeduction = css + pgs
  const postDeductionScore = clampScore(weightedScoreExact - totalDeduction)

  const rawCategory = scoreToCategory(weightedScoreExact)

  const gate1 = {
    passed: gate1Passed,
    failedCount,
    criticalCount,
  }

  const gate2 = {
    passed: gate2Passed,
    average: round1(layer2AvgExact),
  }

  const overrides = computeOverrides(dims)

  const postDeductionCategory = scoreToCategory(postDeductionScore)
  const finalCategory = overrides.anyOverrideActive && overrides.forcedCategory
    ? worseCategory(postDeductionCategory, overrides.forcedCategory)
    : postDeductionCategory

  const CAT_MAX: Record<PlayerCategory, number> = {
    'A Player': 100,
    'B Solid Player': 81,
    'B Player': 66,
    'C Player': 47,
    'C Player Kritis': 29,
  }

  const finalScoreExact = Math.min(postDeductionScore, CAT_MAX[finalCategory])

  const wasDowngraded = finalCategory !== rawCategory
  const downgradeReason = wasDowngraded
    ? buildDowngradeReason(css, cssBreakdown, pgs, overrides)
    : undefined

  const profileFlags = getProfileFlags(dims, {
    gate1Passed,
    layer1Avg: layer1AvgExact,
    layer2Avg: layer2AvgExact,
    layer3Avg: layer3AvgExact,
    overrides,
    finalCategory,
  })

  const ranked = [...dimensionOrder].sort((left, right) => {
    if (dims[right] !== dims[left]) return dims[right] - dims[left]
    return dimensionOrder.indexOf(left) - dimensionOrder.indexOf(right)
  })

  return {
    dims,
    layer1Avg: round1(layer1AvgExact),
    layer2Avg: round1(layer2AvgExact),
    layer3Avg: round1(layer3AvgExact),
    layer4Avg: round1(layer4AvgExact),
    weightedScore: round1(weightedScoreExact),
    finalScore: round1(finalScoreExact),
    rawCategory,
    finalCategory,
    wasDowngraded,
    downgradeReason,
    css: round1(css),
    pgs: round1(pgs),
    totalDeduction: round1(totalDeduction),
    cssBreakdown,
    overrides,
    gate1,
    gate2,
    profileFlags,
    strengths: ranked.slice(0, 3).map((key) => `${getDimensionLabel(key)} (${dims[key]}%)`),
    gaps: ranked.slice(-3).reverse().map((key) => `${getDimensionLabel(key)} (${dims[key]}%)`),
  }
}

export function getLayer1GateStatuses(dims: DimScores): Layer1GateStatus[] {
  return layerDimensions[1].map((key) => {
    const definition = dimensions[key]
    const gateThreshold = definition.gateThreshold ?? 0
    const criticalThreshold = definition.criticalThreshold ?? 0
    const score = dims[key]

    let status: Layer1GateStatus['status'] = 'passed'
    if (score < criticalThreshold) status = 'critical'
    else if (score < gateThreshold) status = 'failed'

    return {
      key,
      label: definition.label,
      score,
      status,
      gateThreshold,
      criticalThreshold,
    }
  })
}

export function getDimensionAlerts(dims: DimScores): DimensionAlert[] {
  const alerts: DimensionAlert[] = []

  for (const key of dimensionOrder) {
    const definition = dimensions[key]
    const score = dims[key]
    const criticalThreshold = definition.criticalThreshold
    const gateThreshold = definition.gateThreshold

    if (typeof criticalThreshold === 'number' && score < criticalThreshold) {
      alerts.push({
        key,
        label: definition.label,
        level: 'critical',
        score,
        description: `Skor berada di bawah critical threshold (${criticalThreshold}%).`,
      })
      continue
    }

    if (typeof gateThreshold === 'number' && score < gateThreshold) {
      alerts.push({
        key,
        label: definition.label,
        level: 'warning',
        score,
        description: `Skor belum mencapai gate threshold (${gateThreshold}%).`,
      })
      continue
    }

    if (score >= 88) {
      alerts.push({
        key,
        label: definition.label,
        level: 'info',
        score,
        description: 'Dimensi ini muncul sebagai kekuatan yang sangat tinggi.',
      })
    }
  }

  return alerts.sort((left, right) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    if (severityOrder[left.level] !== severityOrder[right.level]) {
      return severityOrder[left.level] - severityOrder[right.level]
    }

    if (left.level === 'info') return right.score - left.score
    return left.score - right.score
  })
}

export function getProfileFlagDefinitions(keys: ProfileFlagKey[]) {
  return keys.map((key) => profileFlagMeta[key])
}

export function getCategoryFromScore(score: number): PlayerCategory {
  return scoreToCategory(score)
}

function lowerCategory(current: PlayerCategory, cap: PlayerCategory): PlayerCategory {
  return categoryOrder.indexOf(current) > categoryOrder.indexOf(cap) ? current : cap
}

function normalizePercent(rawScore: number, min: number, max: number) {
  return ((rawScore - min) / (max - min)) * 100
}

function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function round1(value: number) {
  return Math.round(value * 10) / 10
}

function getProfileFlags(
  dims: DimScores,
  context: {
    gate1Passed: boolean
    layer1Avg: number
    layer2Avg: number
    layer3Avg: number
    overrides: { characterCollapse: boolean; characterFoundationAbsent: boolean; anyOverrideActive: boolean }
    finalCategory: PlayerCategory
  },
): ProfileFlagKey[] {
  const flags: ProfileFlagKey[] = []
  const amplifierAvg = average([dims.decisive, dims.innovative])
  const minScore = Math.min(...dimensionOrder.map((key) => dims[key]))
  const maxScore = Math.max(...dimensionOrder.map((key) => dims[key]))

  if (context.overrides.characterCollapse) flags.push('character_collapse')
  if (context.overrides.characterFoundationAbsent) flags.push('character_foundation_absent')
  if (context.finalCategory === 'C Player Kritis') flags.push('c_player_critical')
  if (!context.gate1Passed) flags.push('character_risk')
  if (context.layer1Avg >= 72 && context.layer2Avg >= 72 && amplifierAvg < 58) {
    flags.push('execution_powerhouse')
  }
  if (context.gate1Passed && dims.decisive >= 80 && dims.innovative >= 80) {
    flags.push('innovation_driver')
  }
  if (context.layer1Avg >= 75 && dims.growthMindset >= 78 && context.layer2Avg >= 55 && context.layer3Avg < 65) {
    flags.push('high_ceiling')
  }
  if (minScore >= 55 && maxScore <= 78 && context.layer1Avg >= 60) {
    flags.push('anchor_player')
  }
  if (dims.caraBerpikir >= 80 && dims.decisive >= 75 && dims.communicationClarity >= 75) {
    flags.push('strategic_thinker')
  }
  if (dims.dampakTim >= 80 && dims.integritas >= 80 && dims.emotionallyControlled >= 75) {
    flags.push('culture_builder')
  }

  return flags
}

function computeCSS(dims: DimScores) {
  const integritas = (() => {
    const s = dims.integritas
    if (s >= 50) return 0
    if (s >= 35) return 5
    if (s >= 25) return 12
    return 22
  })()

  const ownership = (() => {
    const s = dims.ownership
    if (s >= 50) return 0
    if (s >= 35) return 5
    if (s >= 25) return 12
    return 22
  })()

  const standarPribadi = (() => {
    const s = dims.standarPribadi
    if (s >= 45) return 0
    if (s >= 30) return 5
    if (s >= 20) return 10
    return 18
  })()

  const emotionallyControlled = (() => {
    const s = dims.emotionallyControlled
    if (s >= 40) return 0
    if (s >= 25) return 4
    if (s >= 15) return 8
    return 14
  })()

  const breakdown = {
    integritas,
    ownership,
    standarPribadi,
    emotionallyControlled,
  }
  const css = integritas + ownership + standarPribadi + emotionallyControlled
  return { css, breakdown }
}

function computePGS(dims: DimScores) {
  const avg = Math.round(average(layerDimensions[2].map((key) => dims[key])))
  if (avg >= 55) return 0
  if (avg >= 50) return 4
  if (avg >= 40) return 10
  if (avg >= 30) return 18
  return 28
}

function computeOverrides(dims: DimScores) {
  const characterCollapse = dims.integritas < 25 || dims.ownership < 25

  const L1_THRESHOLDS = {
    integritas: 50,
    ownership: 50,
    standarPribadi: 45,
    emotionallyControlled: 40,
  }
  const failedCount = Object.entries(L1_THRESHOLDS).filter(
    ([key, threshold]) => dims[key as keyof DimScores] < threshold,
  ).length
  const characterFoundationAbsent = failedCount >= 3

  const anyOverrideActive = characterCollapse || characterFoundationAbsent

  let forcedCategory: PlayerCategory | undefined
  let overrideReason: string | undefined

  if (characterCollapse) {
    forcedCategory = 'C Player Kritis'
    const who =
      dims.integritas < 25 && dims.ownership < 25
        ? 'Integritas dan Ownership'
        : dims.integritas < 25
          ? 'Integritas'
          : 'Ownership'
    overrideReason = `${who} berada di bawah 25% (level kritis). Skor dimensi lain tidak dapat mengkompensasi ini.`
  }

  if (characterFoundationAbsent) {
    const failed = Object.entries(L1_THRESHOLDS)
      .filter(([key, threshold]) => dims[key as keyof DimScores] < threshold)
      .map(([key]) => key)
    const reason = `${failedCount} dimensi fondasi karakter (${failed.join(', ')}) di bawah threshold.`

    if (!forcedCategory) {
      forcedCategory = 'C Player'
      overrideReason = reason
    } else {
      overrideReason = `${overrideReason ?? ''} Selain itu, ${reason}`.trim()
    }
  }

  return {
    characterCollapse,
    characterFoundationAbsent,
    anyOverrideActive,
    forcedCategory,
    overrideReason,
  }
}

function scoreToCategory(score: number): PlayerCategory {
  if (score >= 82) return 'A Player'
  if (score >= 67) return 'B Solid Player'
  if (score >= 48) return 'B Player'
  if (score >= 30) return 'C Player'
  return 'C Player Kritis'
}

function worseCategory(a: PlayerCategory, b: PlayerCategory): PlayerCategory {
  const order: Record<PlayerCategory, number> = {
    'A Player': 4,
    'B Solid Player': 3,
    'B Player': 2,
    'C Player': 1,
    'C Player Kritis': 0,
  }
  return order[a] <= order[b] ? a : b
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value))
}

function buildDowngradeReason(css: number, cssBreakdown: { [k: string]: number }, pgs: number, overrides: { anyOverrideActive: boolean; overrideReason?: string }) {
  const parts: string[] = []

  if (overrides.overrideReason) {
    parts.push(overrides.overrideReason)
  }

  if (css > 0) {
    const affected = Object.entries(cssBreakdown)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k} (−${v})`)
      .join(', ')
    parts.push(`Deduction karakter: ${affected}. Total CSS: −${css} poin.`)
  }

  if (pgs > 0) {
    parts.push(`Deduction performa: rata-rata Layer 2 di bawah 55%. Total PGS: −${pgs} poin.`)
  }

  return parts.join(' ')
}
