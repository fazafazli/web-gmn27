"""03 - Mencari rentang HSV yang pas dengan slider (trackbar).

Jalankan: python vision/03_atur_hsv.py
Geser slider sampai hanya objek target yang berwarna putih di jendela "mask".
Tekan p untuk mencetak angka, q untuk keluar. Salin angkanya ke 02_deteksi_warna.py.
"""
import cv2
import numpy as np

cv2.namedWindow("slider")
for nama, awal, maks in [("H min", 40, 179), ("S min", 70, 255), ("V min", 50, 255),
                         ("H max", 85, 179), ("S max", 255, 255), ("V max", 255, 255)]:
    cv2.createTrackbar(nama, "slider", awal, maks, lambda _: None)

cap = cv2.VideoCapture(0)
while True:
    ok, frame = cap.read()
    if not ok:
        break
    v = [cv2.getTrackbarPos(n, "slider") for n in ["H min", "S min", "V min", "H max", "S max", "V max"]]
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, np.array(v[:3]), np.array(v[3:]))

    cv2.imshow("kamera", frame)
    cv2.imshow("mask", mask)
    tombol = cv2.waitKey(1) & 0xFF
    if tombol == ord("p"):
        print(f"lower = {tuple(v[:3])}, upper = {tuple(v[3:])}")
    if tombol == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
