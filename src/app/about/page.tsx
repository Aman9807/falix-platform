import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Falix Platform",
  description: "Learn about the mission, values, and team behind Falix.",
};

const MILESTONES = [
  { year: "2022", title: "Founded",          desc: "Falix was born from a need for modern sports management tools that don't look like they're from 2009." },
  { year: "2023", title: "First App Ships",  desc: "SchoolOS — our flagship sports academy management app — launched to 50 pilot academies." },
  { year: "2024", title: "Platform Launch",  desc: "Falix Platform 1.0 launched. Subdomain routing, multi-tenant architecture, and admin dashboards." },
  { year: "2026", title: "2.0 — Beyond",     desc: "A complete platform redesign. New engine, new design system, and a new vision for sports SaaS." },
];

const VALUES = [
  { icon: "⚡", title: "Speed",       desc: "Performance is a feature. Every millisecond matters to our users." },
  { icon: "🎨", title: "Design",      desc: "Beautiful, functional interfaces that people actually enjoy using." },
  { icon: "🔒", title: "Security",    desc: "Enterprise-grade security without the enterprise complexity." },
  { icon: "🤝", title: "Community",   desc: "Built with and for the sports community. Their feedback shapes every release." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "5rem" }}>
      <div className="container-xl">

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "5rem", maxWidth: "60ch", margin: "0 auto 5rem" }}>
          <p className="label" style={{ marginBottom: "1rem" }}>Our Story</p>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem,6vw,5rem)",
            fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.9,
            marginBottom: "1.25rem",
          }}>
            Built for the <span className="text-gradient">digital athlete.</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "rgba(248,250,252,0.5)", lineHeight: 1.7 }}>
            Falix started as a side project to fix the broken tools sports organizations were forced to use.
            Today we serve thousands of teams across dozens of countries.
          </p>
        </div>

        {/* Values */}
        <div style={{ marginBottom: "5rem" }}>
          <p className="label" style={{ textAlign: "center", marginBottom: "2rem" }}>Our Values</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }} className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="glass-card" style={{ padding: "1.5rem" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{v.icon}</span>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "rgba(248,250,252,0.45)", lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: "5rem" }}>
          <p className="label" style={{ textAlign: "center", marginBottom: "2.5rem" }}>Timeline</p>
          <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
            {/* Line */}
            <div style={{ position: "absolute", left: 72, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.07)" }} />

            {MILESTONES.map((m, i) => (
              <div key={m.year} style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: i < MILESTONES.length - 1 ? "2.5rem" : 0 }}>
                {/* Year */}
                <div style={{ width: 56, textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(248,250,252,0.3)" }}>{m.year}</span>
                </div>
                {/* Dot */}
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#2563EB", marginTop: 4, flexShrink: 0, boxShadow: "0 0 12px rgba(37,99,235,0.5)" }} />
                {/* Content */}
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.4rem" }}>{m.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(248,250,252,0.45)", lineHeight: 1.65 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "rgba(37,99,235,0.07)",
          border: "1px solid rgba(37,99,235,0.2)",
          borderRadius: "1.5rem",
        }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Join the journey.
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "rgba(248,250,252,0.45)", marginBottom: "1.75rem", maxWidth: "40ch", margin: "0 auto 1.75rem" }}>
            We're just getting started. The best version of Falix is the one we build together with our community.
          </p>
          <Link href="/downloads" className="btn-primary">
            Get Started <ArrowRight size={15} />
          </Link>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) { .values-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 500px) { .values-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
