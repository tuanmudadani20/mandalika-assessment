"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SessionTimer } from "@/components/assessment/SessionTimer";

type Field = { key: string; label: string; placeholder: string; type?: string };

const textFields: Field[] = [
  { key: "name", label: "Nama Lengkap", placeholder: "Nama" },
  { key: "email", label: "Email", placeholder: "nama@perusahaan.com", type: "email" },
  { key: "department", label: "Divisi/Department", placeholder: "Sales, Ops, dsb" },
];

const positionOptions = ["Staff", "Kepala Unit", "Manager"] as const;
const tenureOptions = ["< 6 bulan", "6-12 bulan", "1-3 tahun", "3-5 tahun", ">= 5 tahun"] as const;
const requiredKeys = ["name", "email", "department", "position", "tenure"];

export default function ProfilePage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const isComplete = requiredKeys.every((f) => (form[f] ?? "").length > 0);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submit/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: params.sessionId, ...form }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan profil");
      router.push(`/assessment/${params.sessionId}/tetrad`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 1</p>
            <h1 className="font-display text-4xl text-gold">Data diri</h1>
            <p className="text-sm text-muted">Gunakan data asli. Informasi ini muncul di laporan akhir.</p>
          </div>
          <SessionTimer />
        </div>

        <div className="card p-6 space-y-4">
          {textFields.map((f) => (
            <div key={f.key} className="space-y-2">
              <label className="text-sm text-muted">{f.label}</label>
              <input
                type={f.type ?? "text"}
                value={form[f.key] ?? ""}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-border bg-bg/60 p-3 text-text focus:border-gold focus:outline-none"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm text-muted">Posisi/Jabatan</label>
            <select
              value={form.position ?? ""}
              onChange={(e) => update("position", e.target.value)}
              className="w-full rounded-lg border border-border bg-bg/60 p-3 text-text focus:border-gold focus:outline-none"
            >
              <option value="" disabled>
                Pilih jabatan
              </option>
              {positionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted">Lama Bekerja</label>
            <select
              value={form.tenure ?? ""}
              onChange={(e) => update("tenure", e.target.value)}
              className="w-full rounded-lg border border-border bg-bg/60 p-3 text-text focus:border-gold focus:outline-none"
            >
              <option value="" disabled>
                Pilih rentang masa kerja
              </option>
              {tenureOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-cat-c">{error}</p>}
          <button
            onClick={submit}
            disabled={loading || !isComplete}
            className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/30 disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Lanjut ke Tetrad"}
          </button>
        </div>
      </div>
    </main>
  );
}
