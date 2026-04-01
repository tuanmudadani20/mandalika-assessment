import { essayQuestions } from './assessment-data'
import type { Submission } from './types'

const DEFAULT_MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 2500

const SYSTEM_PROMPT = `Anda adalah psikolog organisasi dan spesialis talent assessment berpengalaman.
Anda menganalisis jawaban essay assessment karakter berdasarkan framework A/B/C Player.

Framework:
- A Player (85-100): Ownership penuh, standar internal tinggi konsisten, growth aktif mandiri,
  dampak positif ke sistem dan tim, locus of control internal kuat.
- B Solid (70-84): Dapat diandalkan, stabil, jalankan peran dengan baik tapi tidak melampaui.
- B Player (50-69): Reaktif, tanggung jawab minimal, standar fluktuatif, defensif.
- C Player (<50): Defensif konsisten, hindari tanggung jawab, bawa alasan bukan solusi.

Yang dianalisis:
1. Bahasa ownership vs blame — subjek 'saya' (aksi) vs 'kondisi/orang lain' (menyalahkan)
2. Konkret vs abstrak — ada contoh nyata atau hanya pernyataan umum
3. Kedalaman refleksi — insight tulus, akui kelemahan spesifik
4. Locus of control — internal atau eksternal
5. Standar internal — dari dalam diri atau reaktif ekspektasi luar
6. Kontradiksi lintas jawaban

Output HANYA JSON valid tanpa markdown:
{
  "kategori": "A Player / B Solid Player / B Player / C Player",
  "skor": 0,
  "ringkasan": "2-3 kalimat",
  "dimensi": {
    "Ownership": {"skor": 0, "catatan": "1-2 kalimat"},
    "Standar Pribadi": {"skor": 0, "catatan": "1-2 kalimat"},
    "Respons Tekanan": {"skor": 0, "catatan": "1-2 kalimat"},
    "Growth Mindset": {"skor": 0, "catatan": "1-2 kalimat"},
    "Dampak ke Tim": {"skor": 0, "catatan": "1-2 kalimat"}
  },
  "pola": ["pola/kontradiksi yang ditemukan"],
  "kekuatan": ["kekuatan konkret terbukti dari jawaban"],
  "risiko": ["area risiko untuk leader"],
  "rekomendasi": "2-3 paragraf rekomendasi operasional untuk leader"
}`

export async function analyzeEssaySubmission(
  submission: Submission,
  options?: {
    apiKey?: string
    leaderNotes?: string
  },
) {
  const apiKey = options?.apiKey?.trim() || process.env.ANTHROPIC_API_KEY?.trim() || ''
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY belum tersedia.')
  }

  const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL
  const prompt = buildEssayPrompt(submission, options?.leaderNotes)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const message =
      (error as { error?: { message?: string } }).error?.message ||
      `Anthropic API error ${response.status}`
    throw new Error(message)
  }

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>
  }

  const rawText = data.content?.map((item) => item.text || '').join('').trim() || ''
  const parsed = normalizeAiResult(parseJsonObject(rawText))

  return {
    ...parsed,
    analyzedAt: new Date().toISOString(),
  }
}

function buildEssayPrompt(submission: Submission, leaderNotes?: string) {
  const essayBlock = essayQuestions
    .map((question, index) => {
      const answer = submission.essayAnswers[index] || ''
      return [
        `${question.code} — ${question.question}`,
        `Hint: ${question.hint}`,
        `Jawaban: ${answer}`,
      ].join('\n')
    })
    .join('\n\n')

  return [
    'Analisis hanya berdasarkan kualitas jawaban essay berikut.',
    `Peserta: ${submission.name}`,
    `Departemen: ${submission.dept || '-'}`,
    `Role: ${submission.role || '-'}`,
    `Tenure: ${submission.tenure || '-'}`,
    leaderNotes?.trim()
      ? `Catatan leader tambahan (gunakan hanya sebagai konteks sekunder): ${leaderNotes.trim()}`
      : '',
    '',
    essayBlock,
    '',
    'Kembalikan JSON valid tanpa markdown.',
  ]
    .filter(Boolean)
    .join('\n')
}

function parseJsonObject(input: string) {
  const cleaned = input.replace(/```json|```/gi, '').trim()
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  const slice =
    firstBrace >= 0 && lastBrace >= firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned

  return JSON.parse(slice)
}

function normalizeAiResult(input: unknown): Omit<NonNullable<Submission['aiResult']>, 'analyzedAt'> {
  const value = (input ?? {}) as Record<string, unknown>
  const dimensi = value.dimensi as Record<string, unknown> | undefined

  return {
    kategori: typeof value.kategori === 'string' ? value.kategori : 'B Player',
    skor: typeof value.skor === 'number' ? value.skor : 0,
    ringkasan: typeof value.ringkasan === 'string' ? value.ringkasan : '',
    dimensi: Object.fromEntries(
      Object.entries(dimensi || {}).map(([key, raw]) => {
        const item = (raw ?? {}) as Record<string, unknown>
        return [
          key,
          {
            skor: typeof item.skor === 'number' ? item.skor : 0,
            catatan: typeof item.catatan === 'string' ? item.catatan : '',
          },
        ]
      }),
    ),
    pola: Array.isArray(value.pola) ? value.pola.map(String) : [],
    kekuatan: Array.isArray(value.kekuatan) ? value.kekuatan.map(String) : [],
    risiko: Array.isArray(value.risiko) ? value.risiko.map(String) : [],
    rekomendasi: typeof value.rekomendasi === 'string' ? value.rekomendasi : '',
  }
}
