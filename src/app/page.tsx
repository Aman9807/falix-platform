import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PLATFORMS = [
  "Next.js", "Firebase", "Framer Motion", "TypeScript",
  "Tailwind CSS", "Vercel", "React", "Firestore",
  "Next.js", "Firebase", "Framer Motion", "TypeScript",
  "Tailwind CSS", "Vercel", "React", "Firestore",
];

async function getApps() {
  try {
    const snap = await getDocs(collection(db, "apps"));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
    return data.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
  } catch (error) { 
    console.error("Error fetching apps:", error);
    return []; 
  }
}

export default async function Home() {
  const apps = await getApps();

  return (
    <>
      {/* ── Hero ── */}
      <Hero />

      {/* ── Tech Strip ── */}
      <SectionReveal className="page-section" style={{ paddingTop: "2rem", paddingBottom: "3rem", overflow: "hidden" } as any}>
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <p className="label">Powered by the best</p>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div className="marquee-track" style={{ gap: "3rem", alignItems: "center" }}>
            {PLATFORMS.map((p, i) => (
              <span key={i} style={{
                fontSize: "0.875rem", fontWeight: 600,
                color: "rgba(248,250,252,0.2)",
                letterSpacing: "0.06em", textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {p}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #050508 0%, transparent 15%, transparent 85%, #050508 100%)", pointerEvents: "none" }} />
        </div>
      </SectionReveal>

      {/* ── Apps / Products ── */}
      <SectionReveal id="apps" className="page-section">
        <div className="container-xl">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <p className="label" style={{ marginBottom: "0.75rem" }}>Our Ecosystem</p>
              <h2 className="display-md" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Powered by the{" "}
                <span className="text-gradient">Flynx Engine.</span>
              </h2>
            </div>
            <Link href="/downloads" className="btn-secondary" style={{ flexShrink: 0 }}>
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="apps-grid">
            {apps.length > 0 ? apps.map((app) => (
              <AppCard key={app.id} {...app} />
            )) : (
              [1,2,3].map(i => (
                <div key={i} className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "0.875rem", background: "rgba(255,255,255,0.05)", animation: "pulse 2s infinite" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 14, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.05)", marginBottom: 8, animation: "pulse 2s infinite" }} />
                      <div style={{ height: 10, width: "40%", borderRadius: 6, background: "rgba(255,255,255,0.04)", animation: "pulse 2s infinite" }} />
                    </div>
                  </div>
                  <div style={{ height: 12, width: "90%", borderRadius: 6, background: "rgba(255,255,255,0.04)", animation: "pulse 2s infinite" }} />
                  <div style={{ height: 12, width: "75%", borderRadius: 6, background: "rgba(255,255,255,0.04)", animation: "pulse 2s infinite" }} />
                </div>
              ))
            )}
          </div>
        </div>
      </SectionReveal>

      {/* ── Features Highlight ── */}
      <SectionReveal className="page-section">
        <div className="container-xl">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="features-grid">
            <div>
              <p className="label" style={{ marginBottom: "1rem" }}>Why Flynx</p>
              <h2 className="display-md" style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>
                Architecture built for{" "}
                <span className="text-gradient">scale.</span>
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(248,250,252,0.5)", lineHeight: 1.7, marginBottom: "2rem" }}>
                From single-club deployments to federation-wide platforms, Flynx scales without limits. Every subdomain is a fully branded, independently managed SaaS experience.
              </p>
              <Link href="/about" className="btn-secondary">
                Learn More <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { icon: "⚡", title: "Instant Deploy", desc: "New apps go live in under 60 seconds with zero infrastructure setup." },
                { icon: "🔒", title: "Secure Auth",    desc: "Firebase-backed authentication with role-based access control." },
                { icon: "🌐", title: "Multi-Tenant",   desc: "Each client gets their own branded subdomain, automatically." },
                { icon: "📊", title: "Live Analytics", desc: "Real-time dashboards with deep performance insights." },
              ].map(f => (
                <div key={f.title} className="glass-card" style={{ padding: "1.25rem" }}>
                  <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.625rem" }}>{f.icon}</span>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.4rem" }}>{f.title}</h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(248,250,252,0.4)", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ── Pricing ── */}
      <SectionReveal>
        <Pricing />
      </SectionReveal>

      {/* ── Reviews ── */}
      <SectionReveal>
        <Reviews />
      </SectionReveal>

      {/* ── CTA Banner ── */}
      <SectionReveal className="page-section">
        <div className="container-xl">
          <div style={{
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: "2rem",
            padding: "clamp(2.5rem,6vw,5rem)",
            textAlign: "center",
          }}>
            <p className="label" style={{ marginBottom: "1rem" }}>Get Started Today</p>
            <h2 className="display-md" style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>
              Ready to go{" "}
              <span className="text-gradient">beyond software?</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(248,250,252,0.5)", marginBottom: "2.5rem", maxWidth: "44ch", margin: "0 auto 2.5rem" }}>
              Join thousands of sports organizations already running on the Flynx platform.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/downloads" className="btn-primary">
                Start for Free <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="btn-secondary">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ── Footer ── */}
      <Footer />

      <style>{`
        @media (max-width: 900px) { .apps-grid { grid-template-columns: 1fr !important; } .features-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
      `}</style>
    </>
  );
}
