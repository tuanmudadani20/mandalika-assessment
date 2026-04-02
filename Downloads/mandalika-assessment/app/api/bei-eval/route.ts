import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const questionId = body?.questionId ?? 'BEI00'

    // Placeholder evaluator (no external call for now)
    const evaluation = {
      questionId,
      score: 2,
      justification: 'Placeholder evaluasi: integrasikan Claude API via server-side proxy.',
      strengths: ['Placeholder strengths'],
      concerns: ['Placeholder concerns'],
      follow_up_needed: false,
      follow_up_question: null,
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal memproses evaluasi BEI. ' + (error instanceof Error ? error.message : '') },
      { status: 500 },
    )
  }
}
