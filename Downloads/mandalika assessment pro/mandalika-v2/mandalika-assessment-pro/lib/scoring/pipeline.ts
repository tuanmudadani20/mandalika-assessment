import { analyzeBEIAnswers, computeBEIScores, deriveBEIConfidence } from './bei-scorer';
import { computeFCScores, detectConsistencyWarnings } from './fc-scorer';
import { computeScore } from './engine';
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

  const beiAnalysis = session.beiAnswers ? await analyzeBEIAnswers(session.beiAnswers) : [];
  const beiScores = beiAnalysis.length ? computeBEIScores(beiAnalysis) : undefined;
  const beiConfidence = beiAnalysis.length ? deriveBEIConfidence(beiAnalysis) : undefined;

  const finalResult = computeScore(fcScores, sjtScores);
  const dimInterpretations = (finalResult.dimResults ?? []).reduce((acc, d) => {
    acc[d.dim] = d.interpretation;
    return acc;
  }, {} as Record<DimensionKey, any>);

  await saveAnalysis(sessionId, {
    fcScores,
    sjtScores,
    beiScores,
    beiAnalysis,
    psychometricScores: undefined,
    dimensionScores: sjtScores,
    dimInterpretations,
    profileScore: finalResult.profileScore,
    finalResult,
    consistencyFlags,
    inconsistencyFlags: [],
  });
}
