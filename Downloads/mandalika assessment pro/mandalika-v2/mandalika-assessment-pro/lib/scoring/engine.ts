import type { DimensionKey, DimInterpretation, PlayerCategory, ScoringResult } from './types';

const L1: DimensionKey[] = ['integritas', 'ownership', 'standarPribadi', 'emotionallyControlled'];
const L2: DimensionKey[] = ['caraBerpikir', 'responsFeedback', 'growthMindset', 'conscientious'];
const ALL_DIMS: DimensionKey[] = [
  'integritas',
  'ownership',
  'standarPribadi',
  'emotionallyControlled',
  'caraBerpikir',
  'responsFeedback',
  'growthMindset',
  'conscientious',
  'dampakTim',
  'resiliensi',
  'communicationClarity',
  'decisive',
  'innovative',
];

export function interpretDimension(fc: number, sjt: number): DimInterpretation {
  if (sjt >= 55) return fc >= 50 ? 'kuat' : 'sleeping_strength';
  if (sjt < 45) return fc >= 50 ? 'gap_probe' : 'genuine_gap';
  return 'moderate';
}

function cssIntegOwn(sjt: number): number {
  if (sjt >= 50) return 0;
  if (sjt >= 35) return 3;
  if (sjt >= 25) return 7;
  return 12;
}
function cssStd(sjt: number): number {
  if (sjt >= 45) return 0;
  if (sjt >= 30) return 3;
  if (sjt >= 20) return 6;
  return 10;
}
function cssEmot(sjt: number): number {
  if (sjt >= 40) return 0;
  if (sjt >= 25) return 2;
  if (sjt >= 15) return 5;
  return 8;
}
function pgsFn(avgL2Sjt: number): number {
  if (avgL2Sjt >= 55) return 0;
  if (avgL2Sjt >= 50) return 2;
  if (avgL2Sjt >= 40) return 5;
  if (avgL2Sjt >= 30) return 9;
  return 14;
}

export function getCategory(score: number): PlayerCategory {
  if (score >= 62) return 'A Player';
  if (score >= 52) return 'B Solid Player';
  if (score >= 41) return 'B Player';
  if (score >= 28) return 'C Player';
  return 'C Player Kritis';
}

export function computeScore(fcScores: Record<DimensionKey, number>, sjtScores: Record<DimensionKey, number>): ScoringResult {
  const dimResults = ALL_DIMS.map((dim) => ({
    dim,
    fcScore: fcScores[dim] ?? 50,
    sjtScore: sjtScores[dim] ?? 50,
    interpretation: interpretDimension(fcScores[dim] ?? 50, sjtScores[dim] ?? 50),
  }));

  const avgFcL1 = L1.reduce((s, d) => s + (fcScores[d] ?? 50), 0) / 4;
  const avgFcL2 = L2.reduce((s, d) => s + (fcScores[d] ?? 50), 0) / 4;
  const profileScore = Math.round((avgFcL1 * 0.65 + avgFcL2 * 0.35) * 10) / 10;

  const getAdjustedCss = (dim: DimensionKey, rawCss: number): number => {
    const interp = interpretDimension(fcScores[dim] ?? 50, sjtScores[dim] ?? 50);
    return interp === 'sleeping_strength' ? 0 : rawCss;
  };

  const cssBreakdown = {
    integritas: getAdjustedCss('integritas', cssIntegOwn(sjtScores.integritas ?? 50)),
    ownership: getAdjustedCss('ownership', cssIntegOwn(sjtScores.ownership ?? 50)),
    standarPribadi: getAdjustedCss('standarPribadi', cssStd(sjtScores.standarPribadi ?? 50)),
    emotionallyControlled: getAdjustedCss('emotionallyControlled', cssEmot(sjtScores.emotionallyControlled ?? 50)),
  };
  const css = Object.values(cssBreakdown).reduce((s, v) => s + v, 0);

  const avgSjtL2 = L2.reduce((s, d) => s + (sjtScores[d] ?? 50), 0) / 4;
  const pgs = pgsFn(avgSjtL2);

  const finalScore = Math.max(0, Math.round((profileScore - css - pgs) * 10) / 10);
  let finalCategory = getCategory(finalScore);
  let overrideReason: string | undefined;

  if ((sjtScores.integritas ?? 50) < 25 || (sjtScores.ownership ?? 50) < 25) {
    finalCategory = 'C Player Kritis';
    overrideReason = 'character_collapse';
  }

  const L1_THRESHOLDS: Record<string, number> = {
    integritas: 50,
    ownership: 50,
    standarPribadi: 45,
    emotionallyControlled: 40,
  };
  const l1GenuineGaps = L1.filter(
    (d) =>
      (sjtScores[d] ?? 50) < (L1_THRESHOLDS[d] ?? 50) &&
      ['genuine_gap', 'gap_probe'].includes(interpretDimension(fcScores[d] ?? 50, sjtScores[d] ?? 50)),
  );
  if (l1GenuineGaps.length >= 3 && !['C Player', 'C Player Kritis'].includes(finalCategory)) {
    finalCategory = 'C Player';
    overrideReason = 'character_foundation_absent';
  }

  const THRESHOLDS = [62, 52, 41, 28];
  const borderlineFlag = THRESHOLDS.some((t) => Math.abs(finalScore - t) <= 3) ? `borderline` : undefined;

  const sleepingStrengths = ALL_DIMS.filter(
    (d) => interpretDimension(fcScores[d] ?? 50, sjtScores[d] ?? 50) === 'sleeping_strength',
  );
  const genuineGaps = ALL_DIMS.filter((d) =>
    ['genuine_gap', 'gap_probe'].includes(interpretDimension(fcScores[d] ?? 50, sjtScores[d] ?? 50)),
  );
  const possibleFaking = L1.filter((d) => (fcScores[d] ?? 50) > 65 && (sjtScores[d] ?? 50) < 35);

  return {
    fcScores,
    sjtScores,
    dimResults,
    profileScore,
    css,
    cssBreakdown,
    pgs,
    finalScore,
    finalCategory,
    sleepingStrengths,
    genuineGaps,
    possibleFaking,
    overrideReason,
    borderlineFlag,
  };
}

export { L1, L2, ALL_DIMS };
