"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Info from "@/components/leader/Info";

export default function LeaderSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sessionId]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/session/${params.sessionId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unauthorized");
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Leader</p>
            <h1 className="font-display text-4xl text-gold">{data?.profile?.name ?? params.sessionId}</h1>
            {data?.profile?.email && <p className="text-sm text-muted">{data.profile.email}</p>}
          </div>
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted print:hidden"
            onClick={() => window.print()}
          >
            Print / PDF
          </button>
        </div>

        {loading && <p className="text-sm text-muted">Memuat...</p>}
        {error && <p className="text-sm text-cat-c">{error}</p>}
        {data && <Info data={data} />}
      </div>
    </main>
  );
}
