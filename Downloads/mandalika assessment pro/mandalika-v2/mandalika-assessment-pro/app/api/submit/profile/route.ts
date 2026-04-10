import { NextResponse } from 'next/server';

import { saveProfile } from '@/lib/kv/session';
import { ProfileSchema } from '@/lib/kv/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = ProfileSchema.parse(body);
    const session = await saveProfile(data.sessionId, {
      name: data.name,
      email: data.email,
      department: data.department,
      position: data.position,
      tenure: data.tenure,
    });

    return NextResponse.json({ ok: true, status: session.status });
  } catch (error: any) {
    const message = error?.issues?.[0]?.message ?? `${error}`;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
