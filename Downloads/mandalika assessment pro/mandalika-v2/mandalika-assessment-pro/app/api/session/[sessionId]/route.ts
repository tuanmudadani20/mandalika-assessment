import { NextResponse } from 'next/server';

import { getSession } from '@/lib/kv/session';
import { AssessmentSession } from '@/lib/scoring/types';

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  const session = await getSession(params.sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const payload = sanitizeSession(session, true);

  return NextResponse.json(payload);
}

function sanitizeSession(session: AssessmentSession, isLeader: boolean): AssessmentSession {
  if (isLeader) return session;

  const sanitized: AssessmentSession = { ...session };
  delete sanitized.tetradAnswers;
  delete sanitized.sjtAnswers;
  delete sanitized.beiAnswers;
  delete sanitized.beiAnalysis;

  if (session.status !== 'completed') {
    delete sanitized.fcScores;
    delete sanitized.sjtScores;
    delete sanitized.beiScores;
    delete sanitized.psychometricScores;
    delete sanitized.dimensionScores;
    delete sanitized.finalResult;
  }

  return sanitized;
}
