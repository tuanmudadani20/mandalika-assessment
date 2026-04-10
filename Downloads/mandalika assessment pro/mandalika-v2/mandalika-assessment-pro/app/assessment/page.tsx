"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssessmentEntry() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Access code invalid");
      router.push(`/assessment/${json.sessionId}/profile`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Mulai</p>
          <h1 className="font-display text-4xl text-gold">Mulai Assessment</h1>
          <p className="text-sm text-muted">Klik mulai untuk mengisi data diri dan langsung masuk ke tahap pertama.</p>
        </div>

        <div className="card p-6 space-y-4">
          {error && <p className="text-sm text-cat-c">{error}</p>}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/30 disabled:opacity-60"
          >
            {loading ? "Menyiapkan..." : "Mulai"}
          </button>
        </div>
      </div>
    </main>
  );
}
