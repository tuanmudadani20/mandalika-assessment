"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SessionTimer } from "@/components/assessment/SessionTimer";
import { SJTCard } from "@/components/assessment/SJTCard";
import { SJT_QUESTIONS } from "@/lib/questions/sjt";
import { SJTAnswer } from "@/lib/scoring/types";

export default function SJTPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [answers, setAnswers] = useState<SJTAnswer[]>(SJT_QUESTIONS.map(() => ({ mostIndex: -1, leastIndex: -1 })));
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [requiresBEI, setRequiresBEI] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch(`/api/session/${params.sessionId}`);
        if (!res.ok) throw new Error("Gagal memuat sesi");
        const data = await res.json();
        const pos = (data.profile?.position as string | undefined)?.toLowerCase().trim();
        const needBEI = pos === "manager" || pos === "kepala unit";
        if (active) setRequiresBEI(needBEI);
      } catch (err) {
        console.error(err);
        if (active) setRequiresBEI(true); // fallback: tetap minta BEI
      }
    };
    check();
    return () => {
      active = false;
    };
  }, [params.sessionId]);

  const completed = useMemo(
    () => answers.filter((a) => a.mostIndex >= 0 && a.leastIndex >= 0 && a.mostIndex !== a.leastIndex).length,
    [answers]
  );

  const goNext = () => setCurrent((c) => Math.min(SJT_QUESTIONS.length - 1, c + 1));
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const jumpTo = (idx: number) => setCurrent(idx);

  const handleChange = (idx: number, val: SJTAnswer) => {
    setAnswers((prev) => {
      const next = [...prev];
      const incomingMost = val.mostIndex === -1 ? prev[idx].mostIndex : val.mostIndex;
      const incomingLeast = val.leastIndex === -1 ? prev[idx].leastIndex : val.leastIndex;

      const clickedLeastOnPrevMost = val.leastIndex !== -1 && val.leastIndex === prev[idx].mostIndex;
      const clickedMostOnPrevLeast = val.mostIndex !== -1 && val.mostIndex === prev[idx].leastIndex;

      const most = clickedLeastOnPrevMost ? -1 : incomingMost;
      const least = clickedMostOnPrevLeast ? -1 : incomingLeast;

      if (most === least && most !== -1) return prev;
      next[idx] = { mostIndex: most, leastIndex: least };
      return next;
    });
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (completed !== SJT_QUESTIONS.length) throw new Error("Lengkapi semua SJT terlebih dahulu.");
      const timingMs = Date.now() - startedAt;
      const res = await fetch("/api/submit/sjt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: params.sessionId, answers, timingMs }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan jawaban");
      if (json.status === "scoring" || json.status === "completed") {
        router.push(`/assessment/${params.sessionId}/complete`);
      } else {
        router.push(`/assessment/${params.sessionId}/bei`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 2</p>
          <h1 className="font-display text-4xl text-gold">30 Most-Least SJT</h1>
          <p className="text-sm text-muted">Pilih opsi paling dan paling tidak Anda lakukan.</p>
          {requiresBEI === false && (
            <p className="text-xs text-gold/90">
              Catatan: Sesi BEI dilewati untuk posisi Staff. Hasil dihitung langsung setelah SJT.
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1.05fr)_220px] items-start">
          <div className="space-y-4 lg:self-start">

            <SJTCard
              question={SJT_QUESTIONS[current]}
              index={current}
              value={answers[current]}
              onChange={(val) => handleChange(current, val)}
            />

            <SessionTimer />
          </div>

          <aside className="card p-4 space-y-3 lg:self-start">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Navigasi Soal</p>
            <div className="grid grid-cols-5 gap-1.5">
              {SJT_QUESTIONS.map((_, idx) => {
                const done = answers[idx].mostIndex >= 0 && answers[idx].leastIndex >= 0;
                const active = idx === current;
                const cls = active
                  ? "text-bg shadow"
                  : done
                  ? "text-bg"
                  : "text-muted";
                const style = active
                  ? { background: "linear-gradient(135deg,#e9c86a,#cc9933)" }
                  : done
                  ? { background: "linear-gradient(135deg,#f5dc8a,#d4a537)" }
                  : { background: "var(--border)" };
                return (
                  <button
                    key={idx}
                    onClick={() => jumpTo(idx)}
                    className={`h-7 px-1.5 rounded-md text-[11px] font-semibold transition-all ${cls}`}
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
                disabled={current === SJT_QUESTIONS.length - 1}
                className="w-full rounded-lg border border-border px-2 py-2 text-[11px] text-muted disabled:opacity-50 whitespace-nowrap"
              >
                Berikutnya
              </button>
            </div>

            {completed === SJT_QUESTIONS.length && (
              <button
                onClick={submit}
                disabled={loading}
                className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/20 disabled:opacity-60"
              >
                {loading
                  ? "Menyimpan..."
                  : requiresBEI === false
                  ? "Kirim & selesai"
                  : "Lanjut ke BEI"}
              </button>
            )}

            {error && <p className="text-sm text-cat-c">{error}</p>}
          </aside>
        </div>
      </div>
    </main>
  );
}
