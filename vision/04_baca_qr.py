"""04 - Membaca QR code (dipakai di misi ROV Almasena).

Jalankan:
    python vision/04_baca_qr.py                         # dari webcam
    python vision/04_baca_qr.py vision/sampel/qr_rak_a.png   # dari gambar
"""
import sys

import cv2

detector = cv2.QRCodeDetector()


def baca(frame):
    teks, points, _ = detector.detectAndDecode(frame)
    if not teks:
        # Trik untuk gambar buram/kehijauan (kondisi bawah air): grayscale + naikkan kontras
        gray = cv2.equalizeHist(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))
        teks, points, _ = detector.detectAndDecode(gray)
    if teks and points is not None:
        pts = points.astype(int).reshape(-1, 2)
        cv2.polylines(frame, [pts], True, (255, 0, 0), 3)
        cv2.putText(frame, teks, (pts[0][0], pts[0][1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
    return teks, frame


if len(sys.argv) > 1:
    gambar = cv2.imread(sys.argv[1])
    if gambar is None:
        raise SystemExit("Gambar tidak ditemukan: " + sys.argv[1])
    teks, hasil = baca(gambar)
    print("QR terbaca:", teks or "(tidak terbaca)")
    cv2.imshow("qr", hasil)
    cv2.waitKey(0)
else:
    cap = cv2.VideoCapture(0)
    terakhir = ""
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        teks, hasil = baca(frame)
        if teks and teks != terakhir:
            print("QR terbaca:", teks)
            terakhir = teks
        cv2.imshow("qr", hasil)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()

cv2.destroyAllWindows()
