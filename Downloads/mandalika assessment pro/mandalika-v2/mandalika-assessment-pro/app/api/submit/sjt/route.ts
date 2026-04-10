import { NextResponse } from 'next/server';

import { saveSJTAnswers } from '@/lib/kv/session';
import { SJTSubmitSchema } from '@/lib/kv/schemas';
import { runScoring } from '@/lib/scoring/pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = SJTSubmitSchema.parse(body);
    const session = await saveSJTAnswers(data.sessionId, data.answers, data.timingMs);
    if (session.status === 'scoring') {
      runScoring(data.sessionId).catch((err) => console.error('Scoring error', err));
    }
    return NextResponse.json({ ok: true, status: session.status });
  } catch (error: any) {
    const message = error?.issues?.[0]?.message ?? `${error}`;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
