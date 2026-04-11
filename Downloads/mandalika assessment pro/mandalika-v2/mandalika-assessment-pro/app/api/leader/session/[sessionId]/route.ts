import { NextResponse } from 'next/server';

import { deleteSession, getSession } from '@/lib/kv/session';

const LEADER_PASSWORD = process.env.LEADER_PASSWORD ?? 'mandalikaHR2026';

export async function DELETE(request: Request, { params }: { params: { sessionId: string } }) {
  const isAuthorized = request.headers.get('x-leader-password') === LEADER_PASSWORD;
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await getSession(params.sessionId);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  await deleteSession(params.sessionId);
  return NextResponse.json({ ok: true });
}

