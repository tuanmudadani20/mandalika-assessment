import { TETRADS } from '@/lib/questions/tetrads';
import { DIMENSIONS } from './dimensions';
import { ScoreMap, TetradAnswer } from './types';

const zeroScores = (): ScoreMap =>
  DIMENSIONS.reduce((acc, dim) => {
    acc[dim.key] = 0;
    return acc;
  }, {} as ScoreMap);

const DIM_OCCURRENCES: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  TETRADS.forEach((tetrad) => {
    tetrad.items.forEach((item) => {
      counts[item.dim] = (counts[item.dim] || 0) + 1;
    });
  });
  return counts;
})();

export function computeFCScores(answers: TetradAnswer[]): ScoreMap {
  const totals = zeroScores();

  TETRADS.forEach((tetrad, index) => {
    const answer = answers[index];
    if (!answer) return;

    const { mostIndex, leastIndex } = answer;

    tetrad.items.forEach((item, itemIndex) => {
      let delta = 0;
      if (itemIndex === mostIndex) {
        delta = item.keying === 'P' ? 2 : -2;
      } else if (itemIndex === leastIndex) {
        delta = item.keying === 'P' ? -2 : 2;
      }
      totals[item.dim] += delta;
    });
  });

  const normalized = zeroScores();
  Object.entries(totals).forEach(([dim, raw]) => {
    const count = DIM_OCCURRENCES[dim] ?? 0;
    const min = -2 * count;
    const max = 2 * count;
    normalized[dim as keyof ScoreMap] = count === 0 ? 0 : Math.round(((raw - min) / (max - min)) * 100);
  });

  return normalized;
}

export function detectConsistencyWarnings(answers: TetradAnswer[]): string[] {
  const flags: string[] = [];

  TETRADS.forEach((tetrad, index) => {
    if (tetrad.type !== 'mixed') return;
    const answer = answers[index];
    if (!answer) return;

    const mostItem = tetrad.items[answer.mostIndex];
    if (mostItem && mostItem.keying === 'N') {
      flags.push(`consistency_warning_${mostItem.dim}`);
    }
  });

  return flags;
}
