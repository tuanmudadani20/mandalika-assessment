import Link from 'next/link'
import { ORG_NAME } from '@/lib/assessment-data'

const stats = [
  { value: '65', label: 'Menit Total (maks)' },
  { value: '33', label: 'Tetrad (Phase 1A)' },
  { value: '30', label: 'ML-SJT (Phase 1B)' },
  { value: '5', label: 'BEI (Phase 2)' },
  { value: '13', label: 'Dimensi' },
]

const highlights = [
  {
    title: 'Gate Character First',
    description:
      'Fondasi karakter tidak boleh tertutupi dimensi lain. Gate 1 dan Gate 2 diterapkan sebelum kategori akhir.',
  },
  {
    title: 'Behavior + Narrative',
    description:
      'Tetrad dan SJT menangkap pola perilaku, sementara sesi feedback menangkap kritik, saran, dan ide operasional dari peserta.',
  },
  {
    title: 'Leader Workspace',
    description:
      'Dashboard leader menampilkan jawaban lengkap, dimensi, flags, alerts, notes, dan export CSV.',
  },
]

export default function HomePage() {
  return (
    <main className= min-h-screen bg-ink>
      <div className=mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10>
        <header className=flex items-center justify-between border-b border-border pb-6>
          <div>
            <p className=eyebrow>Mandalika Talent Assessment</p>
            <p className=mt-2 text-sm text-muted>{ORG_NAME}</p>
          </div>
          <Link href=/leader-v2 className=btn-secondary>
            Leader Dashboard
          </Link>
        </header>

        <section className=grid flex-1 gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16>
          <div className=flex flex-col justify-between gap-10>
            <div className=space-y-6>
              <p className=eyebrow>Assessment Center v2</p>
              <h1 className=max-w-4xl text-4xl leading-[1] sm:text-5xl lg:text-6xl>
                Workspace assessment yang rapi, fokus, dan layak dipakai leader.
              </h1>
              <p className=max-w-2xl text-[15px] leading-7 text-muted sm:text-base>
                Platform ini memetakan 13 dimensi perilaku kerja melalui 33 tetrad, 30 ML-SJT,
                dan 5 BEI singkat. Antarmuka dibuat seperti test center profesional: tenang,
                jelas, dan cepat dipakai untuk review operasional.
              </p>
              <div className=flex flex-col gap-3 sm:flex-row>
                <Link href=/assessment-v2 className=btn-primary>
                  Mulai Assessment v2
                </Link>
                <Link href=/leader-v2 className=btn-secondary>
                  Buka Leader v2
                </Link>
                <Link href=/assessment className=btn-secondary>
                  Mode v1 (legacy)
                </Link>
              </div>
            </div>

            <div className=grid gap-4 sm:grid-cols-2 xl:grid-cols-3>
              {highlights.map((item) => (
                <article key={item.title} className=surface-card p-5>
                  <h2 className=text-xl>{item.title}</h2>
                  <p className=mt-3 text-sm leading-7 text-muted>{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className=space-y-6>
            <section className=surface-card p-6>
              <p className=eyebrow>Assessment Stats</p>
              <div className=mt-6 grid gap-4 sm:grid-cols-2>
                {stats.map((item) => (
                  <div key={item.label} className=rounded-card border border-border bg-panel p-4>
                    <p className=metric-value>{item.value}</p>
                    <p className=mt-2 text-xs uppercase tracking-[0.18em] text-muted>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className=surface-card p-6>
              <p className=eyebrow>Struktur Flow</p>
              <div className=mt-6 space-y-4>
                {[
                  ['Phase 1A', '33 Tetrad Rank 1-4', 'Wajib · waktu 20 menit'],
                  ['Phase 1B', '30 ML-SJT', 'Wajib · waktu 10 menit'],
                  ['Phase 2', '5 BEI STAR', 'Disarankan · waktu 35 menit (boleh singkat)'],
                ].map(([part, title, subtitle]) => (
                  <div key={part} className=rounded-card border border-border bg-panel p-4>
                    <p className=text-xs uppercase tracking-[0.18em] text-gold>{part}</p>
                    <p className=mt-2 text-lg font-medium text-text>{title}</p>
                    <p className=mt-1 text-sm text-muted>{subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}
