import { NextRequest, NextResponse } from 'next/server'
import { checkLeaderPassword } from '@/lib/auth'
import { getAllSubmissions } from '@/lib/kv'

export async function GET(request: NextRequest) {
  const password = request.nextUrl.searchParams.get('pw') || ''
  if (!checkLeaderPassword(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const submissions = await getAllSubmissions()
  return NextResponse.json(submissions)
}
