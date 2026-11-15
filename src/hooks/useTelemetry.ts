"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Telemetry, Vehicle } from "@/lib/types";

const MAX_ROWS = 300; // jumlah data terakhir yang disimpan di layar

/**
 * Telemetri satu wahana: ambil data terakhir, lalu dengarkan baris baru secara realtime.
 * Pola yang sama dipakai di useMissionImages.
 */
export function useTelemetry(vehicle: Vehicle) {
  const [rows, setRows] = useState<Telemetry[]>([]);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    let aktif = true;

    // 1. Ambil data lama (terbaru dulu, lalu dibalik supaya urut waktu)
    sb.from("telemetry")
      .select("*")
      .eq("vehicle", vehicle)
      .order("created_at", { ascending: false })
      .limit(MAX_ROWS)
      .then(({ data, error }) => {
        if (error) console.error("Gagal mengambil telemetry:", error.message);
        if (aktif) setRows(((data ?? []) as Telemetry[]).reverse());
      });

    // 2. Dengarkan baris baru
    const channel = sb
      .channel(`telemetry-${vehicle}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "telemetry", filter: `vehicle=eq.${vehicle}` },
        (payload) => setRows((lama) => [...lama, payload.new as Telemetry].slice(-MAX_ROWS)),
      )
      .subscribe();

    return () => {
      aktif = false;
      setRows([]);
      sb.removeChannel(channel);
    };
  }, [vehicle]);

  const latest = rows.length > 0 ? rows[rows.length - 1] : null;
  return { rows, latest };
}
