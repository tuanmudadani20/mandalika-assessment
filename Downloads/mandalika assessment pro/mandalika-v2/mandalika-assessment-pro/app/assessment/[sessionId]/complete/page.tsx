import Link from "next/link";
import { notFound } from "next/navigation";

import { getSession } from "@/lib/kv/session";

export default async function CompletePage({ params }: { params: { sessionId: string } }) {
  const session = await getSession(params.sessionId);
  if (!session) return notFound();
  const pos = session.profile?.position?.toLowerCase().trim();
  const requiresBEI = pos === "manager" || pos === "kepala unit";
  const note = requiresBEI
    ? "Sistem sedang menganalisis BEI dan menghitung skor akhir."
    : "Sistem langsung menghitung skor akhir tanpa sesi BEI untuk jabatan Anda.";
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl card p-8 space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Selesai</p>
        <h1 className="font-display text-4xl text-gold">Terima kasih</h1>
        <p className="text-sm text-muted">{note} Silakan cek hasil di halaman berikut.</p>
        <Link
          href={`/results/${params.sessionId}`}
          className="inline-flex items-center justify-center rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/30"
        >
          Lihat hasil
        </Link>
      </div>
    </main>
  );
}
