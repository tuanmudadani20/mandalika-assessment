import { DIMENSIONS, getDimensionsByLayer } from './dimensions';
import { DimensionKey, DimInterpretation, FinalResult, PlayerCategory, ScoreMap } from './types';

export function interpretDimension(fc: number, sjt: number): DimInterpretation {
  if (sjt >= 55) return fc >= 50 ? 'kuat' : 'sleeping_strength';
  if (sjt < 45) return fc >= 50 ? 'gap_probe' : 'genuine_gap';
  return 'moderate';
}

export function interpretAllDimensions(
  fcScores: ScoreMap,
  sjtScores: ScoreMap,
): Record<DimensionKey, DimInterpretation> {
  const res = {} as Record<DimensionKey, DimInterpretation>;
  DIMENSIONS.forEach((d) => {
    res[d.key] = interpretDimension(fcScores[d.key] ?? 50, sjtScores[d.key] ?? 50);
  });
  return res;
}

export function computeProfileScore(sjtScores: ScoreMap): number {
  const L1: DimensionKey[] = ['integritas', 'ownership', 'standarPribadi', 'emotionallyControlled'];
  const L2: DimensionKey[] = ['caraBerpikir', 'responsFeedback', 'growthMindset', 'conscientious'];
  const avg = (dims: DimensionKey[]) => dims.reduce((s, d) => s + (sjtScores[d] ?? 50), 0) / dims.length;
  return Math.round(avg(L1) * 0.65 + avg(L2) * 0.35);
}

export function computeCSS(
  sjtScores: ScoreMap,
  interp: Record<DimensionKey, DimInterpretation>,
): { css: number; breakdown: Record<string, number> } {
  function integOwn(sjt: number, code: DimInterpretation): number {
    if (code === 'sleeping_strength') return 0;
    if (sjt >= 50) return 0;
    if (sjt >= 35) return 3;
    if (sjt >= 25) return 7;
    return 12;
  }
  function stdPribadi(sjt: number, code: DimInterpretation): number {
    if (code === 'sleeping_strength') return 0;
    if (sjt >= 45) return 0;
    if (sjt >= 30) return 3;
    if (sjt >= 20) return 6;
    return 10;
  }
  function emotCtrl(sjt: number, code: DimInterpretation): number {
    if (code === 'sleeping_strength') return 0;
    if (sjt >= 40) return 0;
    if (sjt >= 25) return 2;
    if (sjt >= 15) return 5;
    return 8;
  }

  const breakdown = {
    integritas: integOwn(sjtScores.integritas ?? 0, interp.integritas),
    ownership: integOwn(sjtScores.ownership ?? 0, interp.ownership),
    standarPribadi: stdPribadi(sjtScores.standarPribadi ?? 0, interp.standarPribadi),
    emotionallyControlled: emotCtrl(sjtScores.emotionallyControlled ?? 0, interp.emotionallyControlled),
  };

  const css = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return { css, breakdown };
}

export function computePGS(sjtScores: ScoreMap): number {
  const L2: DimensionKey[] = ['caraBerpikir', 'responsFeedback', 'growthMindset', 'conscientious'];
  const avg = L2.reduce((s, d) => s + (sjtScores[d] ?? 50), 0) / L2.length;
  if (avg >= 55) return 0;
  if (avg >= 50) return 2;
  if (avg >= 40) return 5;
  if (avg >= 30) return 9;
  return 14;
}

export function computeOverrides(
  sjtScores: ScoreMap,
  interp: Record<DimensionKey, DimInterpretation>,
): { characterCollapse: boolean; characterFoundationAbsent: boolean; anyOverrideActive: boolean; forcedCategory?: PlayerCategory } {
  const characterCollapse = (sjtScores.integritas ?? 0) < 25 || (sjtScores.ownership ?? 0) < 25;

  const L1_THRESHOLDS: Record<DimensionKey, number> = {
    integritas: 50,
    ownership: 50,
    standarPribadi: 45,
    emotionallyControlled: 40,
    caraBerpikir: 0,
    responsFeedback: 0,
    growthMindset: 0,
    conscientious: 0,
    dampakTim: 0,
    resiliensi: 0,
    communicationClarity: 0,
    decisive: 0,
    innovative: 0,
  };

  const genuineGapCount = (['integritas', 'ownership', 'standarPribadi', 'emotionallyControlled'] as DimensionKey[]).filter(
    (dim) => (sjtScores[dim] ?? 0) < L1_THRESHOLDS[dim] && interp[dim] === 'genuine_gap',
  ).length;

  const characterFoundationAbsent = genuineGapCount >= 3;

  let forcedCategory: PlayerCategory | undefined;
  if (characterCollapse) forcedCategory = 'C Player Kritis';
  else if (characterFoundationAbsent) forcedCategory = 'C Player';

  const anyOverrideActive = Boolean(forcedCategory);

  return { characterCollapse, characterFoundationAbsent, anyOverrideActive, forcedCategory };
}

export function scoreToCategory(score: number): PlayerCategory {
  if (score >= 62) return 'A Player';
  if (score >= 52) return 'B Solid Player';
  if (score >= 41) return 'B Player';
  if (score >= 28) return 'C Player';
  return 'C Player Kritis';
}

export function computeScore(params: {
  fcScores: ScoreMap;
  sjtScores: ScoreMap;
  consistencyFlags?: string[];
  sleepingStrengths?: DimensionKey[];
  possibleFakingDims?: DimensionKey[];
}): FinalResult {
  const { fcScores, sjtScores, consistencyFlags = [], sleepingStrengths = [], possibleFakingDims = [] } = params;

  const dimInterpretations = interpretAllDimensions(fcScores, sjtScores);
  const profileScore = computeProfileScore(sjtScores);
  const { css, breakdown: cssBreakdown } = computeCSS(sjtScores, dimInterpretations);
  const pgs = computePGS(sjtScores);
  const finalScore = Math.max(0, Math.min(100, profileScore - css - pgs));

  const rawCategory = scoreToCategory(profileScore);
  const overrides = computeOverrides(sjtScores, dimInterpretations);

  const calculatedCategory = scoreToCategory(finalScore);
  const finalCategory = overrides.forcedCategory
    ? worseCategory(calculatedCategory, overrides.forcedCategory)
    : calculatedCategory;

  const THRESHOLDS = [62, 52, 41, 28];
  const borderlineFlag = THRESHOLDS.some((t) => Math.abs(finalScore - t) <= 3)
    ? `borderline_${finalCategory.replace(/\s+/g, '_').toLowerCase()}`
    : undefined;

  const dimensionAlerts = DIMENSIONS.filter((d) => (sjtScores[d.key] ?? 50) < 45).map((d) => ({
    dimension: d.key,
    note: `${d.label} rendah (SJT ${(sjtScores[d.key] ?? 0).toFixed(0)}%)`,
    type: 'risk',
  }));

  const strengths = [...DIMENSIONS]
    .sort((a, b) => (sjtScores[b.key] ?? 0) - (sjtScores[a.key] ?? 0))
    .slice(0, 3)
    .map((d) => d.key);
  const gaps = [...DIMENSIONS]
    .sort((a, b) => (sjtScores[a.key] ?? 0) - (sjtScores[b.key] ?? 0))
    .slice(0, 3)
    .map((d) => d.key);

  const profileFlags = [
    ...consistencyFlags,
    ...sleepingStrengths.map((d) => `sleeping_strength_${d}`),
    ...possibleFakingDims.map((d) => `possible_faking_${d}`),
  ];

  return {
    fcScores,
    sjtScores,
    dimInterpretations,
    profileScore,
    css,
    pgs,
    cssBreakdown,
    finalScore,
    rawCategory,
    finalCategory,
    wasDowngraded: finalCategory !== rawCategory,
    downgradeReason: overrides.forcedCategory ? `Override to ${overrides.forcedCategory}` : undefined,
    overrides,
    profileFlags,
    dimensionAlerts,
    consistencyFlags,
    borderlineFlag,
    sleepingStrengths,
    possibleFakingDims,
    strengths,
    gaps,
    leaderSummary: buildLeaderSummary(finalCategory, profileScore, css, pgs, strengths, gaps, profileFlags),
  };
}

function worseCategory(a: PlayerCategory, b: PlayerCategory): PlayerCategory {
  const order: Record<PlayerCategory, number> = {
    'A Player': 4,
    'B Solid Player': 3,
    'B Player': 2,
    'C Player': 1,
    'C Player Kritis': 0,
  };
  return order[a] <= order[b] ? a : b;
}

function buildLeaderSummary(
  finalCategory: PlayerCategory,
  profileScore: number,
  css: number,
  pgs: number,
  strengths: DimensionKey[],
  gaps: DimensionKey[],
  flags: string[],
): string {
  const flagText = flags.length ? `Flags: ${flags.join(', ')}.` : '';
  return `Kategori ${finalCategory}. Profile Score ${profileScore}%. CSS ${css}, PGS ${pgs}. Kekuatan: ${strengths.join(
    ', ',
  )}. Gap: ${gaps.join(', ')}. ${flagText}`.trim();
}
