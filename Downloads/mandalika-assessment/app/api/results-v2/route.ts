import { NextRequest, NextResponse } from 'next/server'
import { getAllSubmissionsV2 } from '@/lib/kv-v2'
import { checkLeaderPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const pw = request.nextUrl.searchParams.get('pw') || ''
  if (!checkLeaderPassword(pw)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const submissions = await getAllSubmissionsV2()
  return NextResponse.json(submissions)
}
