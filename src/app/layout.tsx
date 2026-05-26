import type { Metadata } from "next";
import "./globals.css";
import GravityBackground from "@/components/GravityBackground";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "Flynx Platform | Beyond Software",
  description: "The next generation of sports management and SaaS ecosystems. High-performance tools engineered for the modern digital athlete.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body>
        <GravityBackground />
        <Navbar />
        <main style={{ position: "relative", zIndex: 10 }}>
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
