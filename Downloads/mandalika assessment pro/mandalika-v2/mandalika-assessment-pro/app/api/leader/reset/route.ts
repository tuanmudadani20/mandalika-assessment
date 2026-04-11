import { NextResponse } from 'next/server';

import { deleteAllSessions } from '@/lib/kv/session';

const LEADER_PASSWORD = process.env.LEADER_PASSWORD ?? 'mandalikaHR2026';

export async function POST(request: Request) {
  const isAuthorized = request.headers.get('x-leader-password') === LEADER_PASSWORD;
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await deleteAllSessions();
  return NextResponse.json({ ok: true, cleared: true });
}

