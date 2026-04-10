"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BEIQuestion } from "@/components/assessment/BEIQuestion";
import { SessionTimer } from "@/components/assessment/SessionTimer";
import { BEI_QUESTIONS } from "@/lib/questions/bei";

export default function BEIPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [answers, setAnswers] = useState<string[]>(BEI_QUESTIONS.map(() => ""));
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const checkAccess = async () => {
      try {
        const res = await fetch(`/api/session/${params.sessionId}`);
        if (!res.ok) throw new Error("Session tidak ditemukan");
        const data = await res.json();
        const pos = (data.profile?.position as string | undefined)?.toLowerCase().trim();
        const canDoBEI = pos === "manager" || pos === "kepala unit";
        if (!active) return;
        if (!canDoBEI) {
          setAllowed(false);
          router.replace(`/assessment/${params.sessionId}/complete`);
        } else {
          setAllowed(true);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Gagal memuat sesi");
          setAllowed(false);
        }
      }
    };
    checkAccess();
    return () => {
      active = false;
    };
  }, [params.sessionId, router]);

  const completed = useMemo(
    () => answers.filter((text) => text.trim().length > 0).length,
    [answers]
  );

  const goNext = () => setCurrent((c) => Math.min(BEI_QUESTIONS.length - 1, c + 1));
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const jumpTo = (idx: number) => setCurrent(idx);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (completed !== BEI_QUESTIONS.length) throw new Error("Lengkapi semua jawaban terlebih dahulu.");
      const timingMs = Date.now() - startedAt;
      const payload = {
        sessionId: params.sessionId,
        timingMs,
        answers: BEI_QUESTIONS.map((q, idx) => ({ questionId: q.id, text: answers[idx] })),
      };
      const res = await fetch("/api/submit/bei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengirim BEI");
      router.push(`/assessment/${params.sessionId}/complete`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (allowed === null) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-8 flex items-center justify-center text-muted">
        Memuat sesi...
      </main>
    );
  }
  if (allowed === false) return null;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 3</p>
          <h1 className="font-display text-4xl text-gold">8 BEI (STAR)</h1>
          <p className="text-sm text-muted">Jawab dengan contoh nyata.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1.05fr)_220px] items-start">
          <div className="space-y-4 lg:self-start">
            <BEIQuestion
              question={BEI_QUESTIONS[current]}
              index={current}
              value={answers[current]}
              onChange={(val) =>
                setAnswers((prev) => {
                  const next = [...prev];
                  next[current] = val;
                  return next;
                })
              }
            />
            <SessionTimer />
          </div>

          <aside className="card p-4 space-y-3 lg:self-start">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Navigasi Soal</p>
            <div className="grid grid-cols-4 gap-1.5">
              {BEI_QUESTIONS.map((_, idx) => {
                const done = answers[idx].trim().length > 0;
                const active = idx === current;
                const cls = active ? "text-bg shadow" : done ? "text-bg" : "text-muted";
                const style = active
                  ? { background: "linear-gradient(135deg,#e9c86a,#cc9933)" }
                  : done
                  ? { background: "linear-gradient(135deg,#f5dc8a,#d4a537)" }
                  : { background: "var(--border)" };
                return (
                  <button
                    key={idx}
                    onClick={() => jumpTo(idx)}
                    className={`h-8 px-1.5 rounded-md text-[11px] font-semibold transition-all ${cls}`}
                    style={style}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="w-full rounded-lg border border-border px-2 py-2 text-[11px] text-muted disabled:opacity-50 whitespace-nowrap"
              >
                Sebelumnya
              </button>
              <button
                onClick={goNext}
                disabled={current === BEI_QUESTIONS.length - 1}
                className="w-full rounded-lg border border-border px-2 py-2 text-[11px] text-muted disabled:opacity-50 whitespace-nowrap"
              >
                Berikutnya
              </button>
            </div>

            {completed === BEI_QUESTIONS.length && (
              <button
                onClick={submit}
                disabled={loading}
                className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/20 disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Kirim & Analisis"}
              </button>
            )}

            {error && <p className="text-sm text-cat-c">{error}</p>}
          </aside>
        </div>
      </div>
    </main>
  );
}
