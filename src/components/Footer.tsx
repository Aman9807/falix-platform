"use client";

import Link from "next/link";

const LINKS = {
  Product:  [{ name: "Downloads", href: "/downloads" }, { name: "Pricing", href: "/pricing" }, { name: "Reviews", href: "/reviews" }],
  Company:  [{ name: "About",     href: "/about"     }, { name: "Blog",    href: "#"         }, { name: "Careers",  href: "#"       }],
  Legal:    [{ name: "Privacy",   href: "#"          }, { name: "Terms",   href: "#"         }, { name: "Security", href: "#"       }],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", width: "100%" }}>
      <div className="container-xl" style={{ padding: "4rem 1.5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3,1fr)", gap: "3rem", marginBottom: "3rem" }}
             className="grid-cols-footer">
          {/* Brand */}
          <div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: "1.25rem", letterSpacing: "-0.03em",
              background: "linear-gradient(135deg,#2563EB,#7C3AED)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              COGNIS
            </span>
            <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem", color: "rgba(248,250,252,0.35)", lineHeight: 1.7, maxWidth: "26ch" }}>
              High-performance sports management and SaaS ecosystem, engineered for the modern digital athlete.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="label" style={{ marginBottom: "1rem" }}>{group}</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", listStyle: "none" }}>
                {items.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} style={{
                      fontSize: "0.8125rem", color: "rgba(248,250,252,0.45)",
                      textDecoration: "none", transition: "color 0.15s",
                    }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "#F8FAFC"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(248,250,252,0.45)"}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "0.5rem",
        }}>
          <p className="label">© 2026 Cognis Platform. All rights reserved.</p>
          <p className="label">Built with Next.js · Firebase · Framer Motion</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-cols-footer { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
