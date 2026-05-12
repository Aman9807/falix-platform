"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    tagline: "Perfect for individuals and small teams",
    monthly: 0,
    yearly: 0,
    cta: "Get Started Free",
    popular: false,
    features: ["Core Platform Access", "Basic Analytics", "Community Support", "1 Project Site", "5 GB Storage"],
  },
  {
    name: "Pro",
    tagline: "Advanced tools for power users",
    monthly: 15,
    yearly: 12,
    cta: "Start Pro Trial",
    popular: true,
    features: ["Global Subdomain Control", "Advanced Analytics", "Priority Support", "Unlimited Sites", "Custom Branding", "50 GB Storage"],
  },
  {
    name: "Enterprise",
    tagline: "Custom solutions for large organizations",
    monthly: 49,
    yearly: 39,
    cta: "Contact Sales",
    popular: false,
    features: ["White-label Deployment", "Dedicated Infrastructure", "24/7 Account Manager", "Custom API Access", "Unlimited Storage", "SLA Guarantee"],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <section id="pricing" className="page-section" style={{ width: "100%" }}>
      <div className="container-xl">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="label" style={{ marginBottom: "1rem" }}>Pricing</p>
          <h2 className="display-md" style={{ marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple, transparent{" "}
            <span className="text-gradient">pricing.</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(248,250,252,0.5)", maxWidth: "44ch", margin: "0 auto" }}>
            No hidden fees. Cancel anytime. Choose the plan that fits your workflow.
          </p>
        </div>

        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: billing === "monthly" ? "#F8FAFC" : "rgba(248,250,252,0.3)", transition: "color 0.2s" }}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
            style={{
              width: 52, height: 28,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 9999, padding: "3px",
              cursor: "pointer", position: "relative",
            }}
            aria-label="Toggle billing period"
          >
            <motion.div
              animate={{ x: billing === "yearly" ? 24 : 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%" }}
            />
          </button>
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: billing === "yearly" ? "#F8FAFC" : "rgba(248,250,252,0.3)", transition: "color 0.2s" }}>
            Yearly{" "}
            <span style={{ color: "#34d399", fontSize: "0.7rem", fontWeight: 700 }}>−20%</span>
          </span>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem", alignItems: "start" }} className="pricing-grid">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                background: plan.popular ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.03)",
                border: plan.popular ? "1px solid rgba(37,99,235,0.35)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.5rem",
                padding: "2rem",
                display: "flex", flexDirection: "column", gap: "1.5rem",
                boxShadow: plan.popular ? "0 0 60px rgba(37,99,235,0.12)" : "none",
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg,#2563EB,#7C3AED)",
                  padding: "0.3rem 1rem", borderRadius: "0 0 1rem 1rem",
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "#fff",
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan info */}
              <div style={{ paddingTop: plan.popular ? "0.5rem" : 0 }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.25rem", fontWeight: 700,
                  letterSpacing: "-0.02em", marginBottom: "0.35rem",
                }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "rgba(248,250,252,0.4)", lineHeight: 1.5 }}>{plan.tagline}</p>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={billing}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "3rem", fontWeight: 700, letterSpacing: "-0.04em",
                    }}
                  >
                    ${billing === "monthly" ? plan.monthly : plan.yearly}
                  </motion.span>
                </AnimatePresence>
                <span style={{ fontSize: "0.8rem", color: "rgba(248,250,252,0.3)", fontWeight: 600 }}>
                  / {billing === "monthly" ? "mo" : "yr"}
                </span>
              </div>

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.65rem", listStyle: "none" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: "rgba(37,99,235,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Check size={10} style={{ color: "#60a5fa" }} />
                    </div>
                    <span style={{ fontSize: "0.8125rem", color: "rgba(248,250,252,0.6)", fontWeight: 500 }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                style={{
                  marginTop: "auto",
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: 9999,
                  fontSize: "0.75rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  cursor: "pointer",
                  background: plan.popular ? "linear-gradient(135deg,#2563EB,#7C3AED)" : "rgba(255,255,255,0.06)",
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  transition: "opacity 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1";    (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; } }
      `}</style>
    </section>
  );
}
