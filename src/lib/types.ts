// Bentuk data sama persis dengan kolom di supabase/schema.sql

export type Vehicle = "asv" | "rov";
export type Route = "A" | "B";

export type Telemetry = {
  id: number;
  created_at: string;
  vehicle: Vehicle;
  latitude: number | null;
  longitude: number | null;
  heading_deg: number | null;
  speed_ms: number | null;
  depth_m: number | null;
  battery_v: number | null;
  mission_state: string | null;
};

export type MissionImage = {
  id: number;
  created_at: string;
  vehicle: Vehicle;
  slot: string;
  image_url: string;
  note: string | null;
};

// Urutan misi di panel Mission Log.
// "key" harus sama dengan isi kolom mission_state yang dikirim wahana.
export const MISSION_STEPS: Record<Vehicle, { key: string; label: string }[]> = {
  asv: [
    { key: "prepare", label: "Prepare" },
    { key: "start", label: "Start" },
    { key: "floating_ball", label: "Floating Ball Set" },
    { key: "underwater_imaging", label: "Underwater Imaging" },
    { key: "surface_imaging", label: "Surface Imaging" },
    { key: "docking", label: "Docking" },
    { key: "finish", label: "Finish" },
  ],
  rov: [
    { key: "prepare", label: "Prepare" },
    { key: "dive", label: "Dive" },
    { key: "scan_qr", label: "Scan QR Code" },
    { key: "grab_payload", label: "Grab Payload" },
    { key: "place_payload", label: "Place Payload" },
    { key: "surface_docking", label: "Surface Docking" },
    { key: "finish", label: "Finish" },
  ],
};

// Kotak foto di panel Camera Feeds. "slot" harus sama dengan kolom slot di mission_images.
export const CAMERA_FEEDS: Record<Vehicle, { slot: string; title: string; label: string }[]> = {
  asv: [
    { slot: "underwater", title: "Underwater Imaging", label: "Kotak Biru" },
    { slot: "surface", title: "Surface Imaging", label: "Kotak Hijau" },
  ],
  rov: [
    { slot: "qr", title: "QR Code", label: "Kamera Bawah" },
    { slot: "payload", title: "Payload", label: "Kamera Depan" },
  ],
};
