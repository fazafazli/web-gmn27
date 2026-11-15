"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import { CameraIcon } from "./camera-icon";
import { CAMERA_FEEDS, type MissionImage, type Vehicle } from "@/lib/types";

function CameraCard({
  title,
  label,
  imageUrl,
  onSelect,
}: {
  title: string;
  label: string;
  imageUrl?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="border border-border bg-surface px-4 py-3 text-left shadow-[0_0_0_1px_rgba(26,58,56,0.45)_inset] transition-colors hover:bg-foreground/5"
    >
      <div className="relative z-10 mb-8 flex items-center justify-between text-sm text-sage-dingin">
        <span className="font-semibold tracking-[0.16em] text-kapur-muda/80 drop-shadow-md">{title}</span>
      </div>
      <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 overflow-hidden rounded-md bg-black/20 text-sage-dingin">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="absolute inset-0 h-full w-full object-cover opacity-90" />
        ) : (
          <>
            <CameraIcon className="h-16 w-16 text-sage-dingin/80" />
            <span className="text-sm uppercase tracking-[0.24em]">{label}</span>
          </>
        )}
      </div>
    </button>
  );
}

export function CameraFeedsPanel({ vehicle, images }: { vehicle: Vehicle; images: MissionImage[] }) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  // images sudah urut terbaru dulu, jadi yang pertama cocok = foto terbaru di slot itu
  const fotoTerbaru = (slot: string) => images.find((img) => img.slot === slot)?.image_url;

  return (
    <>
      <aside className="flex min-h-0 flex-col gap-0 border border-border bg-surface-strong shadow-[0_0_0_1px_var(--border)_inset]">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-border px-5 py-4 text-[1.05rem] font-medium tracking-wide text-kapur-muda">
          <Video className="h-4 w-4 text-lime-neon" />
          Camera Feeds
        </div>
        <div className="grid gap-px overflow-y-auto bg-foreground/10">
          {CAMERA_FEEDS[vehicle].map((feed) => {
            const url = fotoTerbaru(feed.slot);
            return (
              <CameraCard
                key={feed.slot}
                title={feed.title}
                label={feed.label}
                imageUrl={url}
                onSelect={() => url && setModalImage(url)}
              />
            );
          })}
        </div>
      </aside>

      {/* Tampilan layar penuh saat foto diklik */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Foto misi"
            className="max-h-[90vh] max-w-full rounded-lg border-2 border-lime-neon object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
