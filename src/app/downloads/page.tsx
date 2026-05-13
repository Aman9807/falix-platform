"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Cpu, Laptop, ExternalLink, LayoutGrid } from "lucide-react";
import Link from "next/link";

const PLATFORM_MAP = [
  { key: "windows_url", Icon: Monitor,    label: "Windows" },
  { key: "mac_url",     Icon: Laptop,     label: "macOS"   },
  { key: "linux_url",   Icon: Cpu,        label: "Linux"   },
  { key: "android_url", Icon: Smartphone, label: "Android" },
];

export default function DownloadsPage() {
  const [apps,    setApps]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "apps"))
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by created_at desc
        data.sort((a: any, b: any) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
        setApps(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "5rem" }}>
      <div className="container-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          style={{ marginBottom: "3.5rem" }}
        >
          <p className="label" style={{ marginBottom: "0.875rem" }}>Downloads</p>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem,6vw,5rem)",
            fontWeight: 700, letterSpacing: "-0.04em",
            lineHeight: 0.9, marginBottom: "1.25rem",
          }}>
            App <span className="text-gradient">Downloads.</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(248,250,252,0.45)", maxWidth: "50ch", lineHeight: 1.65 }}>
            Download any Falix application for your platform. All apps are signed, notarized, and automatically updated.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="dl-grid">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card" style={{ padding: "1.5rem", height: 280 }}>
                {[80,60,40].map((w,j) => (
                  <div key={j} style={{ height: j===0 ? 52 : 14, width: `${w}%`, borderRadius: j===0?"0.875rem":"6px", background: "rgba(255,255,255,0.05)", marginBottom: j===0 ? "1.5rem":"0.75rem" }} />
                ))}
              </div>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "rgba(248,250,252,0.25)" }}>
            <LayoutGrid size={40} style={{ margin: "0 auto 1rem" }} />
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.125rem", fontWeight: 700 }}>No apps yet</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Check back soon — new apps are added regularly.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="dl-grid">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16,1,0.3,1] }}
                className="glass-card"
                style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                {/* Top */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <img src={app.logo_url} alt={app.title}
                    style={{ width: 52, height: 52, borderRadius: "0.875rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }} />
                  <Link href={`/app-sites/${app.slug}`}
                    style={{ color: "rgba(248,250,252,0.3)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#F8FAFC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,250,252,0.3)")}
                  >
                    <ExternalLink size={13} /> Site
                  </Link>
                </div>

                {/* Info */}
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>
                    {app.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(248,250,252,0.4)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {app.description}
                  </p>
                </div>

                {/* Download buttons */}
                <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p className="label" style={{ marginBottom: "0.5rem" }}>Download for</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {PLATFORM_MAP.filter(p => app[p.key]).map(({ key, Icon, label }) => (
                      <Link
                        key={key}
                        href={app[key]}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.55rem 0.75rem",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "0.625rem",
                          fontSize: "0.75rem", fontWeight: 600,
                          color: "rgba(248,250,252,0.65)",
                          textDecoration: "none",
                          transition: "background 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.09)"; (e.currentTarget as HTMLAnchorElement).style.color="#F8FAFC"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.04)"; (e.currentTarget as HTMLAnchorElement).style.color="rgba(248,250,252,0.65)"; }}
                      >
                        <Icon size={13} /> {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .dl-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .dl-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
