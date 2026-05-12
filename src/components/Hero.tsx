"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const yShift  = useTransform(scrollYProgress, [0, 0.65], [0, -60]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "6rem" }}
    >
      <motion.div
        style={{ opacity, y: yShift, willChange: "opacity, transform" }}
        className="container-xl relative z-10 flex flex-col items-center text-center gap-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.4rem 1rem 0.4rem 0.6rem",
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: 9999,
          }}
        >
          <span style={{
            background: "#2563EB", borderRadius: 9999,
            padding: "0.2rem 0.6rem",
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#fff",
          }}>
            New
          </span>
          <Zap size={12} style={{ color: "#60a5fa" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(248,250,252,0.7)", letterSpacing: "0.04em" }}>
            Falix Platform 2.0 is here
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl"
          style={{ maxWidth: "16ch" }}
        >
          Beyond{" "}
          <span className="text-gradient">Software.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
            color: "rgba(248,250,252,0.5)",
            fontWeight: 500,
            maxWidth: "52ch",
            lineHeight: 1.65,
          }}
        >
          The next generation of sports management and SaaS ecosystems.
          High-performance tools, engineered for the modern digital athlete.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href="/downloads" className="btn-primary" style={{ fontSize: "0.8125rem", padding: "0.9rem 2rem" }}>
            Start for Free
            <ArrowRight size={16} />
          </Link>
          <Link href="/about" className="btn-secondary" style={{ fontSize: "0.8125rem", padding: "0.9rem 2rem" }}>
            Explore Platform
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: "flex", alignItems: "center", gap: "1rem",
            padding: "0.75rem 1.5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 9999,
          }}
        >
          <div style={{ display: "flex", gap: "-0.5rem" }}>
            {["#2563EB","#7C3AED","#0891B2","#059669"].map((c,i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: c, border: "2px solid #050508",
                marginLeft: i > 0 ? -8 : 0,
              }} />
            ))}
          </div>
          <span style={{ fontSize: "0.75rem", color: "rgba(248,250,252,0.5)", fontWeight: 500 }}>
            Trusted by <strong style={{ color: "#F8FAFC" }}>2,000+</strong> teams worldwide
          </span>
        </motion.div>
      </motion.div>

      {/* Ambient shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "18%", left: "5%",
            width: "clamp(120px,18vw,260px)", height: "clamp(120px,18vw,260px)",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "2rem",
            transform: "rotate(15deg)",
            willChange: "transform",
          }}
        />
        <motion.div
          animate={{ y: [0, 28, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: "15%", right: "5%",
            width: "clamp(80px,12vw,180px)", height: "clamp(80px,12vw,180px)",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "50%",
            willChange: "transform",
          }}
        />
      </div>
    </section>
  );
}
