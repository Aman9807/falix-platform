"use client";

import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Alex M.",    role: "Head Coach, FC Velocity",       rating: 5, text: "Flynx transformed how we manage our entire academy. The real-time analytics alone are worth it." },
  { name: "Priya S.",   role: "Operations Director",           rating: 5, text: "Clean, fast, and incredibly powerful. Our team onboarded in a single afternoon." },
  { name: "Jordan K.",  role: "Software Architect",            rating: 5, text: "The subdomain system is brilliant. Each club gets their own branded portal automatically." },
  { name: "Maria L.",   role: "Sports Scientist",              rating: 5, text: "Finally an app that understands how sports organizations actually work. Love the bento dashboard." },
  { name: "Tom H.",     role: "Performance Analyst",           rating: 5, text: "Replaced three tools with Flynx. The reporting is leagues ahead of anything else we tried." },
  { name: "Yuki T.",    role: "Club Administrator",            rating: 5, text: "The pricing is ridiculously fair for what you get. Our whole federation switched within a month." },
  { name: "Carlos B.",  role: "Technical Director",            rating: 5, text: "Incredible velocity of updates. The team ships quality features faster than anyone else." },
  { name: "Aisha W.",   role: "Digital Transformation Lead",   rating: 5, text: "Flynx's API integration allowed us to sync our existing systems seamlessly. Zero downtime." },
];

function ReviewCard({ name, role, rating, text }: typeof REVIEWS[0]) {
  return (
    <div
      style={{
        width: 320, flexShrink: 0,
        padding: "1.5rem",
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1.25rem",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: 3, marginBottom: "0.875rem" }}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={12} style={{ fill: "#FBBF24", color: "#FBBF24" }} />
        ))}
      </div>
      {/* Text */}
      <p style={{ fontSize: "0.875rem", color: "rgba(248,250,252,0.65)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
        "{text}"
      </p>
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `hsl(${name.charCodeAt(0) * 5},60%,45%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>
          {name[0]}
        </div>
        <div>
          <p style={{ fontSize: "0.8125rem", fontWeight: 700, lineHeight: 1.2 }}>{name}</p>
          <p style={{ fontSize: "0.7rem", color: "rgba(248,250,252,0.35)", marginTop: 2 }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const doubled = [...REVIEWS, ...REVIEWS]; // Seamless loop

  return (
    <section className="page-section" style={{ width: "100%", overflow: "hidden" }}>
      <div className="container-xl" style={{ marginBottom: "3rem" }}>
        <p className="label" style={{ textAlign: "center", marginBottom: "0.75rem" }}>Testimonials</p>
        <h2 className="display-md" style={{ textAlign: "center", fontFamily: "'Space Grotesk', sans-serif" }}>
          Loved by <span className="text-gradient">teams everywhere.</span>
        </h2>
      </div>

      {/* Marquee row 1 */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          className="marquee-track"
          style={{ gap: "1.25rem", padding: "0.5rem 0" }}
        >
          {doubled.map((r, i) => <ReviewCard key={i} {...r} />)}
        </div>
        {/* Fade edges */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #050508 0%, transparent 12%, transparent 88%, #050508 100%)", pointerEvents: "none" }} />
      </div>

      {/* Marquee row 2 — reverse */}
      <div style={{ position: "relative", overflow: "hidden", marginTop: "1.25rem" }}>
        <div
          className="marquee-track"
          style={{ gap: "1.25rem", padding: "0.5rem 0", animationDirection: "reverse", animationDuration: "38s" }}
        >
          {[...doubled].reverse().map((r, i) => <ReviewCard key={i} {...r} />)}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #050508 0%, transparent 12%, transparent 88%, #050508 100%)", pointerEvents: "none" }} />
      </div>
    </section>
  );
}
