import { randomUUID } from 'crypto'
import { kv } from '@vercel/kv'
import type { CandidateAssessmentV2 } from './types'

type MemoryStore = {
  submissions: Map<string, CandidateAssessmentV2>
  ids: string[]
}

const globalStore = globalThis as typeof globalThis & {
  __mandalikaAssessmentV2Store?: MemoryStore
}

const memoryStore =
  globalStore.__mandalikaAssessmentV2Store ??
  (globalStore.__mandalikaAssessmentV2Store = {
    submissions: new Map<string, CandidateAssessmentV2>(),
    ids: [],
  })

function useKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

function submissionKey(id: string) {
  return `subv2:${id}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidSubmission(value: unknown): value is CandidateAssessmentV2 {
  if (!isRecord(value)) return false
  const base =
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.position === 'string' &&
    typeof value.timestamp === 'string' &&
    Array.isArray(value.tetradAnswers) &&
    Array.isArray(value.sjtAnswers) &&
    Array.isArray(value.beiAnswers) &&
    isRecord(value.tetradScores) &&
    isRecord(value.sjtScores) &&
    isRecord(value.beiScores) &&
    isRecord(value.finalScores) &&
    isRecord(value.layer1Gate) &&
    isRecord(value.fakingAlert) &&
    typeof value.classification === 'string'

  return base
}

export async function saveSubmissionV2(submission: Omit<CandidateAssessmentV2, 'id' | 'timestamp'>) {
  const withId: CandidateAssessmentV2 = {
    ...submission,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
  }

  if (useKV()) {
    await kv.set(submissionKey(withId.id), withId)
    await kv.lrem('subv2:list', 0, withId.id)
    await kv.lpush('subv2:list', withId.id)
    return withId
  }

  memoryStore.submissions.set(withId.id, withId)
  memoryStore.ids = [withId.id, ...memoryStore.ids.filter((id) => id !== withId.id)]
  return withId
}

export async function getAllSubmissionsV2() {
  if (useKV()) {
    const ids = await kv.lrange<string>('subv2:list', 0, -1)
    const uniqueIds = Array.from(new Set(ids))
    const submissions = await Promise.all(
      uniqueIds.map(async (id) => kv.get<CandidateAssessmentV2>(submissionKey(id))),
    )

    return submissions.filter((item): item is CandidateAssessmentV2 => isValidSubmission(item))
  }

  return memoryStore.ids
    .map((id) => memoryStore.submissions.get(id))
    .filter((item): item is CandidateAssessmentV2 => isValidSubmission(item))
}

export async function getSubmissionV2(id: string) {
  if (useKV()) {
    const submission = await kv.get<CandidateAssessmentV2>(submissionKey(id))
    return isValidSubmission(submission) ? submission : null
  }

  const submission = memoryStore.submissions.get(id) ?? null
  return isValidSubmission(submission) ? submission : null
}
