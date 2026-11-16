import type { Route } from "./types";

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

const lintasanA: ArenaItem[] = [
  { type: "start", x: 11.6, y: -10.6, label: "Start" },
  { type: "green", x: 11.0, y: 0.7, label: "Hijau 1" },
  { type: "red", x: 9.3, y: 0.7, label: "Merah 1" },
  { type: "green", x: 9.9, y: -1.9, label: "Hijau 2" },
  { type: "red", x: 8.1, y: -1.9, label: "Merah 2" },
  { type: "green", x: 11.3, y: -5.3, label: "Hijau 3" },
  { type: "red", x: 9.5, y: -5.3, label: "Merah 3" },
  { type: "green", x: -2.9, y: 9.0, label: "Hijau 4" },
  { type: "red", x: -2.9, y: 7.2, label: "Merah 4" },
  { type: "green", x: -0.8, y: 9.0, label: "Hijau 5" },
  { type: "red", x: -0.8, y: 7.2, label: "Merah 5" },
  { type: "green", x: 1.2, y: 9.0, label: "Hijau 6" },
  { type: "red", x: 1.2, y: 7.2, label: "Merah 6" },
  { type: "green", x: 3.1, y: 9.0, label: "Hijau 7" },
  { type: "red", x: 3.1, y: 7.2, label: "Merah 7" },
  { type: "green", x: -11.0, y: 3.2, label: "Hijau 8" },
  { type: "red", x: -9.5, y: 3.2, label: "Merah 8" },
  { type: "green", x: -12.8, y: -0.1, label: "Hijau 9" },
  { type: "red", x: -11.0, y: -0.1, label: "Merah 9" },
  { type: "green", x: -12.8, y: -3.2, label: "Hijau 10" },
  { type: "red", x: -11.3, y: -3.2, label: "Merah 10" },
  { type: "underwater", x: -10.0, y: -8.4, label: "Kotak biru (underwater)" },
  { type: "surface", x: -7.3, y: -11.6, label: "Kotak hijau (surface)" },
  { type: "blue", x: 11.3, y: -12.6, label: "Docking 1" },
  { type: "blue", x: 11.6, y: -12.6, label: "Docking 2" },
  { type: "blue", x: 11.9, y: -12.6, label: "Docking 3" },
];

const lintasanB: ArenaItem[] = lintasanA.map((item) => ({ ...item, x: -item.x }));

export const ARENA_ITEMS: Record<Route, ArenaItem[]> = { A: lintasanA, B: lintasanB };

// Label grid 5 x 5 (sel 6 m, total 30 m)
export const GRID_LABELS: Record<Route, { rows: string[]; cols: string[] }> = {
  A: { rows: ["5", "4", "3", "2", "1"], cols: ["A", "B", "C", "D", "E"] },
  B: { rows: ["5", "4", "3", "2", "1"], cols: ["E", "D", "C", "B", "A"] },
};
