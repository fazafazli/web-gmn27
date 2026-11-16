"""05 - Menjalankan model YOLO tim (format OpenVINO) di webcam laptop.

Persiapan: salin folder model ke vision/models/ (lihat vision/models/README.md)
Jalankan:  python vision/05_yolo_webcam.py --model kotak
           python vision/05_yolo_webcam.py --model bola_merah_hijau
           python vision/05_yolo_webcam.py --model bola_biru --imgsz 320
           python vision/05_yolo_webcam.py --model kotak --sumber vision/sampel/kotak_hijau.jpg
Tekan q untuk keluar.
"""
import argparse
import time
from pathlib import Path

import cv2
from ultralytics import YOLO

MODELS = Path(__file__).parent / "models"

p = argparse.ArgumentParser()
p.add_argument("--model", choices=["kotak", "bola_merah_hijau", "bola_biru"], default="kotak")
p.add_argument("--sumber", default="0", help="0 = webcam, atau path gambar/video")
p.add_argument("--imgsz", type=int, default=640)
p.add_argument("--conf", type=float, default=0.5)
a = p.parse_args()

folder = MODELS / a.model
if not (folder / "best.xml").exists() or not (folder / "best.bin").exists():
    raise SystemExit(f"Model belum lengkap di {folder}. Butuh best.xml, best.bin, dan metadata.yaml.")

model = YOLO(str(folder), task="detect")
print("Kelas di model ini:", model.names)

sumber = int(a.sumber) if a.sumber.isdigit() else a.sumber
gambar_diam = isinstance(sumber, str) and sumber.lower().endswith((".jpg", ".jpeg", ".png"))
waktu = time.time()
for r in model.predict(source=sumber, stream=True, imgsz=a.imgsz, conf=a.conf, verbose=False):
    frame = r.plot()  # gambar kotak + label otomatis
    for box in r.boxes:
        nama = model.names[int(box.cls)]
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        print(f"{nama:<12} yakin {float(box.conf):.2f}  tengah-x {int((x1 + x2) / 2)}")

    sekarang = time.time()
    fps = 1 / max(sekarang - waktu, 1e-6)
    waktu = sekarang
    cv2.putText(frame, f"FPS {fps:.1f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
    cv2.imshow("yolo", frame)
    if cv2.waitKey(0 if gambar_diam else 1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()
