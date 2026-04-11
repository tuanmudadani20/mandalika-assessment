export type Layer = 1 | 2 | 3 | 4;

export type DimensionKey =
  | 'integritas'
  | 'ownership'
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
  | 'innovative';

export type PlayerCategory = 'A Player' | 'B Solid Player' | 'B Player' | 'C Player' | 'C Player Kritis';

export type DimInterpretation = 'kuat' | 'sleeping_strength' | 'gap_probe' | 'genuine_gap' | 'moderate';

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  layer: Layer;
  color: string;
  description?: string;
}

export interface TetradAnswer {
  mostIndex: number;
  leastIndex: number;
}

export interface SJTAnswer {
  mostIndex: number;
  leastIndex: number;
}

export interface BEIAnswer {
  questionId: string;
  text: string;
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface BEIAnalysisResult {
  questionId: string;
  score: number;
  confidence: ConfidenceLevel;
  reasoning: string;
  redFlags: string[];
  dimensionScores: Record<DimensionKey, number>;
}

export interface DimResult {
  dim: DimensionKey;
  fcScore: number;
  sjtScore: number;
  interpretation: DimInterpretation;
}

export interface ScoringResult {
  fcScores: Record<DimensionKey, number>;
  sjtScores: Record<DimensionKey, number>;
  dimResults: DimResult[];
  profileScore: number;
  css: number;
  cssBreakdown: {
    integritas: number;
    ownership: number;
    standarPribadi: number;
    emotionallyControlled: number;
  };
  pgs: number;
  finalScore: number;
  finalCategory: PlayerCategory;
  sleepingStrengths: DimensionKey[];
  genuineGaps: DimensionKey[];
  possibleFaking: DimensionKey[];
  overrideReason?: string;
  borderlineFlag?: string;
  // compatibility fields
  leaderSummary?: string;
  rawCategory?: PlayerCategory;
  dimensionAlerts?: Array<{ dimension: DimensionKey; note: string; type?: string }>;
  profileFlags?: string[];
}

// Compatibility alias
export type FinalResult = ScoringResult;

export interface BEIResult {
  beiCategory: string;
  strengths: string[];
  risks: string[];
  css: number;
  pgs: number;
}

export type AssessmentStatus =
  | 'created'
  | 'profile'
  | 'tetrad'
  | 'sjt'
  | 'bei'
  | 'scoring'
  | 'completed';

export interface AssessmentSession {
  sessionId: string;
  status: AssessmentStatus;
  createdAt: string;
  completedAt?: string;

  profile?: {
    name: string;
    email: string;
    department: string;
    position: string;
    tenure: string;
  };

  tetradAnswers?: TetradAnswer[];
  sjtAnswers?: SJTAnswer[];
  beiAnswers?: BEIAnswer[];

  fcScores?: Record<DimensionKey, number>;
  sjtScores?: Record<DimensionKey, number>;
  beiScores?: Record<DimensionKey, number>;
  beiAnalysis?: BEIAnalysisResult[];
  psychometricScores?: Record<DimensionKey, number>;
  dimensionScores?: Record<DimensionKey, number>;
  dimInterpretations?: Record<DimensionKey, DimInterpretation>;
  profileScore?: number;
  finalResult?: FinalResult;

  timing?: { tetradMs?: number; sjtMs?: number; beiMs?: number };
  consistencyFlags?: string[];
  inconsistencyFlags?: string[];
}

export interface OverrideResult {
  override1: boolean;
  override2: boolean;
  flags: string[];
}

export type ScoreMap = Record<DimensionKey, number>;
