import { NextRequest, NextResponse } from 'next/server'
import { BEI_QUESTIONS } from '@/lib/question-bank'

export const dynamic = 'force-dynamic'

type EvalShape = {
  questionId: string
  score: number
  justification: string
  strengths: string[]
  concerns: string[]
  follow_up_needed: boolean
  follow_up_question: string | null
}

const systemPrompt = `Anda adalah interviewer kompetensi yang menilai jawaban BEI (STAR) secara ringkas.
Skor 1-4:
1 = Tidak ada bukti perilaku yang diminta
2 = Bukti terbatas, contoh dangkal/tidak relevan
3 = Bukti solid, perilaku tampak konsisten
4 = Teladan, dampak kuat dan berulang
Kembalikan JSON dengan field: score (1-4), justification (1 kalimat singkat), strengths (array frasa), concerns (array frasa), follow_up_needed (boolean), follow_up_question (string|null).`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const questionId = body?.questionId ?? 'BEI00'
    const answer = String(body?.answer ?? '').trim()
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620'

    const questionText = BEI_QUESTIONS.find((q) => q.id === questionId)?.question

    if (!apiKey || !answer) {
      return NextResponse.json<EvalShape>({
        questionId,
        score: 2,
        justification: apiKey ? 'Jawaban kosong, pakai default 2.' : 'Kunci API tidak tersedia, gunakan placeholder.',
        strengths: answer ? ['Menjawab singkat'] : [],
        concerns: answer ? ['Butuh detail perilaku'] : ['Tidak ada jawaban'],
        follow_up_needed: true,
        follow_up_question: questionText ?? 'Ceritakan situasi paling relevan dan hasilnya.',
      })
    }

    const payload = {
      model,
      max_tokens: 280,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Pertanyaan BEI (${questionId}): ${questionText ?? '-'}
Jawaban kandidat:
${answer}

Balas hanya JSON: {"score":1-4,"justification":"...","strengths":["..."],"concerns":["..."],"follow_up_needed":true/false,"follow_up_question":"... atau null"}`,
        },
      ],
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) throw new Error(`Claude API error ${resp.status}`)
    const data = (await resp.json()) as {
      content?: { text?: string }[]
    }
    const text = data?.content?.[0]?.text ?? ''
    const parsed = safeJson(text)

    if (!parsed) {
      return NextResponse.json<EvalShape>({
        questionId,
        score: 2,
        justification: 'Respons tidak terbaca, set skor 2.',
        strengths: [],
        concerns: ['Evaluasi otomatis gagal'],
        follow_up_needed: true,
        follow_up_question: questionText ?? 'Berikan contoh lengkap STAR.',
      })
    }

    const evaluation: EvalShape = {
      questionId,
      score: clampScore(parsed.score),
      justification: parsed.justification || 'Evaluasi otomatis',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : [],
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns.slice(0, 4) : [],
      follow_up_needed: Boolean(parsed.follow_up_needed),
      follow_up_question: parsed.follow_up_question ?? null,
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal memproses evaluasi BEI. ' + (error instanceof Error ? error.message : '') },
      { status: 500 },
    )
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function clampScore(value: unknown) {
  const num = Number(value)
  if (Number.isFinite(num)) return Math.min(4, Math.max(1, Math.round(num)))
  return 2
}
