import { NextResponse } from 'next/server';

import { SessionIdSchema } from '@/lib/kv/schemas';
import { getSession } from '@/lib/kv/session';
import { runScoring } from '@/lib/scoring/pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = SessionIdSchema.parse(body);

    await runScoring(sessionId);
    const session = await getSession(sessionId);

    return NextResponse.json({ ok: true, result: session?.finalResult, status: session?.status });
  } catch (error: any) {
    const message = error?.issues?.[0]?.message ?? `${error}`;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
