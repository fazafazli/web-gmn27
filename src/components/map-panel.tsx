"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Map, Maximize, Minimize, Navigation, RefreshCw, Target } from "lucide-react";
import type { MapCommand } from "./MapLeaflet";
import type { Route, Telemetry } from "@/lib/types";

// Leaflet butuh objek "window", jadi peta hanya dimuat di browser
const MapLeaflet = dynamic(() => import("./MapLeaflet"), { ssr: false });

export function MapPanel({ rows, latest }: { rows: Telemetry[]; latest: Telemetry | null }) {
  const [route, setRoute] = useState<Route>("A");
  const [command, setCommand] = useState<MapCommand>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const routeButton = (r: Route) => (
    <button
      type="button"
      onClick={() => setRoute(r)}
      className={`border px-4 py-1.5 transition-colors ${
        route === r ? "border-lime-neon bg-lime-neon text-midnight-hitam" : "border-border text-kapur-muda/80 hover:bg-foreground/5"
      }`}
    >
      Lintasan {r}
    </button>
  );

  const controlButton = (type: "ship" | "arena" | "reset", Icon: typeof Navigation, label: string) => (
    <button
      className="inline-flex h-8 items-center justify-start gap-2 px-3 transition-colors hover:bg-slate-50"
      onClick={() => setCommand({ id: Date.now(), type })}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col border border-border bg-surface-strong shadow-[0_0_0_1px_var(--border)_inset]">
      <div className="flex flex-col justify-between gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:gap-0 sm:px-5">
        <div className="flex items-center gap-2.5">
          <Map className="h-4 w-4 text-lime-neon" />
          <h2 className="text-[1.05rem] font-medium tracking-wide text-kapur-muda">Real-Time Map</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {routeButton("A")}
          {routeButton("B")}
        </div>
      </div>

      <div id="map-fullscreen-container" className="relative flex min-h-[400px] flex-1 overflow-hidden bg-[#dfeccf] xl:min-h-0">
        <div className="absolute inset-0 z-10">
          <MapLeaflet route={route} rows={rows} latest={latest} command={command} />
        </div>

        <div className="absolute right-3 top-3 z-20 flex items-start gap-2">
          <div className="inline-flex h-8 items-center rounded-sm bg-lime-neon px-2 py-1 text-xs font-bold tracking-widest text-midnight-hitam shadow-md">
            Lintasan {route}
          </div>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/10 bg-white text-black shadow-lg transition-colors hover:bg-slate-50"
            title="Layar penuh"
            onClick={() => {
              const el = document.getElementById("map-fullscreen-container");
              if (!document.fullscreenElement && el) el.requestFullscreen();
              else document.exitFullscreen?.();
            }}
          >
            {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="absolute bottom-4 left-3 z-20 flex w-[130px] flex-col overflow-hidden rounded-md border border-black/10 bg-white text-black shadow-lg">
          {controlButton("ship", Navigation, "Kapal")}
          <div className="h-px w-full bg-black/10" />
          {controlButton("arena", Target, "Arena")}
          <div className="h-px w-full bg-black/10" />
          {controlButton("reset", RefreshCw, "Reset")}
        </div>
      </div>
    </section>
  );
}
