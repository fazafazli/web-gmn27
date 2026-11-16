"""
Jalankan:
    python vision/02_deteksi_warna.py                      # dari webcam
    python vision/02_deteksi_warna.py vision/sampel/kotak_hijau.jpg   # dari gambar
Tekan q untuk keluar. Ganti WARNA untuk memilih warna target.
"""
import sys

import cv2
import numpy as np

WARNA = "hijau"  # pilihan: "hijau", "biru", "merah"

# Rentang HSV awal (H: 0-179 di OpenCV). Sesuaikan dengan 03_atur_hsv.py
RENTANG = {
    "hijau": [((40, 70, 50), (85, 255, 255))],
    "biru": [((100, 80, 50), (130, 255, 255))],
    # Merah ada di dua ujung skala H, jadi butuh dua rentang
    "merah": [((0, 100, 70), (10, 255, 255)), ((170, 100, 70), (179, 255, 255))],
}
LUAS_MIN = 800  # kontur lebih kecil dari ini dianggap noise

def buat_mask(hsv, warna):
    mask = None
    for lower, upper in RENTANG[warna]:
        m = cv2.inRange(hsv, np.array(lower), np.array(upper))
        mask = m if mask is None else cv2.bitwise_or(mask, m)
    # Rapikan bintik kecil
    kernel = np.ones((5, 5), np.uint8)
    return cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

def proses(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = buat_mask(hsv, WARNA)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for c in contours:
        if cv2.contourArea(c) < LUAS_MIN:
            continue
        x, y, w, h = cv2.boundingRect(c)
        approx = cv2.approxPolyDP(c, 0.04 * cv2.arcLength(c, True), True)
        bentuk = "kotak" if len(approx) == 4 else "bulat/lainnya"
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f"{WARNA} {bentuk}", (x, y - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    return frame, mask

if len(sys.argv) > 1:
    gambar = cv2.imread(sys.argv[1])
    if gambar is None:
        raise SystemExit("Gambar tidak ditemukan: " + sys.argv[1])
    hasil, mask = proses(gambar)
    cv2.imshow("hasil", hasil)
    cv2.imshow("mask", mask)
    cv2.waitKey(0)
else:
    cap = cv2.VideoCapture(0)
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        hasil, mask = proses(frame)
        cv2.imshow("hasil", hasil)
        cv2.imshow("mask", mask)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()

cv2.destroyAllWindows()
