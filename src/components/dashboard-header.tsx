"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import type { Vehicle } from "@/lib/types";

export function DashboardHeader({
  vehicle,
  onVehicleChange,
}: {
  vehicle: Vehicle;
  onVehicleChange: (v: Vehicle) => void;
}) {
  const [jam, setJam] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    const next = !isLightMode;
    document.body.classList.toggle("light-mode", next);
    setIsLightMode(next);
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTanggal(new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(now));
      setJam(
        new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
          .format(now)
          .replace(/:/g, ".") + " WIB",
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const tombol = (v: Vehicle, label: string) => (
    <button
      type="button"
      onClick={() => onVehicleChange(v)}
      className={`border px-4 py-1.5 text-sm transition-colors ${
        vehicle === v
          ? "border-lime-neon bg-lime-neon text-midnight-hitam"
          : "border-border text-kapur-muda/80 hover:bg-foreground/5"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-5">
        <div className="flex h-12 w-16 shrink-0 items-center justify-center">
          <Image
            src="/logo.png"
            alt="Gamantaray"
            width={80}
            height={48}
            style={{ width: "auto", height: "auto" }}
            className={`max-h-full max-w-full object-contain drop-shadow-[0_0_8px_rgba(217,242,26,0.3)] transition-all duration-500 ${
              isLightMode ? "brightness-[0.25] sepia-[0.5] hue-rotate-[120deg]" : ""
            }`}
            priority
          />
        </div>
        <h1 className="bg-gradient-to-r from-kapur-muda to-sage-dingin bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          {vehicle === "asv" ? "Safinah One" : "Almasena"}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        {/* Pilihan wahana */}
        <div className="flex gap-2">
          {tombol("asv", "ASV")}
          {tombol("rov", "ROV")}
        </div>

        <button
          onClick={toggleTheme}
          className="group relative flex h-10 w-10 items-center justify-center text-sage-dingin transition-all duration-500 hover:text-lime-neon focus:outline-none"
          title="Ganti tema"
        >
          <Sun className={`absolute h-6 w-6 transition-all duration-500 ${isLightMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          <Moon className={`absolute h-6 w-6 transition-all duration-500 ${isLightMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
        </button>

        <div className="flex flex-col items-end text-right">
          <span className="text-sm font-medium tracking-wider text-kapur-muda">{jam}</span>
          <span className="text-xs font-medium text-sage-dingin">{tanggal}</span>
        </div>
      </div>
    </header>
  );
}
