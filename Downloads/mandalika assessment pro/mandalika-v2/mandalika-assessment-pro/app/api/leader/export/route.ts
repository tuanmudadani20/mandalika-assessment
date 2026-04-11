import { NextResponse } from 'next/server';

import { getSession, listSessions } from '@/lib/kv/session';

const LEADER_PASSWORD = process.env.LEADER_PASSWORD ?? 'mandalikaHR2026';

export async function GET(request: Request) {
  const isAuthorized = request.headers.get('x-leader-password') === LEADER_PASSWORD;
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await listSessions(1000);
  const full = (await Promise.all(sessions.map((s) => getSession(s.sessionId)))).filter(Boolean);
  return NextResponse.json({ sessions: full });
}
