import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Nilai ini dibaca dari file .env.local (lihat .env.example)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  url.startsWith("https://") && !url.includes("xxxxx") && anonKey.length > 20;

// Kalau .env.local belum diisi, supabase = null dan halaman menampilkan petunjuk setup
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
