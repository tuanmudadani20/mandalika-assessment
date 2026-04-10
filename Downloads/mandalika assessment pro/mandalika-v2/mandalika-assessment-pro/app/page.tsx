export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.25fr_0.9fr] items-center">
        <div className="space-y-8">
          <p className="text-sm uppercase tracking-[0.35em] text-muted">Mandalika Assessment Pro</p>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight text-gold">
            Triangulated Psychometric + BEI Platform
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            33 mixed-keying tetrads, 30 Most-Least SJT, dan 8 BEI STAR berbasis rubric.
            Skoring otomatis dengan MTCS v2.1, siap untuk keputusan talent yang berani.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/assessment"
              className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/40 hover:-translate-y-0.5 transition-transform"
            >
              Mulai Assessment
            </a>
            <a
              href="/leader"
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10 transition-colors"
            >
              Leader Dashboard
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              ['Psychometric', '33 Tetrad + 30 SJT'],
              ['BEI', '8 STAR + AI rubric'],
              ['Scoring', 'MTCS v2.1'],
              ['Infra', 'Next 14 + Vercel KV'],
            ].map(([title, value]) => (
              <div key={title} className="card p-4">
                <p className="text-xs uppercase tracking-wide text-muted">{title}</p>
                <p className="mt-1 text-base font-semibold text-gold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">3 Fase</p>
              <h3 className="mt-1 text-2xl font-display text-gold">End-to-end flow</h3>
            </div>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold border border-gold/40">
              Real-time scoring
            </span>
          </div>
          <ul className="space-y-3 text-sm text-muted">
            <li>• Access code → Profile → 33 Tetrad → 30 SJT → 8 BEI.</li>
            <li>• Vercel KV menyimpan progres sesi dan hasil akhir.</li>
            <li>• Claude Sonnet untuk analisis BEI + red flag penalty.</li>
            <li>• Leader dashboard: password-protected, dengan indeks sesi.</li>
          </ul>
          <div className="rounded-xl border border-border bg-bg/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">MTCS v2.1</p>
            <p className="text-lg text-text">
              Weighted score (35/30/25/10) minus CSS & PGS, dengan override untuk integritas & ownership.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
