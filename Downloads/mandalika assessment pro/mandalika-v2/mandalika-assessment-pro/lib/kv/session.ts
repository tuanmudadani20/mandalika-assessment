import { randomUUID } from 'crypto';

import { kvDel, kvGet, kvMGet, kvSet, kvZAdd, kvZRange, kvZRem } from './client';
import { AssessmentSession, BEIAnalysisResult, FinalResult, TetradAnswer, SJTAnswer, BEIAnswer } from '@/lib/scoring/types';

const SESSION_KEY = (id: string) => `session:${id}`;
const ACCESS_KEY = (code: string) => `code:${code}`;
const INDEX_KEY = 'sessions:index';

const BEI_ROLES = ['manager', 'kepala unit'];

export function requiresBEI(session: AssessmentSession): boolean {
  const pos = session.profile?.position?.toLowerCase().trim();
  return pos ? BEI_ROLES.includes(pos) : false;
}

export async function createSession(accessCode?: string): Promise<AssessmentSession> {
  if (accessCode) {
    const code = await kvGet<{ used?: boolean; sessionId?: string }>(ACCESS_KEY(accessCode));
    if (!code || code.used) {
      throw new Error('invalid_access_code');
    }
  }

  const sessionId = randomUUID();
  const createdAt = new Date().toISOString();
  const session: AssessmentSession = {
    sessionId,
    status: 'created',
    createdAt,
  };

  await kvSet(SESSION_KEY(sessionId), session);
  if (accessCode) {
    await kvSet(ACCESS_KEY(accessCode), { used: true, sessionId });
  }
  await kvZAdd(INDEX_KEY, { score: Date.now(), member: sessionId });

  return session;
}

export async function getSession(sessionId: string): Promise<AssessmentSession | null> {
  return kvGet<AssessmentSession>(SESSION_KEY(sessionId));
}

export async function saveProfile(sessionId: string, profile: NonNullable<AssessmentSession['profile']>) {
  const session = await getRequiredSession(sessionId);
  const updated: AssessmentSession = {
    ...session,
    profile,
    status: 'tetrad',
  };
  await kvSet(SESSION_KEY(sessionId), updated);
  return updated;
}

export async function saveTetradAnswers(sessionId: string, answers: TetradAnswer[], timingMs: number) {
  const session = await getRequiredSession(sessionId);
  const updated: AssessmentSession = {
    ...session,
    tetradAnswers: answers,
    timing: { ...(session.timing ?? {}), tetradMs: timingMs },
    status: 'sjt',
  };
  await kvSet(SESSION_KEY(sessionId), updated);
  return updated;
}

export async function saveSJTAnswers(sessionId: string, answers: SJTAnswer[], timingMs: number) {
  const session = await getRequiredSession(sessionId);
  const needBEI = requiresBEI(session);
  const updated: AssessmentSession = {
    ...session,
    sjtAnswers: answers,
    timing: { ...(session.timing ?? {}), sjtMs: timingMs },
    status: needBEI ? 'bei' : 'scoring',
  };
  await kvSet(SESSION_KEY(sessionId), updated);
  return updated;
}

export async function saveBEIAnswers(sessionId: string, answers: BEIAnswer[], timingMs: number) {
  const session = await getRequiredSession(sessionId);
  const updated: AssessmentSession = {
    ...session,
    beiAnswers: answers,
    timing: { ...(session.timing ?? {}), beiMs: timingMs },
    status: 'scoring',
  };
  await kvSet(SESSION_KEY(sessionId), updated);
  return updated;
}

export async function saveAnalysis(
  sessionId: string,
  data: {
    fcScores: AssessmentSession['fcScores'];
    sjtScores: AssessmentSession['sjtScores'];
    beiScores: AssessmentSession['beiScores'];
    beiAnalysis: BEIAnalysisResult[];
    psychometricScores: AssessmentSession['psychometricScores'];
    dimensionScores: AssessmentSession['dimensionScores'];
    dimInterpretations?: AssessmentSession['dimInterpretations'];
    profileScore?: AssessmentSession['profileScore'];
    finalResult: FinalResult;
    consistencyFlags?: string[];
    inconsistencyFlags?: string[];
  },
) {
  const session = await getRequiredSession(sessionId);
  const updated: AssessmentSession = {
    ...session,
    ...data,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };
  await kvSet(SESSION_KEY(sessionId), updated);
  return updated;
}

export async function listSessions(limit = 50): Promise<AssessmentSession[]> {
  const ids = await kvZRange(INDEX_KEY, -limit, -1);
  if (!ids.length) return [];
  const keys = ids.map((id) => SESSION_KEY(id));
  const sessions = await kvMGet<AssessmentSession>(keys);
  return sessions.filter(Boolean) as AssessmentSession[];
}

export async function deleteSession(sessionId: string) {
  await kvDel(SESSION_KEY(sessionId));
  await kvZRem(INDEX_KEY, sessionId);
}

export async function deleteAllSessions() {
  const ids = await kvZRange(INDEX_KEY, 0, -1);
  await Promise.all(ids.map((id) => kvDel(SESSION_KEY(id))));
  // clear index
  await kvDel(INDEX_KEY);
}

async function getRequiredSession(sessionId: string): Promise<AssessmentSession> {
  const session = await getSession(sessionId);
  if (!session) throw new Error('session_not_found');
  return session;
}
