"""Pengirim data palsu: berpura-pura menjadi ASV atau ROV.

Contoh:
    python tools/dummy_sender.py --vehicle asv
    python tools/dummy_sender.py --vehicle rov --interval 0.5

Hentikan dengan Ctrl + C.
"""
import argparse
import math
import time

from env_loader import get_client

# Titik awal: bengkel Gamantaray
LAT0, LON0 = -7.7655867133738, 110.37030896214927


def data_asv(t):
    # Kapal bergerak memutar dengan radius sekitar 20 meter
    sudut = t / 15
    # Urutan tahap sama dengan MISSION_STEPS di src/lib/types.ts
    tahap = ["prepare", "start", "floating_ball", "underwater_imaging",
             "surface_imaging", "docking", "finish"][(t // 15) % 7]
    return {
        "vehicle": "asv",
        "latitude": LAT0 + 0.00018 * math.sin(sudut),
        "longitude": LON0 + 0.00018 * math.cos(sudut),
        "heading_deg": (math.degrees(-sudut) + 180) % 360,
        "speed_ms": round(1.2 + 0.2 * math.sin(t / 7), 2),
        "battery_v": round(16.6 - t * 0.002, 2),
        "mission_state": tahap,
    }


def data_rov(t):
    # ROV turun-naik antara 0 dan 3 meter
    tahap = ["prepare", "dive", "scan_qr", "grab_payload",
             "place_payload", "surface_docking", "finish"][(t // 15) % 7]
    return {
        "vehicle": "rov",
        "depth_m": round(1.5 + 1.4 * math.sin(t / 12), 2),
        "heading_deg": (t * 4) % 360,
        "speed_ms": round(0.3 + 0.1 * math.sin(t / 5), 2),
        "battery_v": round(12.4 - t * 0.001, 2),
        "mission_state": tahap,
    }


def main():
    parser = argparse.ArgumentParser(description="Kirim telemetri dummy ke Supabase")
    parser.add_argument("--vehicle", choices=["asv", "rov"], default="asv")
    parser.add_argument("--interval", type=float, default=1.0, help="jeda antar kiriman (detik)")
    args = parser.parse_args()

    sb = get_client()
    buat_data = data_asv if args.vehicle == "asv" else data_rov
    print(f"Mengirim data {args.vehicle.upper()} setiap {args.interval} detik. Ctrl + C untuk berhenti.")

    t = 0
    try:
        while True:
            baris = buat_data(t)
            sb.table("telemetry").insert(baris).execute()
            print(f"[{t:4d}] {baris['mission_state']:<14} heading {baris['heading_deg']:6.1f}")
            t += 1
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\nBerhenti.")


if __name__ == "__main__":
    main()
