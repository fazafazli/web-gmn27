"""07 - Ekspor best.pt ke format NCNN (untuk Raspberry Pi 4).

Jalankan SEKALI di Raspberry Pi: python vision/07_export_ncnn.py
Hasilnya folder vision/models/best_ncnn_model. Pakai folder itu sebagai pengganti best.pt:
    model = YOLO("vision/models/best_ncnn_model")
"""
from pathlib import Path

from ultralytics import YOLO

MODEL = Path(__file__).parent / "models" / "best.pt"
hasil = YOLO(str(MODEL)).export(format="ncnn", imgsz=416)
print("Selesai:", hasil)
