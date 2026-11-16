"use client";

import { Compass, ListChecks, Battery, Zap } from "lucide-react";
import { MISSION_STEPS, type Telemetry, type Vehicle } from "@/lib/types";

// Perkiraan persen baterai LiPo dari tegangan per sel (3.3 V = 0%, 4.2 V = 100%)
function persenBaterai(volt: number, jumlahSel: number) {
  const perSel = volt / jumlahSel;
  return Math.max(0, Math.min(100, ((perSel - 3.3) / (4.2 - 3.3)) * 100));
}

const fmt = (v: number | null | undefined, digit: number, satuan: string) =>
  v === null || v === undefined ? "—" : `${v.toFixed(digit)}${satuan}`;

export function NavigationPanel({ vehicle, latest }: { vehicle: Vehicle; latest: Telemetry | null }) {
  const metrics =
    vehicle === "asv"
      ? [
          { label: "Latitude", value: fmt(latest?.latitude, 6, "°") },
          { label: "Longitude", value: fmt(latest?.longitude, 6, "°") },
          { label: "SoG", value: fmt(latest?.speed_ms, 1, " m/s") },
          { label: "CoG", value: latest?.heading_deg != null ? latest.heading_deg.toFixed(0).padStart(3, "0") + "°" : "—" },
        ]
      : [
          { label: "Depth", value: fmt(latest?.depth_m, 2, " m") },
          { label: "Heading", value: latest?.heading_deg != null ? latest.heading_deg.toFixed(0).padStart(3, "0") + "°" : "—" },
          { label: "Speed", value: fmt(latest?.speed_ms, 2, " m/s") },
          { label: "Status", value: latest ? "Online" : "—" },
        ];

  const steps = MISSION_STEPS[vehicle];
  const activeIndex = steps.findIndex((s) => s.key === latest?.mission_state);
  const sel = vehicle === "asv" ? 4 : 3; 

  return (
    <aside className="flex min-h-0 flex-col gap-5">
      <section className="border border-border bg-surface-strong shadow-[0_0_0_1px_var(--border)_inset]">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4 text-[1.05rem] font-medium tracking-wide text-kapur-muda">
          <Compass className="h-4 w-4 text-lime-neon" />
          Navigation Data
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-border">
          {metrics.map((m) => (
            <div key={m.label} className="px-4 py-5">
              <p className="text-sm font-semibold text-sage-dingin">{m.label}</p>
              <p className="mt-2 text-2xl tracking-tight text-kapur-muda">{m.value}</p>
            </div>
          ))}

          <div className="col-span-2 flex items-center justify-between border-t border-border bg-foreground/5 px-4 py-5">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-sage-dingin">
                <Battery className="h-4 w-4 text-lime-neon" />
                Battery Level
              </p>
              <p className="mt-1 text-2xl tracking-tight text-kapur-muda">
                {latest?.battery_v != null ? `${persenBaterai(latest.battery_v, sel).toFixed(0)}%` : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-sm font-semibold text-sage-dingin">
                <Zap className="h-3.5 w-3.5" />
                Voltage
              </p>
              <p className="mt-1 text-xl tracking-tight text-kapur-muda">{fmt(latest?.battery_v, 2, " V")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col border border-border bg-surface-strong shadow-[0_0_0_1px_var(--border)_inset]">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2.5 text-[1.05rem] font-medium tracking-wide text-kapur-muda">
            <ListChecks className="h-4 w-4 text-lime-neon" />
            Mission Log
          </h2>
          <span className="text-sm font-semibold text-sage-dingin">
            {activeIndex >= 0 ? `Tahap ${activeIndex + 1}` : "Menunggu"}
          </span>
        </div>
        <ul className="divide-y divide-border overflow-y-auto">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            return (
              <li
                key={step.key}
                className={`flex items-center gap-3 px-5 py-4 text-lg transition-colors ${
                  isActive ? "bg-lime-neon text-midnight-hitam" : "text-kapur-muda/92"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-midnight-hitam" : "bg-foreground/20"}`} />
                <span className="font-medium">{step.label}</span>
                <span className="ml-auto text-sm opacity-70">{String(i + 1).padStart(2, "0")}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
