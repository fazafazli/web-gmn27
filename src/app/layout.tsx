import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamantaray Monitoring",
  description: "Starter web monitoring ASV Safinah One dan ROV Almasena",
};

// Font memakai font bawaan sistem (lihat globals.css) supaya web tetap jalan tanpa internet
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
