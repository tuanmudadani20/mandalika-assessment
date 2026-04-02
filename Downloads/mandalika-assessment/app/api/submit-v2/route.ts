import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { saveSubmissionV2 } from '@/lib/kv-v2'
import type { CandidateAssessmentV2 } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CandidateAssessmentV2>

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 })
    }

    const submission: CandidateAssessmentV2 = {
      ...body,
      id: body.id || randomUUID(),
      timestamp: new Date().toISOString(),
    } as CandidateAssessmentV2

    await saveSubmissionV2(submission)

    return NextResponse.json({ id: submission.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function isValidPayload(payload: Partial<CandidateAssessmentV2>) {
  if (!payload) return false
  const hasIdentity =
    typeof payload.name === 'string' &&
    payload.name.trim().length > 0 &&
    typeof payload.position === 'string' &&
    payload.position.trim().length > 0

  const hasAnswers =
    Array.isArray(payload.tetradAnswers) &&
    Array.isArray(payload.sjtAnswers) &&
    Array.isArray(payload.beiAnswers)

  const hasScores =
    payload.tetradScores && payload.sjtScores && payload.finalScores && payload.layer1Gate && payload.fakingAlert

  return hasIdentity && hasAnswers && hasScores
}
