import { DIMENSIONS } from './dimensions';
import { ConfidenceLevel, ScoreMap } from './types';

interface TriangulationResult {
  dimensionScores: ScoreMap;
  psychometricScores: ScoreMap;
  inconsistencyFlags: string[];
}

export function triangulateScores(
  fcScores: ScoreMap,
  sjtScores: ScoreMap,
  beiScores: ScoreMap,
  beiConfidence: Record<string, ConfidenceLevel>,
): TriangulationResult {
  const dimensionScores: ScoreMap = DIMENSIONS.reduce((acc, dim) => {
    acc[dim.key] = 0;
    return acc;
  }, {} as ScoreMap);
  const psychometricScores: ScoreMap = { ...dimensionScores };
  const inconsistencyFlags: string[] = [];

  DIMENSIONS.forEach((dim) => {
    const fc = fcScores[dim.key] ?? 0;
    const sjt = sjtScores[dim.key] ?? 0;
    const bei = beiScores[dim.key] ?? 0;

    const psychometric = fc * 0.55 + sjt * 0.45;
    psychometricScores[dim.key] = Math.round(psychometric);

    const confidence = beiConfidence[dim.key] ?? 'medium';
    const beiWeight = confidence === 'high' ? 0.4 : confidence === 'low' ? 0.2 : 0.3;
    const psychoWeight = 1 - beiWeight;

    const combined = psychometric * psychoWeight + bei * beiWeight;
    dimensionScores[dim.key] = Math.round(combined);

    if (Math.abs(psychometric - bei) > 25) {
      inconsistencyFlags.push(`inconsistency_${dim.key}`);
    }
  });

  return { dimensionScores, psychometricScores, inconsistencyFlags };
}
