import { NextResponse } from 'next/server';

import { getSession, requiresBEI, saveBEIAnswers } from '@/lib/kv/session';
import { BEISubmitSchema } from '@/lib/kv/schemas';
import { runScoring } from '@/lib/scoring/pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = BEISubmitSchema.parse(body);
    const session = await getSession(data.sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    if (!requiresBEI(session)) {
      return NextResponse.json({ error: 'BEI tidak diperlukan untuk jabatan ini' }, { status: 403 });
    }
    const saved = await saveBEIAnswers(data.sessionId, data.answers, data.timingMs);

    // Fire-and-forget scoring pipeline
    runScoring(data.sessionId).catch((err) => console.error('Scoring error', err));

    return NextResponse.json({ ok: true, message: 'Analysis started', status: saved.status });
  } catch (error: any) {
    const message = error?.issues?.[0]?.message ?? `${error}`;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
