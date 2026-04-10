import { analyzeBEIAnswers, computeBEIScores, deriveBEIConfidence } from './bei-scorer';
import { computeFCScores, detectConsistencyWarnings } from './fc-scorer';
import { computeScore } from './mtcs';
import { computeSJTScores } from './sjt-scorer';
import { getSession, saveAnalysis } from '@/lib/kv/session';
import { DimensionKey } from './types';

export async function runScoring(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session) throw new Error('session_not_found');
  if (!session.tetradAnswers || !session.sjtAnswers) {
    throw new Error('incomplete_session');
  }

  const fcScores = computeFCScores(session.tetradAnswers);
  const consistencyFlags = detectConsistencyWarnings(session.tetradAnswers);

  const sjtScores = computeSJTScores(session.sjtAnswers);
  const sleepingStrengths = detectSleepingStrengths(fcScores, sjtScores);
  const possibleFakingDims = detectPossibleFaking(fcScores, sjtScores);

  const beiAnalysis = session.beiAnswers ? await analyzeBEIAnswers(session.beiAnswers) : [];
  const beiScores = beiAnalysis.length ? computeBEIScores(beiAnalysis) : undefined;
  const beiConfidence = beiAnalysis.length ? deriveBEIConfidence(beiAnalysis) : undefined;

  const finalResult = computeScore({
    fcScores,
    sjtScores,
    consistencyFlags,
    sleepingStrengths,
    possibleFakingDims,
  });

  await saveAnalysis(sessionId, {
    fcScores,
    sjtScores,
    beiScores,
    beiAnalysis,
    psychometricScores: undefined,
    dimensionScores: sjtScores,
    dimInterpretations: finalResult.dimInterpretations,
    profileScore: finalResult.profileScore,
    finalResult,
    consistencyFlags,
    inconsistencyFlags: [],
  });
}

function detectSleepingStrengths(fc: Record<DimensionKey, number>, sjt: Record<DimensionKey, number>): DimensionKey[] {
  return (Object.keys(fc) as DimensionKey[]).filter((dim) => (fc[dim] ?? 50) < 40 && (sjt[dim] ?? 0) > 65);
}

function detectPossibleFaking(fc: Record<DimensionKey, number>, sjt: Record<DimensionKey, number>): DimensionKey[] {
  const L1: DimensionKey[] = ['integritas', 'ownership', 'standarPribadi', 'emotionallyControlled'];
  return L1.filter((dim) => (fc[dim] ?? 0) > 65 && (sjt[dim] ?? 0) < 35);
}
