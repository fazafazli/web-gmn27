# Gamantaray Starter Monitoring

Starter web monitoring untuk magang software programmer Gamantaray. Satu dashboard untuk dua wahana:

- **ASV Safinah One**: peta + jejak lintasan, telemetri, foto underwater dan surface
- **ROV Almasena**: grafik kedalaman, telemetri, foto QR dan payload

Stack: **Next.js** (tampilan) + **Supabase** (database, Storage, Realtime) + **Python** (pengirim data dan vision).

```
Wahana / skrip Python  ->  Supabase (tabel + Storage)  ->  Realtime  ->  Dashboard Next.js
```

---

## 1. Jalankan web

Butuh: Git, Node.js LTS, Python 3.11+.

```bash
git clone https://github.com/fazafazli/web-gmn27.git
cd web-gmn27
npm install
```

## 2. Siapkan Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (region Southeast Asia / Singapore).
2. Buka **SQL Editor -> New query**, tempel isi `supabase/schema.sql`, klik **Run**.
3. Buka **Project Settings -> API**, salin **Project URL** dan **anon public key**.
4. Salin `.env.example` menjadi `.env.local`, lalu isi kedua nilai itu.

```bash
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run dev
```

Buka http://localhost:3000. Kalau muncul petunjuk "Supabase belum terhubung", cek lagi isi `.env.local` lalu jalankan ulang `npm run dev`.

## 3. Isi dashboard dengan data dummy

```bash
pip install -r requirements.txt
python tools/dummy_sender.py --vehicle asv     # kapal berputar di sekitar bengkel
python tools/dummy_sender.py --vehicle rov     # ROV naik-turun 0-3 m
```

Kirim foto contoh:

```bash
python tools/send_image.py vision/sampel/kotak_biru_bawah_air.jpg --vehicle asv --slot underwater
python tools/send_image.py vision/sampel/kotak_hijau.jpg --vehicle asv --slot surface
python tools/send_image.py vision/sampel/qr_rak_a.png --vehicle rov --slot qr --note "RAK-A"
```

Data latihan sudah terlalu banyak? Jalankan `supabase/reset_data.sql` di SQL Editor.

## 4. Vision

| File | Isi |
| --- | --- |
| `vision/01_kamera.py` | Membaca webcam |
| `vision/02_deteksi_warna.py` | HSV + kontur: deteksi warna dan bentuk kotak |
| `vision/03_atur_hsv.py` | Slider untuk mencari rentang HSV |
| `vision/04_baca_qr.py` | Membaca QR code (misi ROV) |
| `vision/05_yolo_webcam.py` | Menjalankan model tim (OpenVINO) di webcam, menampilkan FPS |
| `vision/06_deteksi_kirim.py` | Deteksi YOLO lalu kirim foto ke dashboard |
| `vision/sampel/` | Gambar contoh untuk latihan tanpa objek asli |

Skrip 02 dan 04 bisa memakai gambar: `python vision/02_deteksi_warna.py vision/sampel/kotak_hijau.jpg`.

Model tim (tiga folder OpenVINO: `kotak`, `bola_merah_hijau`, `bola_biru`) tidak ada di repo. Salin dari flashdisk ke `vision/models/` sesuai `vision/models/README.md`.

## 5. Peta isi repo

| Lokasi | Isi |
| --- | --- |
| `src/app/page.tsx` | Halaman utama, menyusun semua panel |
| `src/hooks/useTelemetry.ts` | Ambil data awal + subscribe Realtime tabel `telemetry` |
| `src/hooks/useMissionImages.ts` | Hal yang sama untuk tabel `mission_images` |
| `src/components/navigation-panel.tsx` | Navigation Data, baterai, dan Mission Log |
| `src/components/map-panel.tsx`, `MapLeaflet.tsx` | Real-Time Map ASV: grid, buoy, kapal, jejak |
| `src/components/depth-panel.tsx` | Depth Monitor untuk ROV |
| `src/components/camera-feeds-panel.tsx` | Camera Feeds (foto misi) |
| `src/lib/types.ts` | Bentuk data, urutan Mission Log, slot Camera Feeds |
| `src/lib/arena.ts` | Posisi bola, start, dan kotak misi di peta (dalam meter) |
| `public/` | Logo dan ikon peta (sama dengan web lomba) |
| `supabase/schema.sql` | Tabel, izin akses, Realtime, bucket foto |
| `tools/` | Pengirim data dummy dan foto |

Isi kolom `mission_state` harus sama dengan `key` di `MISSION_STEPS` (`src/lib/types.ts`), misalnya `underwater_imaging`, supaya Mission Log menyorot tahap yang benar.

Urutan saat menambah data baru selalu sama: **database -> pengirim data -> tampilan**.

## Catatan

- Izin akses di `schema.sql` sengaja longgar untuk latihan. Untuk lomba, batasi akses tulis.
- `.env.local` dan file model tidak boleh di-push ke GitHub (sudah diatur di `.gitignore`).
- Peta memakai tile OpenStreetMap yang butuh internet. Tanpa internet, jejak tetap tergambar di latar gelap.
