import { kv } from '@vercel/kv'
import { dimensionOrder } from './assessment-data'
import type { Submission } from './types'

type MemoryStore = {
  submissions: Map<string, Submission>
  ids: string[]
}

const globalStore = globalThis as typeof globalThis & {
  __mandalikaAssessmentStore?: MemoryStore
}

const memoryStore =
  globalStore.__mandalikaAssessmentStore ??
  (globalStore.__mandalikaAssessmentStore = {
    submissions: new Map<string, Submission>(),
    ids: [],
  })

function useKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

function submissionKey(id: string) {
  return `sub:${id}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isChoiceAnswer(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.mostIndex === 'number' &&
    typeof value.leastIndex === 'number'
  )
}

function isValidSubmission(value: unknown): value is Submission {
  if (!isRecord(value)) return false
  if (
    typeof value.id !== 'string' ||
    typeof value.timestamp !== 'string' ||
    !isRecord(value.timings) ||
    typeof value.name !== 'string' ||
    typeof value.dept !== 'string' ||
    typeof value.role !== 'string' ||
    typeof value.tenure !== 'string' ||
    typeof value.leaderNotes !== 'string'
  ) {
    return false
  }

  if (
    typeof value.timings.startedAt !== 'string' ||
    typeof value.timings.finishedAt !== 'string' ||
    typeof value.timings.totalSeconds !== 'number'
  ) {
    return false
  }

  if (
    !Array.isArray(value.tetradAnswers) ||
    !Array.isArray(value.sjtAnswers) ||
    !Array.isArray(value.essayAnswers) ||
    !value.tetradAnswers.every(isChoiceAnswer) ||
    !value.sjtAnswers.every(isChoiceAnswer) ||
    !value.essayAnswers.every((item) => typeof item === 'string')
  ) {
    return false
  }

  if (!isRecord(value.scores) || !isRecord(value.scores.dims)) return false

  const scores = value.scores
  const dims = scores.dims as Record<string, unknown>

  if (
    typeof scores.layer1Avg !== 'number' ||
    typeof scores.layer2Avg !== 'number' ||
    typeof scores.layer3Avg !== 'number' ||
    typeof scores.layer4Avg !== 'number' ||
    typeof scores.weightedScore !== 'number' ||
    typeof scores.finalScore !== 'number' ||
    typeof scores.rawCategory !== 'string' ||
    typeof scores.finalCategory !== 'string' ||
    typeof scores.wasDowngraded !== 'boolean' ||
    !isRecord(scores.gate1) ||
    !isRecord(scores.gate2) ||
    !Array.isArray(scores.profileFlags) ||
    !Array.isArray(scores.strengths) ||
    !Array.isArray(scores.gaps)
  ) {
    return false
  }

  if (
    typeof scores.gate1.passed !== 'boolean' ||
    typeof scores.gate1.failedCount !== 'number' ||
    typeof scores.gate1.criticalCount !== 'number' ||
    typeof scores.gate2.passed !== 'boolean' ||
    typeof scores.gate2.average !== 'number'
  ) {
    return false
  }

  return dimensionOrder.every((key) => typeof dims[key] === 'number')
}

export async function saveSubmission(submission: Submission) {
  if (useKV()) {
    await kv.set(submissionKey(submission.id), submission)
    await kv.lrem('sub:list', 0, submission.id)
    await kv.lpush('sub:list', submission.id)
    return
  }

  memoryStore.submissions.set(submission.id, submission)
  memoryStore.ids = [submission.id, ...memoryStore.ids.filter((id) => id !== submission.id)]
}

export async function getSubmission(id: string) {
  if (useKV()) {
    const submission = await kv.get<Submission>(submissionKey(id))
    return isValidSubmission(submission) ? submission : null
  }

  const submission = memoryStore.submissions.get(id) ?? null
  return isValidSubmission(submission) ? submission : null
}

export async function updateSubmission(id: string, partial: Partial<Submission>) {
  const existing = await getSubmission(id)
  if (!existing) return null

  const updated = { ...existing, ...partial }
  await saveSubmission(updated)
  return updated
}

export async function deleteSubmission(id: string) {
  if (useKV()) {
    await kv.del(submissionKey(id))
    await kv.lrem('sub:list', 0, id)
    return
  }

  memoryStore.submissions.delete(id)
  memoryStore.ids = memoryStore.ids.filter((item) => item !== id)
}

export async function getAllSubmissions() {
  if (useKV()) {
    const ids = await kv.lrange<string>('sub:list', 0, -1)
    const uniqueIds = Array.from(new Set(ids))
    const submissions = await Promise.all(
      uniqueIds.map(async (id) => kv.get<Submission>(submissionKey(id))),
    )

    return submissions
      .filter((item): item is Submission => isValidSubmission(item))
      .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
  }

  return memoryStore.ids
    .map((id) => memoryStore.submissions.get(id))
    .filter((item): item is Submission => isValidSubmission(item))
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
}
