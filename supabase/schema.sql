-- 1. Tabel telemetri: satu baris = satu laporan posisi/status wahana
create table if not exists public.telemetry (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  vehicle text not null check (vehicle in ('asv', 'rov')),
  latitude double precision,        -- ASV
  longitude double precision,       -- ASV
  heading_deg real,                 -- arah hadap, 0-360 (0 = utara)
  speed_ms real,                    -- kecepatan, m/s
  depth_m real,                     -- ROV
  battery_v real,
  mission_state text                -- tahap misi, lihat MISSION_STEPS di src/lib/types.ts
);

-- 2. Tabel foto misi: menyimpan link foto yang ada di Storage
create table if not exists public.mission_images (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  vehicle text not null check (vehicle in ('asv', 'rov')),
  slot text not null,               -- ASV: 'underwater', 'surface' | ROV: 'qr', 'payload'
  image_url text not null,
  note text
);

create index if not exists telemetry_vehicle_time on public.telemetry (vehicle, created_at desc);
create index if not exists images_vehicle_time on public.mission_images (vehicle, created_at desc);

-- 3. Izinkan web membaca dan skrip menulis (KHUSUS LATIHAN)
--    Siapa pun yang memegang anon key bisa menulis. Untuk lomba, batasi akses tulis.
alter table public.telemetry enable row level security;
alter table public.mission_images enable row level security;

create policy "baca telemetry" on public.telemetry for select to anon using (true);
create policy "tulis telemetry" on public.telemetry for insert to anon with check (true);
create policy "baca images" on public.mission_images for select to anon using (true);
create policy "tulis images" on public.mission_images for insert to anon with check (true);

-- 4. Nyalakan Realtime untuk kedua tabel
alter publication supabase_realtime add table public.telemetry, public.mission_images;

-- 5. Bucket publik untuk file foto
insert into storage.buckets (id, name, public)
values ('mission-images', 'mission-images', true)
on conflict (id) do nothing;

create policy "upload foto" on storage.objects
  for insert to anon with check (bucket_id = 'mission-images');
