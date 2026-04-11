import { NextResponse } from 'next/server';

import { listSessions } from '@/lib/kv/session';

const LEADER_PASSWORD = process.env.LEADER_PASSWORD ?? 'mandalikaHR2026';

export async function GET(request: Request) {
  try {
    const isAuthorized = request.headers.get('x-leader-password') === LEADER_PASSWORD;
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await listSessions(100);
    const url = process.env.KV_REST_API_URL;
    console.log('leader/sessions ok', {
      hasKvUrl: Boolean(process.env.KV_REST_API_URL),
      hasKvToken: Boolean(process.env.KV_REST_API_TOKEN),
      count: sessions.length,
      urlLen: url?.length ?? 0,
      urlLast: url ? url.charCodeAt(url.length - 1) : null,
    });
    return NextResponse.json({ sessions });
  } catch (err: any) {
    console.error('leader/sessions error', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
