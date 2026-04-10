import Anthropic from '@anthropic-ai/sdk';

import { BEI_QUESTIONS, BEI_RUBRICS } from '@/lib/questions/bei';
import { DIMENSIONS } from './dimensions';
import {
  BEIAnalysisResult,
  BEIAnswer,
  ConfidenceLevel,
  DimensionKey,
  ScoreMap,
} from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const rubricMap = BEI_RUBRICS.reduce((acc, rubric) => {
  acc[rubric.questionId] = rubric;
  return acc;
}, {} as Record<string, (typeof BEI_RUBRICS)[number]>);

const questionMap = BEI_QUESTIONS.reduce((acc, q) => {
  acc[q.id] = q;
  return acc;
}, {} as Record<string, (typeof BEI_QUESTIONS)[number]>);

export async function analyzeBEIAnswers(answers: BEIAnswer[]): Promise<BEIAnalysisResult[]> {
  const results: BEIAnalysisResult[] = [];

  for (const answer of answers) {
    const question = questionMap[answer.questionId];
    const rubric = rubricMap[answer.questionId];

    if (!question || !rubric) continue;

    const wordCount = answer.text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < question.minWords) {
      const dimensionScores = rubric.targetDims.reduce<Record<DimensionKey, number>>((acc, dim) => {
        acc[dim] = 1;
        return acc;
      }, {} as Record<DimensionKey, number>);

      results.push({
        questionId: answer.questionId,
        score: 1,
        confidence: 'low',
        reasoning: `Jawaban terlalu singkat (${wordCount}/${question.minWords} kata)`,
        redFlags: ['too_short'],
        dimensionScores,
      });
      continue;
    }

    const content = [
      `Pertanyaan: ${question.title}`,
      `Jawaban: ${answer.text}`,
      `Berikan JSON persis dengan format { "score":1-5, "confidence":"low|medium|high", "reasoning": "...", "redFlags": [...], "dimensionScores": { ${rubric.targetDims.join(
        ', ',
      )} } }`,
    ].join('\n\n');

    let modelResponse: any = null;

    if (process.env.ANTHROPIC_API_KEY) {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 400,
        system: rubric.aiPrompt,
        messages: [{ role: 'user', content }],
      });

      const textBlock = response.content?.[0];
      const text =
        (textBlock as any)?.text ??
        (typeof textBlock === 'string' ? textBlock : JSON.stringify(textBlock ?? '{}'));
      try {
        modelResponse = JSON.parse(text);
      } catch (error) {
        modelResponse = null;
      }
    }

    const score = normalizeScore(modelResponse?.score);
    const confidence = normalizeConfidence(modelResponse?.confidence);
    const redFlags: string[] = Array.isArray(modelResponse?.redFlags) ? modelResponse.redFlags : [];
    const dimensionScores = rubric.targetDims.reduce<Record<DimensionKey, number>>((acc, dim) => {
      const raw = modelResponse?.dimensionScores?.[dim] ?? score;
      const penalized = redFlags.length > 0 ? Math.max(1, raw - 1) : raw;
      acc[dim] = penalized;
      return acc;
    }, {} as Record<DimensionKey, number>);

    results.push({
      questionId: answer.questionId,
      score,
      confidence,
      reasoning: modelResponse?.reasoning ?? 'AI analysis generated',
      redFlags,
      dimensionScores,
    });
  }

  return results;
}

export function computeBEIScores(results: BEIAnalysisResult[]): ScoreMap {
  const totals = DIMENSIONS.reduce((acc, dim) => {
    acc[dim.key] = { sum: 0, count: 0 };
    return acc;
  }, {} as Record<DimensionKey, { sum: number; count: number }>);

  results.forEach((result) => {
    Object.entries(result.dimensionScores).forEach(([dim, score]) => {
      const key = dim as DimensionKey;
      totals[key].sum += score;
      totals[key].count += 1;
    });
  });

  const normalized: ScoreMap = DIMENSIONS.reduce((acc, dim) => {
    const { sum, count } = totals[dim.key];
    if (count === 0) {
      acc[dim.key] = 0;
    } else {
      const avg = sum / count;
      acc[dim.key] = Math.round(((avg - 1) / 4) * 100);
    }
    return acc;
  }, {} as ScoreMap);

  return normalized;
}

export function deriveBEIConfidence(results: BEIAnalysisResult[]): Record<DimensionKey, ConfidenceLevel> {
  const ranking: ConfidenceLevel[] = ['low', 'medium', 'high'];
  const best: Record<DimensionKey, ConfidenceLevel> = DIMENSIONS.reduce((acc, dim) => {
    acc[dim.key] = 'medium';
    return acc;
  }, {} as Record<DimensionKey, ConfidenceLevel>);

  results.forEach((res) => {
    Object.keys(res.dimensionScores).forEach((dim) => {
      const current = best[dim as DimensionKey];
      if (ranking.indexOf(res.confidence) > ranking.indexOf(current)) {
        best[dim as DimensionKey] = res.confidence;
      }
    });
  });

  return best;
}

function normalizeScore(input: any): 1 | 2 | 3 | 4 | 5 {
  const num = Number(input);
  if ([1, 2, 3, 4, 5].includes(num)) return num as 1 | 2 | 3 | 4 | 5;
  return 3;
}

function normalizeConfidence(input: any): ConfidenceLevel {
  if (input === 'high' || input === 'medium' || input === 'low') return input;
  return 'medium';
}
