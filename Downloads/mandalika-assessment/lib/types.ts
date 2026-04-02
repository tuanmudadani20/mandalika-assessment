export type DimensionKey =
  | 'ownership'
  | 'integritas'
  | 'standarPribadi'
  | 'emotionallyControlled'
  | 'caraBerpikir'
  | 'responsFeedback'
  | 'growthMindset'
  | 'conscientious'
  | 'dampakTim'
  | 'resiliensi'
  | 'communicationClarity'
  | 'decisive'
  | 'innovative'

export type PlayerCategory = 'A Player' | 'B Solid Player' | 'B Player' | 'C Player' | 'C Player Kritis'
export type LayerKey = 1 | 2 | 3 | 4
export type AlertLevel = 'critical' | 'warning' | 'info'
export type ProfileFlagKey =
  | 'character_risk'
  | 'execution_powerhouse'
  | 'innovation_driver'
  | 'high_ceiling'
  | 'anchor_player'
  | 'strategic_thinker'
  | 'culture_builder'
  | 'character_collapse'
  | 'character_foundation_absent'
  | 'c_player_critical'

export type DimScores = Record<DimensionKey, number>
export type DimScoresV2 = Record<string, number>

export interface DimensionDefinition {
  key: DimensionKey
  label: string
  layer: LayerKey
  description: string
  aPlayerSignal: string
  gateThreshold?: number
  criticalThreshold?: number
}

export interface TetradItem {
  dim: DimensionKey
  text: string
  valence?: 'positive' | 'negative'
}

export interface TetradQuestion {
  code: string
  items: [TetradItem, TetradItem, TetradItem, TetradItem]
}

export interface SJTQuestion {
  code: string
  dim: DimensionKey
  scenario: string
  options: [string, string, string, string]
  mostScores: [number, number, number, number]
  leastScores: [number, number, number, number]
}

export interface EssayQuestion {
  code: string
  dim: DimensionKey
  question: string
  hint: string
}

export interface TetradAnswer {
  mostIndex: number
  leastIndex: number
}

export interface SJTAnswer {
  mostIndex: number
  leastIndex: number
}

export interface Gate1Summary {
  passed: boolean
  failedCount: number
  criticalCount: number
}

export interface Gate2Summary {
  passed: boolean
  average: number
}

export interface Scores {
  dims: DimScores
  layer1Avg: number
  layer2Avg: number
  layer3Avg: number
  layer4Avg: number
  weightedScore: number
  finalScore: number
  rawCategory: PlayerCategory
  finalCategory: PlayerCategory
  wasDowngraded: boolean
  downgradeReason?: string
  css: number
  pgs: number
  totalDeduction: number
  cssBreakdown: CSSBreakdown
  overrides: OverrideResult
  gate1: Gate1Summary
  gate2: Gate2Summary
  profileFlags: ProfileFlagKey[]
  strengths: string[]
  gaps: string[]
}

export interface Submission {
  id: string
  timestamp: string
  timings: SubmissionTiming
  name: string
  dept: string
  role: string
  tenure: string
  tetradAnswers: TetradAnswer[]
  sjtAnswers: SJTAnswer[]
  essayAnswers: string[]
  scores: Scores
  leaderNotes: string
  aiResult?: {
    kategori: string
    skor: number
    ringkasan: string
    dimensi: Record<string, { skor: number; catatan: string }>
    pola: string[]
    kekuatan: string[]
    risiko: string[]
    rekomendasi: string
    analyzedAt: string
  }
}

export interface SubmissionPayload {
  name: string
  dept: string
  role: string
  tenure: string
  timings: SubmissionTiming
  tetradAnswers: TetradAnswer[]
  sjtAnswers: SJTAnswer[]
  essayAnswers: string[]
}

export interface SubmissionTiming {
  startedAt: string
  finishedAt: string
  totalSeconds: number
  tetrad: {
    start?: string
    end?: string
  }
  sjt: {
    start?: string
    end?: string
  }
  essay: {
    start?: string
    end?: string
  }
}

export interface Layer1GateStatus {
  key: DimensionKey
  label: string
  score: number
  status: 'passed' | 'failed' | 'critical'
  gateThreshold: number
  criticalThreshold: number
}

export interface DimensionAlert {
  key: DimensionKey
  label: string
  level: AlertLevel
  score: number
  description: string
}

export interface ProfileFlagDefinition {
  key: ProfileFlagKey
  label: string
  alert: 'critical' | 'info'
  description: string
  placement: string
}

export interface CSSBreakdown {
  integritas: number
  ownership: number
  standarPribadi: number
  emotionallyControlled: number
}

export interface OverrideResult {
  characterCollapse: boolean
  characterFoundationAbsent: boolean
  anyOverrideActive: boolean
  forcedCategory?: PlayerCategory
  overrideReason?: string
}

// v2 assessment structures
export interface TetradAnswerV2 {
  tetradId: string
  rankings: number[] // length 4, rank 1-4 unique
  timeSpentSeconds?: number
}

export interface SJTAnswerV2 {
  questionId: string
  chosenKey: string // "A" | "B" | "C" | "D"
  timeSpentSeconds?: number
}

export interface BEIAnswer {
  questionId: string
  answer: string
  evaluation?: {
    score: number // 1-4
    justification: string
    strengths: string[]
    concerns: string[]
    follow_up_needed: boolean
    follow_up_question: string | null
  }
}

export interface CandidateAssessmentV2 {
  id: string
  name: string
  position: string
  timestamp: string
  tetradAnswers: TetradAnswerV2[]
  sjtAnswers: SJTAnswerV2[]
  beiAnswers: BEIAnswer[]
  tetradScores: Record<string, number>
  sjtScores: Record<string, number>
  beiScores: Record<string, number>
  finalScores: Record<string, number>
  layer1Gate: {
    gateResults: Record<string, { score: number; threshold: number; passed: boolean }>
    overallPassed: boolean
  }
  fakingAlert: {
    hasFakingAlert: boolean
    inconsistencyScore: number
  }
  classification: 'A' | 'B' | 'C' | 'C*'
}
