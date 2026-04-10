"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dimensionMap } from "@/lib/scoring/dimensions";
import { BEI_QUESTIONS } from "@/lib/questions/bei";
import { DualSourcePanel } from "@/components/leader/DualSource";

interface SessionRow {
  sessionId: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  profile?: { name: string; email: string };
  finalResult?: { finalScore: number; finalCategory: string; profileScore?: number };
}

export default function LeaderPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"created" | "completed" | "status" | "score" | "category" | "name" | "email">("created");
  const [selected, setSelected] = useState<SessionRow | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("leaderPassword");
    if (cached) {
      setPassword(cached);
      fetchSessions(cached);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const base = sessions.filter((s) => {
      const name = s.profile?.name?.toLowerCase() ?? "";
      const email = s.profile?.email?.toLowerCase() ?? "";
      const status = s.status?.toLowerCase() ?? "";
      return name.includes(q) || email.includes(q) || status.includes(q) || s.sessionId.toLowerCase().includes(q);
    });
    const sorter = {
      created: (a: SessionRow, b: SessionRow) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      completed: (a: SessionRow, b: SessionRow) =>
        new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime(),
      status: (a: SessionRow, b: SessionRow) => a.status.localeCompare(b.status),
      score: (a: SessionRow, b: SessionRow) => (b.finalResult?.finalScore ?? 0) - (a.finalResult?.finalScore ?? 0),
      category: (a: SessionRow, b: SessionRow) =>
        (a.finalResult?.finalCategory ?? "").localeCompare(b.finalResult?.finalCategory ?? ""),
      name: (a: SessionRow, b: SessionRow) => (a.profile?.name ?? "").localeCompare(b.profile?.name ?? ""),
      email: (a: SessionRow, b: SessionRow) => (a.profile?.email ?? "").localeCompare(b.profile?.email ?? ""),
    }[sort];
    return [...base].sort(sorter);
  }, [sessions, query, sort]);

  const stats = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    const inProgress = total - completed;
    const scores = sessions.map((s) => s.finalResult?.finalScore).filter((v): v is number => typeof v === "number");
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { total, completed, inProgress, avgScore: Math.round(avgScore * 10) / 10 };
  }, [sessions]);

  return (
    <main className="min-h-screen px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Leader</p>
          <h1 className="font-display text-4xl text-gold">Dashboard</h1>
          <p className="text-sm text-muted">Masukkan password sekali, lihat rekap, sortir, ekspor CSV, dan buka detail.</p>
        </div>

        {!authed && (
          <div className="card p-5 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="password"
                placeholder="Password leader"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-bg/60 p-3 text-text focus:border-gold focus:outline-none"
              />
              <button
                onClick={() => {
                  localStorage.setItem("leaderPassword", password);
                  fetchSessions(password);
                }}
                disabled={loading || password.length === 0}
                className="rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/20 disabled:opacity-60"
              >
                {loading ? "Memuat..." : "Login"}
              </button>
            </div>
            {error && <p className="text-sm text-cat-c">{error}</p>}
          </div>
        )}

        {authed && (
          <div className="card p-5 space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-muted"
                onClick={() => {
                  localStorage.removeItem("leaderPassword");
                  setSessions([]);
                  setDetail(null);
                  setSelected(null);
                  setPassword("");
                  setAuthed(false);
                }}
              >
                Logout
              </button>
              <div className="flex-1" />
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-gold"
                onClick={() => exportCSV(sessions, "all")}
              >
                Export CSV (Semua)
              </button>
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-muted"
                onClick={() => exportCSV(filtered, "filtered")}
              >
                Export (Saringan)
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total" value={stats.total} />
              <StatCard label="Completed" value={stats.completed} />
              <StatCard label="In Progress" value={stats.inProgress} />
              <StatCard label="Avg Final %" value={`${stats.avgScore || 0}%`} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama/email/status/sessionId"
                className="flex-1 rounded-lg border border-border bg-bg/60 p-2.5 text-sm focus:border-gold focus:outline-none"
              />
              <label className="text-xs text-muted">Sortir:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="rounded-lg border border-border bg-bg px-2 py-2 text-sm"
              >
                <option value="created">Terbaru dibuat</option>
                <option value="completed">Terbaru selesai</option>
                <option value="status">Status</option>
                <option value="score">Final Score</option>
                <option value="category">Category</option>
                <option value="name">Nama</option>
                <option value="email">Email</option>
              </select>
              <span className="text-xs text-muted whitespace-nowrap">{filtered.length} hasil</span>
            </div>
          </div>
        )}

        {authed && (
          <div className="overflow-x-auto card p-4">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted">Belum ada submission.</p>
            ) : (
              <table className="w-full text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="p-2 text-left">Participant</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Final %</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Completed</th>
                  <th className="p-2 text-left">Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.sessionId}
                    className="border-t border-border/60 hover:bg-gold/5 transition cursor-pointer"
                    onClick={() => openDetail(s)}
                  >
                    <td className="p-2">
                      <div className="font-semibold">{s.profile?.name ?? "—"}</div>
                      <div className="text-xs text-muted">{s.profile?.email ?? "—"}</div>
                    </td>
                    <td className="p-2 capitalize">{s.status}</td>
                    <td className="p-2">{s.finalResult?.finalScore ? `${s.finalResult.finalScore.toFixed(1)}%` : "—"}</td>
                    <td className="p-2">{s.finalResult?.finalCategory ?? "—"}</td>
                    <td className="p-2 text-xs text-muted">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-2 text-xs text-muted">
                      {s.completedAt ? new Date(s.completedAt).toLocaleString() : "—"}
                    </td>
                    <td className="p-2 text-xs text-gold underline">Buka</td>
                  </tr>
                ))}
              </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 pointer-events-none z-40 print:static print:w-full print:max-w-none print:p-0 print:shadow-none">
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-bg shadow-2xl p-5 overflow-y-auto pointer-events-auto print:static print:max-w-none print:h-auto print:shadow-none">
        <div className="flex items-center justify-between gap-3 print:gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Detail</p>
            <h3 className="font-display text-2xl text-gold">{selected.profile?.name ?? selected.sessionId}</h3>
            <p className="text-xs text-muted">{selected.profile?.email ?? selected.sessionId}</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted"
              onClick={() => window.print()}
            >
              Print / PDF
            </button>
            <button className="text-sm text-muted" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
            {detailLoading && <p className="text-sm text-muted mt-3">Memuat detail...</p>}
            {detail && (
              <div className="space-y-3 mt-3 print:w-full">
                <div className="grid grid-cols-2 gap-2">
                  <InfoCard title="Email" value={detail.profile?.email ?? "—"} />
                  <InfoCard title="Status" value={detail.status} />
                  <InfoCard title="Final %" value={detail.finalResult?.finalScore ? `${detail.finalResult.finalScore.toFixed(1)}%` : "—"} />
                  <InfoCard title="Kategori" value={detail.finalResult?.finalCategory ?? "—"} />
                </div>
                {detail.finalResult?.leaderSummary && (
                  <div className="card p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Ringkasan</p>
                    <p className="text-sm text-text">{detail.finalResult.leaderSummary}</p>
                  </div>
                )}
                <DualSourcePanel
                  fcScores={detail.fcScores ?? detail.finalResult?.fcScores}
                  sjtScores={detail.sjtScores ?? detail.finalResult?.sjtScores ?? detail.dimensionScores}
                  interpretations={detail.finalResult?.dimInterpretations}
                  title="Perbandingan FC & SJT per dimensi"
                />
                {detail.beiAnalysis && (
                  <div className="card p-3 space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Hasil BEI</p>
                    <div className="space-y-2 text-sm">
                      {detail.beiAnalysis.map((r: any) => {
                        const q = BEI_QUESTIONS.find((qq) => qq.id === r.questionId);
                        return (
                          <div key={r.questionId} className="rounded-lg border border-border bg-bg/60 p-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-text">{q?.title ?? r.questionId}</p>
                                <p className="text-[11px] text-muted">{q?.question}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-semibold">{Math.round(r.score)}%</p>
                                <p className="text-[11px] text-muted capitalize">{r.confidence} conf.</p>
                              </div>
                            </div>
                            {r.redFlags?.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {r.redFlags.map((flag: string, i: number) => (
                                  <span
                                    key={i}
                                    className="rounded-full border border-cat-c/30 bg-cat-c/10 text-cat-c px-2 py-[2px] text-[11px]"
                                  >
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 print:hidden">
                  <Link
                    href={`/leader/${selected.sessionId}`}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-gold"
                  >
                    Halaman Detail
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );

  async function fetchSessions(pwd: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leader/sessions", {
        headers: { "x-leader-password": pwd },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unauthorized");
      setSessions(json.sessions ?? []);
      setAuthed(true);
    } catch (err: any) {
      setError(err.message);
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(s: SessionRow) {
    setSelected(s);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/session/${s.sessionId}`, {
        headers: { "x-leader-password": password || localStorage.getItem("leaderPassword") || "" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal ambil detail");
      setDetail(json);
    } catch (err) {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function exportCSV(rows: SessionRow[], label: string) {
    const header = ["sessionId", "status", "name", "email", "createdAt", "completedAt", "finalScore", "finalCategory"];
    const lines = rows.map((r) => [
      r.sessionId,
      r.status,
      r.profile?.name ?? "",
      r.profile?.email ?? "",
      r.createdAt,
      r.completedAt ?? "",
      r.finalResult?.finalScore ?? "",
      r.finalResult?.finalCategory ?? "",
    ]);
    const csv = [header, ...lines].map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mandalika_sessions_${label}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-text">{value}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-1 text-base font-semibold text-text break-words">{value}</p>
    </div>
  );
}
