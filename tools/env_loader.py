"""Membaca URL dan key Supabase dari file .env.local di folder utama repo.

Dipakai oleh skrip di folder tools/ dan vision/ supaya key tidak perlu ditulis di kode.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_supabase_env():
    env_file = ROOT / ".env.local"
    if not env_file.exists():
        raise SystemExit(
            "File .env.local belum ada. Salin .env.example menjadi .env.local lalu isi URL dan anon key."
        )

    values = {}
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        values[key.strip()] = val.strip().strip('"').strip("'")

    url = values.get("NEXT_PUBLIC_SUPABASE_URL", "")
    key = values.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    if not url.startswith("https://") or "xxxxx" in url or len(key) < 20:
        raise SystemExit("Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local dulu.")
    return url, key


def get_client():
    from supabase import create_client

    url, key = load_supabase_env()
    return create_client(url, key)
