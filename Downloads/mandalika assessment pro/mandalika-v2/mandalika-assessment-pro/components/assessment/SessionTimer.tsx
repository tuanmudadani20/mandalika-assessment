import { useEffect, useState } from 'react';

export function SessionTimer({ label = 'Elapsed' }: { label?: string }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
      <span>{label}: {mins}m {secs.toString().padStart(2, '0')}s</span>
    </div>
  );
}
