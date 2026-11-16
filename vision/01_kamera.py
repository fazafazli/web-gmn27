"""
Jalankan: python vision/01_kamera.py
Tekan q untuk keluar. Ganti angka KAMERA kalau laptop punya lebih dari satu kamera.
"""
import cv2

KAMERA = 0

cap = cv2.VideoCapture(KAMERA)
if not cap.isOpened():
    raise SystemExit(f"Kamera {KAMERA} tidak bisa dibuka. Coba ganti KAMERA = 1.")

while True:
    ok, frame = cap.read()
    if not ok:
        break
    tinggi, lebar, kanal = frame.shape
    cv2.putText(frame, f"{lebar}x{tinggi}, {kanal} kanal (BGR)", (10, 25),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    cv2.imshow("kamera", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
