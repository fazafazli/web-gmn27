"""06 - Deteksi dengan YOLO, lalu kirim foto ke dashboard (alur misi imaging KKI).

Saat objek terdeteksi cukup yakin, satu frame disimpan, di-upload ke Supabase Storage,
lalu link-nya dicatat di tabel mission_images. Foto langsung muncul di web.

Persiapan: model kotak di vision/models/kotak/, .env.local sudah diisi, web sedang jalan.
Jalankan:  python vision/06_deteksi_kirim.py
"""
import sys
import time
from pathlib import Path

import cv2
from ultralytics import YOLO

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
from env_loader import get_client  # noqa: E402

MODEL = Path(__file__).parent / "models" / "kotak"  # folder OpenVINO: best.xml + best.bin
BUCKET = "mission-images"
CONF_KIRIM = 0.6

# Kelas model -> slot di dashboard (nama kelas sesuai metadata.yaml model kotak)
KELAS_KE_SLOT = {
    "blue_box": ("asv", "underwater"),
    "green_box": ("asv", "surface"),
}

sb = get_client()
model = YOLO(str(MODEL), task="detect")
print("Kelas di model ini:", model.names)
sudah_kirim = set()  # supaya setiap slot hanya dikirim sekali


def kirim_foto(frame, vehicle, slot, note):
    ok, buf = cv2.imencode(".jpg", frame)
    nama = f"{vehicle}-{slot}-{int(time.time() * 1000)}.jpg"
    sb.storage.from_(BUCKET).upload(nama, buf.tobytes(), {"content-type": "image/jpeg"})
    url = sb.storage.from_(BUCKET).get_public_url(nama)
    sb.table("mission_images").insert(
        {"vehicle": vehicle, "slot": slot, "image_url": url, "note": note}
    ).execute()
    print("Terkirim:", url)


for r in model.predict(source=0, stream=True, imgsz=640, conf=0.4, verbose=False):
    frame = r.orig_img
    for box in r.boxes:
        nama = model.names[int(box.cls)]
        conf = float(box.conf)
        if nama in KELAS_KE_SLOT and conf >= CONF_KIRIM and nama not in sudah_kirim:
            vehicle, slot = KELAS_KE_SLOT[nama]
            kirim_foto(frame, vehicle, slot, f"{nama} {conf:.2f}")
            sudah_kirim.add(nama)

    cv2.imshow("deteksi", r.plot())
    tombol = cv2.waitKey(1) & 0xFF
    if tombol == ord("r"):  # r = reset, boleh kirim lagi
        sudah_kirim.clear()
        print("Reset: foto boleh dikirim lagi.")
    if tombol == ord("q"):
        break

cv2.destroyAllWindows()
