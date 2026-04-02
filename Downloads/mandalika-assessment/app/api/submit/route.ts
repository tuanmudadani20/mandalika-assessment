import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sjtQuestions, tetradQuestions } from '@/lib/assessment-data'
import { saveSubmission } from '@/lib/kv'
import { computeScores } from '@/lib/scoring'
import type { SJTAnswer, Submission, SubmissionPayload, SubmissionTiming, TetradAnswer } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SubmissionPayload>

    if (!isValidSubmissionPayload(body)) {
      return NextResponse.json(
        { error: 'Payload tidak valid. Pastikan semua bagian assessment terisi lengkap.' },
        { status: 400 },
      )
    }

    const submission: Submission = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      name: body.name!.trim(),
      dept: body.dept!.trim(),
      role: body.role!.trim(),
      tenure: body.tenure!.trim(),
      timings: body.timings!,
      tetradAnswers: body.tetradAnswers!,
      sjtAnswers: body.sjtAnswers!,
      essayAnswers: body.essayAnswers!.map((answer) => answer.trim()),
      scores: computeScores(body.tetradAnswers!, body.sjtAnswers!),
      leaderNotes: '',
    }

    await saveSubmission(submission)

    return NextResponse.json({ id: submission.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function isValidSubmissionPayload(payload: Partial<SubmissionPayload>) {
  const hasIdentity =
    typeof payload.name === 'string' &&
    payload.name.trim().length > 0 &&
    typeof payload.dept === 'string' &&
    payload.dept.trim().length > 0 &&
    typeof payload.role === 'string' &&
    payload.role.trim().length > 0 &&
    typeof payload.tenure === 'string' &&
    payload.tenure.trim().length > 0

  const hasTetradAnswers =
    Array.isArray(payload.tetradAnswers) &&
    payload.tetradAnswers.length === tetradQuestions.length &&
    payload.tetradAnswers.every(isValidChoiceAnswer)

  const hasSjtAnswers =
    Array.isArray(payload.sjtAnswers) &&
    payload.sjtAnswers.length === sjtQuestions.length &&
    payload.sjtAnswers.every(isValidChoiceAnswer)

  const hasEssayAnswers =
    Array.isArray(payload.essayAnswers) &&
    payload.essayAnswers.length >= 0 &&
    payload.essayAnswers.every((answer) => typeof answer === 'string')

  const hasTiming = isValidTiming(payload.timings)

  return hasIdentity && hasTetradAnswers && hasSjtAnswers && hasEssayAnswers && hasTiming
}

function isValidChoiceAnswer(answer: TetradAnswer | SJTAnswer) {
  return (
    Number.isInteger(answer?.mostIndex) &&
    Number.isInteger(answer?.leastIndex) &&
    answer.mostIndex >= 0 &&
    answer.mostIndex <= 3 &&
    answer.leastIndex >= 0 &&
    answer.leastIndex <= 3 &&
    answer.mostIndex !== answer.leastIndex
  )
}

function isValidTiming(timing: SubmissionTiming | undefined) {
  if (!timing) return false
  if (
    typeof timing.startedAt !== 'string' ||
    typeof timing.finishedAt !== 'string' ||
    typeof timing.totalSeconds !== 'number'
  ) {
    return false
  }

  const tetrad = timing.tetrad
  const sjt = timing.sjt
  const essay = timing.essay

  if (!tetrad || typeof tetrad.start !== 'string') return false
  if (tetrad.end && typeof tetrad.end !== 'string') return false
  if (!sjt || typeof sjt.start !== 'string') return false
  if (sjt.end && typeof sjt.end !== 'string') return false
  if (essay) {
    if (essay.start && typeof essay.start !== 'string') return false
    if (essay.end && typeof essay.end !== 'string') return false
  }

  return true
}
