"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { MissionImage, Vehicle } from "@/lib/types";

/** Daftar foto misi satu wahana, terbaru di depan, ikut bertambah secara realtime. */
export function useMissionImages(vehicle: Vehicle) {
  const [images, setImages] = useState<MissionImage[]>([]);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    let aktif = true;

    sb.from("mission_images")
      .select("*")
      .eq("vehicle", vehicle)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!aktif) return;
        if (error) console.error("Gagal mengambil mission_images:", error.message);
        setImages((data ?? []) as MissionImage[]);
      });

    const channel = sb
      .channel(`images-${vehicle}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mission_images", filter: `vehicle=eq.${vehicle}` },
        (payload) => setImages((lama) => [payload.new as MissionImage, ...lama].slice(0, 50)),
      )
      .subscribe();

    return () => {
      aktif = false;
      setImages([]);
      sb.removeChannel(channel);
    };
  }, [vehicle]);

  return images;
}
