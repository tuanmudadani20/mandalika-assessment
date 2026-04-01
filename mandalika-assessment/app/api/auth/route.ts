import { NextRequest, NextResponse } from 'next/server'
import { checkLeaderPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { password?: string }
  const password = typeof body.password === 'string' ? body.password : ''

  if (!checkLeaderPassword(password)) {
    return NextResponse.json({ error: 'Password salah.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
