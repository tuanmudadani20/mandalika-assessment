import { NextRequest, NextResponse } from 'next/server'
import { checkLeaderPassword } from '@/lib/auth'
import { deleteSubmission, getSubmission, updateSubmission } from '@/lib/kv'

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const submission = await getSubmission(context.params.id)
  if (!submission) {
    return NextResponse.json({ error: 'Submission tidak ditemukan.' }, { status: 404 })
  }

  return NextResponse.json(submission)
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const body = (await request.json().catch(() => ({}))) as {
    leaderNotes?: string
    pw?: string
  }

  if (!checkLeaderPassword(body.pw || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (typeof body.leaderNotes !== 'string') {
    return NextResponse.json({ error: 'leaderNotes harus berupa string.' }, { status: 400 })
  }

  const updated = await updateSubmission(context.params.id, {
    leaderNotes: body.leaderNotes,
  })

  if (!updated) {
    return NextResponse.json({ error: 'Submission tidak ditemukan.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, submission: updated })
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const body = (await request.json().catch(() => ({}))) as {
    pw?: string
  }

  if (!checkLeaderPassword(body.pw || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const submission = await getSubmission(context.params.id)
  if (!submission) {
    return NextResponse.json({ error: 'Submission tidak ditemukan.' }, { status: 404 })
  }

  await deleteSubmission(context.params.id)
  return NextResponse.json({ ok: true })
}
