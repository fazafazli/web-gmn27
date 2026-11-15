"""Mengirim satu file gambar ke dashboard (Storage + tabel mission_images).

Contoh:
    python tools/send_image.py vision/sampel/contoh.jpg --vehicle asv --slot underwater
    python tools/send_image.py foto_qr.png --vehicle rov --slot qr --note "QR: rak A"
"""
import argparse
import mimetypes
import time
from pathlib import Path

from env_loader import get_client

BUCKET = "mission-images"


def kirim(path, vehicle, slot, note=None):
    sb = get_client()
    path = Path(path)
    tipe = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    nama = f"{vehicle}-{slot}-{int(time.time() * 1000)}{path.suffix.lower()}"

    sb.storage.from_(BUCKET).upload(nama, path.read_bytes(), {"content-type": tipe})
    url = sb.storage.from_(BUCKET).get_public_url(nama)
    sb.table("mission_images").insert(
        {"vehicle": vehicle, "slot": slot, "image_url": url, "note": note}
    ).execute()
    return url


def main():
    p = argparse.ArgumentParser(description="Kirim foto misi ke dashboard")
    p.add_argument("file", help="path gambar (jpg/png)")
    p.add_argument("--vehicle", choices=["asv", "rov"], default="asv")
    p.add_argument("--slot", default="surface", help="ASV: underwater/surface, ROV: qr/payload")
    p.add_argument("--note", default=None)
    a = p.parse_args()

    print("Terkirim:", kirim(a.file, a.vehicle, a.slot, a.note))


if __name__ == "__main__":
    main()
