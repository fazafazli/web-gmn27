import { Activity } from "lucide-react";
import type { Telemetry } from "@/lib/types";

// Pengganti peta untuk ROV: GPS tidak bekerja di bawah air, jadi yang dipantau kedalaman
export function DepthPanel({ rows }: { rows: Telemetry[] }) {
  const data = rows.filter((r) => r.depth_m !== null).slice(-120);
  const W = 800;
  const H = 420;
  const pad = 48;
  const maxDepth = Math.max(3, ...data.map((r) => r.depth_m ?? 0)); // skala minimal 3 m

  // Kedalaman 0 di atas, makin dalam makin ke bawah
  const x = (i: number) => pad + (i / Math.max(1, data.length - 1)) * (W - pad * 2);
  const y = (d: number) => pad + (d / maxDepth) * (H - pad * 2);
  const garis = data.map((r, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(r.depth_m ?? 0).toFixed(1)}`).join(" ");

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col border border-border bg-surface-strong shadow-[0_0_0_1px_var(--border)_inset]">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <Activity className="h-4 w-4 text-lime-neon" />
        <h2 className="text-[1.05rem] font-medium tracking-wide text-kapur-muda">Depth Monitor</h2>
      </div>
      <div className="flex min-h-[400px] flex-1 items-center justify-center p-4">
        {data.length === 0 ? (
          <p className="text-sm text-sage-dingin">Belum ada data kedalaman.</p>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
            {[0, maxDepth / 2, maxDepth].map((t) => (
              <g key={t}>
                <line x1={pad} x2={W - pad} y1={y(t)} y2={y(t)} stroke="var(--border)" />
                <text x={pad - 8} y={y(t) + 4} textAnchor="end" fontSize="13" fill="var(--sage-dingin)">
                  {t.toFixed(1)} m
                </text>
              </g>
            ))}
            <path d={garis} fill="none" stroke="var(--lime-neon)" strokeWidth="2.5" />
          </svg>
        )}
      </div>
    </section>
  );
}
