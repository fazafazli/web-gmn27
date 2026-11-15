import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * Endpoint opsional untuk mengirim foto lewat HTTP (misalnya dari perangkat yang tidak bisa memakai
 * library Supabase). Contoh:
 *   curl -F "foto=@gambar.jpg" -F "vehicle=asv" -F "slot=surface" http://localhost:3000/api/upload
 */
const BUCKET = "mission-images";
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Supabase belum diatur" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("foto");
  const vehicle = (form.get("vehicle") as string) || "asv";
  const slot = (form.get("slot") as string) || "surface";

  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Kirim satu file gambar (maks 5 MB) di field 'foto'" }, { status: 400 });
  }
  if (vehicle !== "asv" && vehicle !== "rov") {
    return NextResponse.json({ error: "vehicle harus 'asv' atau 'rov'" }, { status: 400 });
  }

  const nama = `${vehicle}-${slot}-${Date.now()}.jpg`;
  const { error: errUpload } = await supabase.storage
    .from(BUCKET)
    .upload(nama, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (errUpload) return NextResponse.json({ error: errUpload.message }, { status: 500 });

  const url = supabase.storage.from(BUCKET).getPublicUrl(nama).data.publicUrl;
  const { error: errDb } = await supabase.from("mission_images").insert({ vehicle, slot, image_url: url });
  if (errDb) return NextResponse.json({ error: errDb.message }, { status: 500 });

  return NextResponse.json({ ok: true, url });
}
