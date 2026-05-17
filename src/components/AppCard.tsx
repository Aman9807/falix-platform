"use client";

import { ArrowRight, Monitor, Cpu, Smartphone, Globe } from "lucide-react";

interface AppCardProps {
  id: string;
  title: string;
  description: string;
  logo_url: string;
  slug: string;
  windows_url?: string;
  linux_url?: string;
  android_url?: string;
  website_url?: string;
}

function getAppUrl(slug: string): string {
  if (typeof window === "undefined") return `/app-sites/${slug}/about`;
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (isLocalhost) {
    return `http://localhost:3000/app-sites/${slug}/about`;
  }
  // Always use the actual subdomain — strip www if present
  return `https://${slug}.flynx.site/about`;
}

export default function AppCard({
  title, description, logo_url, slug,
  windows_url, linux_url, android_url, website_url,
}: AppCardProps) {
  const isWebsiteOnly = !!website_url && !windows_url && !linux_url && !android_url;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = getAppUrl(slug);
  }

  return (
    <a
      href={getAppUrl(slug)}
      onClick={handleClick}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          display: "flex", flexDirection: "column", gap: "1rem",
          cursor: "pointer", transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={logo_url} alt={title}
            style={{ width: 52, height: 52, borderRadius: "0.875rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
              {title}
            </h3>
            <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
              {windows_url && <Monitor size={11} style={{ color: "rgba(248,250,252,0.25)" }} />}
              {linux_url   && <Cpu     size={11} style={{ color: "rgba(248,250,252,0.25)" }} />}
              {android_url && <Smartphone size={11} style={{ color: "rgba(248,250,252,0.25)" }} />}
              {website_url && <Globe   size={11} style={{ color: "rgba(248,250,252,0.25)" }} />}
            </div>
          </div>
        </div>

        <p style={{
          fontSize: "0.8125rem", color: "rgba(248,250,252,0.4)", lineHeight: 1.6,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {description}
        </p>

        <div style={{
          paddingTop: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#60a5fa" }}>
            {isWebsiteOnly ? "Open App" : "Explore"}
          </span>
          <ArrowRight size={14} style={{ color: "rgba(248,250,252,0.2)" }} />
        </div>
      </div>
    </a>
  );
}
