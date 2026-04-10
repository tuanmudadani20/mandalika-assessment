import { NextResponse } from 'next/server';

import { createSession } from '@/lib/kv/session';
import { AccessCodeSchema } from '@/lib/kv/schemas';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const { accessCode } = AccessCodeSchema.parse(body);

    const session = await createSession(accessCode);
    return NextResponse.json({ sessionId: session.sessionId });
  } catch (error: any) {
    if (error?.message === 'invalid_access_code') {
      return NextResponse.json({ error: 'Invalid or used access code' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create session', detail: `${error}` }, { status: 500 });
  }
}
