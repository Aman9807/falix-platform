"use client";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download, Monitor, Laptop, Cpu, Smartphone, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PLATFORM_MAP = [
  { key: "windows_url", label: "Windows",        Icon: Monitor    },
  { key: "mac_url",     label: "macOS",           Icon: Laptop     },
  { key: "linux_url",   label: "Linux",           Icon: Cpu        },
  { key: "android_url", label: "Android",         Icon: Smartphone },
  { key: "website_url", label: "Website / Web App", Icon: Globe    },
];

export default function AboutAppPage() {
  const params = useParams();
  const subdomain = (params?.subdomain as string) || "";

  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subdomain) return;
    async function fetchAppData() {
      try {
        const appsRef = collection(db, "apps");
        const q = query(appsRef, where("slug", "==", subdomain.toLowerCase()), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) setAppData(snapshot.docs[0].data());
      } catch (err) {
        console.error("Error fetching app data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppData();
  }, [subdomain]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#030303", color: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#3b82f6", borderRightColor: "#3b82f6", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "rgba(248,250,252,0.3)", fontSize: "0.625rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Loading...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!appData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#030303", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "5rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#ef4444", margin: "0 0 1rem" }}>404</h1>
          <p style={{ color: "rgba(248,250,252,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, fontSize: "0.75rem", marginBottom: "2rem" }}>
            Application Not Found
          </p>
          <a href="https://flynx.site" style={{ padding: "0.75rem 1.5rem", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", textDecoration: "none" }}>
            Back to Flynx
          </a>
        </div>
      </div>
    );
  }

  const accentColor = appData.themeColor || "#3b82f6";

  // Determine available download platforms
  const availablePlatforms = PLATFORM_MAP.filter(p => !!appData[p.key]);
  const hasDownloads = availablePlatforms.some(p => p.key !== "website_url");
  const websiteUrl = appData.website_url;
  const isWebsiteOnly = !!websiteUrl && !hasDownloads;
  const downloadPageUrl = `/download`;

  return (
    <main style={{ minHeight: "100vh", background: "#030303", color: "#fff", fontFamily: "'Space Grotesk', Inter, sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Animated glow background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 600, height: 600, borderRadius: "50%", filter: "blur(140px)", backgroundColor: accentColor, opacity: 0.06 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", filter: "blur(120px)", backgroundColor: "#7c3aed", opacity: 0.05 }} />
      </div>

      {/* Top nav bar */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <a href={`https://${subdomain}.flynx.site`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(248,250,252,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,250,252,0.4)")}>
          <ArrowLeft size={14} /> Back to App
        </a>
        <a href="https://flynx.site" style={{ color: "rgba(248,250,252,0.2)", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
          Powered by FLYNX
        </a>
      </div>

      {/* Hero section */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 960, margin: "0 auto", padding: "4rem 2rem 3rem" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "3rem", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* App logo */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: -16, borderRadius: "2.5rem", filter: "blur(40px)", backgroundColor: accentColor, opacity: 0.3, zIndex: 0 }} />
            <img
              src={appData.logo_url}
              alt={appData.title}
              style={{ width: 140, height: 140, borderRadius: "2rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)", boxShadow: `0 24px 80px rgba(0,0,0,0.6)`, position: "relative", zIndex: 1 }}
            />
          </div>

          {/* App info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ color: "rgba(248,250,252,0.3)", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isWebsiteOnly ? "Web Application" : "Application"} · v{appData.version || "1.0.0"}
            </p>

            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", lineHeight: 0.95, margin: "0 0 1.5rem", background: `linear-gradient(135deg, #fff 60%, ${accentColor})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {appData.title}
            </h1>

            {/* Platform badges */}
            {availablePlatforms.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {availablePlatforms.map(({ key, label, Icon }) => (
                  <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.75rem", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(248,250,252,0.5)" }}>
                    <Icon size={10} /> {label}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p style={{ fontSize: "1rem", color: "rgba(248,250,252,0.55)", lineHeight: 1.8, maxWidth: 560, marginBottom: "2.5rem", whiteSpace: "pre-wrap" }}>
              {appData.description}
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Primary CTA: Website or Download */}
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: 9999, background: accentColor, color: "#fff", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", boxShadow: `0 8px 32px ${accentColor}44`, transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  <ExternalLink size={16} /> Open Web App
                </a>
              ) : null}

              {/* Downloads button — only if there are actual binary downloads */}
              {hasDownloads && (
                <a
                  href={downloadPageUrl}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <Download size={16} /> Downloads
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", maxWidth: 960, margin: "0 auto 0" }} />

      {/* Features section */}
      {appData.features && Array.isArray(appData.features) && appData.features.length > 0 && (
        <div style={{ position: "relative", zIndex: 10, maxWidth: 960, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
          <h2 style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: accentColor, marginBottom: "2rem" }}>
            Key Features
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {appData.features.map((feature: string, i: number) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.25rem", padding: "1.5rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "0.75rem", background: `${accentColor}20`, border: `1px solid ${accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor }} />
                </div>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>{feature}</h3>
                <p style={{ fontSize: "0.75rem", color: "rgba(248,250,252,0.35)", lineHeight: 1.6 }}>
                  {appData.title} delivers a premium {feature.toLowerCase()} experience built for modern users.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.04)", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(248,250,252,0.15)" }}>
          © 2026 {appData.title}. Distributed via Flynx Platform.
        </p>
        <a href="https://flynx.site" style={{ fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(248,250,252,0.15)", textDecoration: "none" }}>
          FLYNX.SITE →
        </a>
      </div>
    </main>
  );
}
