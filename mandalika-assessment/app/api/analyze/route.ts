import { NextRequest, NextResponse } from 'next/server'
import { checkLeaderPassword } from '@/lib/auth'
import { analyzeEssaySubmission } from '@/lib/essay-analysis'
import { getSubmission, updateSubmission } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      id?: string
      apiKey?: string
      leaderNotes?: string
      pw?: string
    }

    if (!checkLeaderPassword(body.pw || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!body.id) {
      return NextResponse.json({ error: 'ID submission wajib dikirim.' }, { status: 400 })
    }

    const submission = await getSubmission(body.id)
    if (!submission) {
      return NextResponse.json({ error: 'Submission tidak ditemukan.' }, { status: 404 })
    }

    const aiResult = await analyzeEssaySubmission(submission, {
      apiKey: body.apiKey,
      leaderNotes: typeof body.leaderNotes === 'string' ? body.leaderNotes : submission.leaderNotes,
    })

    await updateSubmission(body.id, {
      leaderNotes:
        typeof body.leaderNotes === 'string' ? body.leaderNotes : submission.leaderNotes,
      aiResult,
    })

    return NextResponse.json(aiResult)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
