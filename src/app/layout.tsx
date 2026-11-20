import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "KineticFix · Clinical Physiotherapy & Biomechanical Audit",
  description:
    "Musculoskeletal and kinetic chain diagnostic audit across 7 clinical injury tracks with instant 5-pillar functional scoring and prescribed 3-phase rehabilitation protocol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased scroll-smooth dark">
      <body className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
