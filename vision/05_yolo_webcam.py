"""05 - Menjalankan model YOLO (best.pt dari Roboflow) di webcam laptop.

Persiapan: taruh best.pt di folder vision/models/
Jalankan:  python vision/05_yolo_webcam.py
           python vision/05_yolo_webcam.py --imgsz 320       # lebih cepat, objek kecil lebih sulit
           python vision/05_yolo_webcam.py --sumber vision/sampel/video.mp4
Tekan q untuk keluar.
"""
import argparse
import time
from pathlib import Path

import cv2
from ultralytics import YOLO

MODEL = Path(__file__).parent / "models" / "best.pt"

p = argparse.ArgumentParser()
p.add_argument("--sumber", default="0", help="0 = webcam, atau path gambar/video")
p.add_argument("--imgsz", type=int, default=416)
p.add_argument("--conf", type=float, default=0.5)
a = p.parse_args()

if not MODEL.exists():
    raise SystemExit(f"Model tidak ditemukan: {MODEL}. Salin best.pt dari tim ke folder vision/models/.")

model = YOLO(str(MODEL))
print("Kelas di model ini:", model.names)

sumber = int(a.sumber) if a.sumber.isdigit() else a.sumber
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
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()
