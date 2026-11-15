// Ditampilkan kalau .env.local belum diisi
export function SetupNotice() {
  return (
    <div className="mx-auto mt-10 max-w-xl border border-lime-neon/50 bg-surface-strong p-6">
      <h2 className="mb-3 text-lg font-semibold text-lime-neon">Supabase belum terhubung</h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-kapur-muda">
        <li>Buat project baru di supabase.com.</li>
        <li>
          Jalankan isi <code className="text-lime-neon">supabase/schema.sql</code> di SQL Editor.
        </li>
        <li>
          Salin <code className="text-lime-neon">.env.example</code> menjadi <code className="text-lime-neon">.env.local</code>,
          lalu isi URL dan anon key dari Project Settings → API.
        </li>
        <li>
          Hentikan server (Ctrl + C), lalu jalankan lagi <code className="text-lime-neon">npm run dev</code>.
        </li>
      </ol>
    </div>
  );
}
