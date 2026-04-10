import { NextResponse } from 'next/server';

import { saveTetradAnswers } from '@/lib/kv/session';
import { TetradSubmitSchema } from '@/lib/kv/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = TetradSubmitSchema.parse(body);
    const session = await saveTetradAnswers(data.sessionId, data.answers, data.timingMs);
    return NextResponse.json({ ok: true, status: session.status });
  } catch (error: any) {
    const message = error?.issues?.[0]?.message ?? `${error}`;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
