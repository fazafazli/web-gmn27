-- Menghapus semua data latihan, tabelnya tetap ada.
-- Jalankan di SQL Editor kalau dashboard sudah terlalu penuh data dummy.
truncate table public.telemetry restart identity;
truncate table public.mission_images restart identity;
