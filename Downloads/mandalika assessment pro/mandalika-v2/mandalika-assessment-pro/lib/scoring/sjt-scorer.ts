import { SJT_QUESTIONS } from '@/lib/questions/sjt';
import { DIMENSIONS } from './dimensions';
import { ScoreMap, SJTAnswer } from './types';

const zeroScores = (): ScoreMap =>
  DIMENSIONS.reduce((acc, dim) => {
    acc[dim.key] = 0;
    return acc;
  }, {} as ScoreMap);

const DIM_COUNTS: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  SJT_QUESTIONS.forEach((q) => {
    counts[q.dim] = (counts[q.dim] || 0) + 1;
  });
  return counts;
})();

export function computeSJTScores(answers: SJTAnswer[]): ScoreMap {
  const totals = zeroScores();

  SJT_QUESTIONS.forEach((question, index) => {
    const answer = answers[index];
    if (!answer) return;

    const mostScore = question.mostScores[answer.mostIndex] ?? 0;
    const leastScore = question.leastScores[answer.leastIndex] ?? 0;
    totals[question.dim] += mostScore + leastScore;
  });

  const normalized = zeroScores();
  Object.entries(totals).forEach(([dim, raw]) => {
    const n = DIM_COUNTS[dim] ?? 0;
    const min = -1 * n;
    const max = 6 * n;
    normalized[dim as keyof ScoreMap] = n === 0 ? 0 : Math.round(((raw - min) / (max - min)) * 100);
  });

  return normalized;
}
