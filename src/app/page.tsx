"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { NavigationPanel } from "@/components/navigation-panel";
import { MapPanel } from "@/components/map-panel";
import { DepthPanel } from "@/components/depth-panel";
import { CameraFeedsPanel } from "@/components/camera-feeds-panel";
import { SetupNotice } from "@/components/setup-notice";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useMissionImages } from "@/hooks/useMissionImages";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Vehicle } from "@/lib/types";

export default function Home() {
  const [vehicle, setVehicle] = useState<Vehicle>("asv");
  const { rows, latest } = useTelemetry(vehicle);
  const images = useMissionImages(vehicle);

  return (
    <main className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-background text-foreground xl:h-screen xl:w-screen xl:overflow-hidden">
      <div className="mx-auto flex h-full min-h-screen max-w-[1920px] flex-col px-5 pb-5 pt-4 sm:px-6 lg:px-7 xl:min-h-0">
        <DashboardHeader vehicle={vehicle} onVehicleChange={setVehicle} />

        {!isSupabaseConfigured ? (
          <SetupNotice />
        ) : (
          <div className="flex flex-1 flex-col gap-5 pt-5 xl:min-h-0 xl:flex-row">
            <div className="order-2 flex min-h-0 w-full shrink-0 flex-col xl:order-1 xl:w-[340px]">
              <NavigationPanel vehicle={vehicle} latest={latest} />
            </div>
            <div className="order-1 flex min-h-[500px] flex-1 flex-col xl:order-2 xl:min-h-0">
              {/* ASV punya GPS -> peta. ROV di bawah air -> grafik kedalaman. */}
              {vehicle === "asv" ? <MapPanel rows={rows} latest={latest} /> : <DepthPanel rows={rows} />}
            </div>
            <div className="order-3 flex min-h-0 w-full shrink-0 flex-col xl:w-[340px]">
              <CameraFeedsPanel vehicle={vehicle} images={images} />
            </div>
          </div>
        )}

        <footer className="mt-5 shrink-0 border-t border-border pb-1 pt-4 text-center text-sm font-medium tracking-wide text-sage-dingin">
          Copyright &copy; {new Date().getFullYear()} Gamantaray Universitas Gadjah Mada
        </footer>
      </div>
    </main>
  );
}
