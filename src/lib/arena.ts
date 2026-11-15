import type { Route } from "./types";

/**
 * Susunan arena di peta. Semua posisi ditulis dalam METER dari titik tengah arena:
 *   x = ke timur (+) / barat (-),  y = ke utara (+) / selatan (-)
 * Ubah angka di sini untuk menggeser bola, start, atau kotak misi. Tidak perlu database.
 */

// Titik tengah arena: bengkel Gamantaray
export const ARENA_CENTER: Record<Route, [number, number]> = {
  A: [-7.7655867133738, 110.37030896214927],
  B: [-7.7655867133738, 110.37030896214927],
};

export type ArenaItem = {
  type: "red" | "green" | "blue" | "start" | "surface" | "underwater";
  x: number;
  y: number;
  label: string;
};

// Lintasan A: 10 pasang bola merah (kanan) dan hijau (kiri) menuju utara
const lintasanA: ArenaItem[] = [
  { type: "start", x: 0, y: -12, label: "Start" },
  ...Array.from({ length: 10 }, (_, i) => [
    { type: "red" as const, x: 1, y: -10 + i * 2, label: `Merah ${i + 1}` },
    { type: "green" as const, x: -1, y: -10 + i * 2, label: `Hijau ${i + 1}` },
  ]).flat(),
  { type: "underwater", x: 4, y: 6, label: "Kotak biru (underwater)" },
  { type: "surface", x: 4, y: 2, label: "Kotak hijau (surface)" },
  { type: "blue", x: -4.3, y: 10, label: "Docking 1" },
  { type: "blue", x: -4, y: 10, label: "Docking 2" },
  { type: "blue", x: -3.7, y: 10, label: "Docking 3" },
];

// Lintasan B: cerminan lintasan A (kiri-kanan ditukar)
const lintasanB: ArenaItem[] = lintasanA.map((item) => ({ ...item, x: -item.x }));

export const ARENA_ITEMS: Record<Route, ArenaItem[]> = { A: lintasanA, B: lintasanB };

// Label grid 5 x 5 (sel 5 m), sama seperti web lomba
export const GRID_LABELS: Record<Route, { rows: string[]; cols: string[] }> = {
  A: { rows: ["5", "4", "3", "2", "1"], cols: ["A", "B", "C", "D", "E"] },
  B: { rows: ["5", "4", "3", "2", "1"], cols: ["E", "D", "C", "B", "A"] },
};
