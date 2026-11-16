"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { ARENA_CENTER, ARENA_ITEMS, GRID_LABELS, type ArenaItem } from "@/lib/arena";
import type { Route, Telemetry } from "@/lib/types";

// Ikon memakai file yang sama dengan web lomba (folder public/)
const ICONS: Record<ArenaItem["type"], L.Icon> = {
  red: L.icon({ iconUrl: "/merah.png", iconSize: [8, 8], iconAnchor: [4, 4] }),
  green: L.icon({ iconUrl: "/hijau.png", iconSize: [8, 8], iconAnchor: [4, 4] }),
  blue: L.icon({ iconUrl: "/bulat_biru.svg", iconSize: [10, 10], iconAnchor: [5, 5] }),
  start: L.icon({ iconUrl: "/start.png", iconSize: [34, 34], iconAnchor: [17, 17] }),
  surface: L.icon({ iconUrl: "/atas.jpeg", iconSize: [10, 10], iconAnchor: [5, 5] }),
  underwater: L.icon({ iconUrl: "/bawah.png", iconSize: [10, 10], iconAnchor: [5, 5] }),
};

const shipIcon = (heading: number) =>
  L.divIcon({
    className: "ship-icon-wrapper",
    html: `<img src="/kapalasli3.png" style="width:50px;height:40px;transform:rotate(${heading}deg);transform-origin:center;display:block;" />`,
    iconSize: [50, 40],
    iconAnchor: [25, 20],
  });

// Geser titik sejauh x meter ke timur dan y meter ke utara
function offset(center: [number, number], x: number, y: number): L.LatLng {
  const mLat = 111320;
  const mLon = 111320 * Math.cos((center[0] * Math.PI) / 180);
  return L.latLng(center[0] + y / mLat, center[1] + x / mLon);
}

export type MapCommand = { id: number; type: "ship" | "arena" | "reset" } | null;

export default function MapLeaflet({
  route,
  rows,
  latest,
  command,
}: {
  route: Route;
  rows: Telemetry[];
  latest: Telemetry | null;
  command: MapCommand;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const arenaLayer = useRef(L.layerGroup());
  const shipRef = useRef<L.Marker | null>(null);
  const trackRef = useRef<L.Polyline | null>(null);
  const resetAfterId = useRef(0); 

  // 1. Buat peta sekali saja
  useEffect(() => {
    const map = L.map("map", { center: ARENA_CENTER.A, zoom: 21, attributionControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 22, maxNativeZoom: 19 }).addTo(map);
    arenaLayer.current.addTo(map);
    trackRef.current = L.polyline([], { color: "red", weight: 1, dashArray: "2,2" }).addTo(map);
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(document.getElementById("map")!);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      shipRef.current = null;
    };
  }, []);

  // 2. Gambar grid 5x5 dan benda-benda arena setiap lintasan berganti
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = ARENA_CENTER[route];
    const layer = arenaLayer.current;
    layer.clearLayers();

    const sel = 6; // ukuran sel grid (meter), 5 x 6 m = 30 m
    const half = (5 * sel) / 2;
    for (let i = 0; i <= 5; i++) {
      const d = -half + i * sel;
      L.polyline([offset(center, -half, d), offset(center, half, d)], { color: "rgba(0,0,0,0.15)", weight: 1 }).addTo(layer);
      L.polyline([offset(center, d, -half), offset(center, d, half)], { color: "rgba(0,0,0,0.15)", weight: 1 }).addTo(layer);
    }
    const { rows: rowLabels, cols } = GRID_LABELS[route];
    rowLabels.forEach((r, ri) =>
      cols.forEach((c, ci) => {
        L.marker(offset(center, -half + (ci + 0.5) * sel, half - (ri + 0.5) * sel), {
          interactive: false,
          icon: L.divIcon({
            className: "bg-transparent text-center text-[18px] font-black tracking-tighter text-black/30",
            html: `${c}${r}`,
            iconAnchor: [15, 10],
          }),
        }).addTo(layer);
      }),
    );

    ARENA_ITEMS[route].forEach((item) => {
      L.marker(offset(center, item.x, item.y), { icon: ICONS[item.type] }).bindPopup(item.label).addTo(layer);
    });

    map.setView(center, 21, { animate: false });
  }, [route]);

  // 3. Perbarui posisi kapal dan jejaknya setiap ada data baru
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const titik = rows
      .filter((r) => r.id > resetAfterId.current && r.latitude != null && r.longitude != null)
      .map((r) => [r.latitude!, r.longitude!] as [number, number]);
    trackRef.current?.setLatLngs(titik);

    if (latest?.latitude != null && latest.longitude != null) {
      const pos: [number, number] = [latest.latitude, latest.longitude];
      if (!shipRef.current) shipRef.current = L.marker(pos, { icon: shipIcon(latest.heading_deg ?? 0) }).addTo(map);
      else shipRef.current.setLatLng(pos).setIcon(shipIcon(latest.heading_deg ?? 0));
    }
  }, [rows, latest]);

  // 4. Tombol Kapal / Arena / Reset
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !command) return;
    if (command.type === "ship" && latest?.latitude != null && latest.longitude != null) {
      map.setView([latest.latitude, latest.longitude], 21);
    } else if (command.type === "arena") {
      map.setView(ARENA_CENTER[route], 21);
    } else if (command.type === "reset") {
      resetAfterId.current = latest?.id ?? 0;
      trackRef.current?.setLatLngs([]);
    }
  }, [command]);

  return <div id="map" className="h-full w-full rounded-lg border border-[#ccc]" />;
}
