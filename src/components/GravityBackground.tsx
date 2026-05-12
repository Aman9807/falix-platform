"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";

// Deterministic config — no Math.random() to prevent hydration issues
const ORBS = [
  { id: 0, size: "55vmax", color: "#1e40af", x: "10%",  y: "15%", damping: 45, stiffness: 40, factor: 0.04 },
  { id: 1, size: "48vmax", color: "#5b21b6", x: "88%",  y: "78%", damping: 55, stiffness: 35, factor: 0.06 },
  { id: 2, size: "38vmax", color: "#1d4ed8", x: "72%",  y: "12%", damping: 50, stiffness: 45, factor: 0.035 },
  { id: 3, size: "60vmax", color: "#4c1d95", x: "18%",  y: "88%", damping: 60, stiffness: 30, factor: 0.05 },
];

function Orb({ id, size, color, x, y, damping, stiffness, factor }: typeof ORBS[0]) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping, stiffness });
  const sy = useSpring(my, { damping, stiffness });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX - window.innerWidth  / 2) * factor);
      my.set((e.clientY - window.innerHeight / 2) * factor);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [factor]);

  return (
    <motion.div
      style={{
        position: "fixed",
        width: size,
        height: size,
        left: x,
        top: y,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: color,
        borderRadius: "50%",
        filter: "blur(130px)",
        willChange: "transform",
        pointerEvents: "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.18, 0.28, 0.18] }}
      transition={{
        opacity: {
          duration: 7 + id * 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: id * 0.8,
        },
      }}
    />
  );
}

export default function GravityBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor: "#050508", zIndex: -1 }}
    >
      {ORBS.map(orb => <Orb key={orb.id} {...orb} />)}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Inline SVG noise grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="f">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#f)"/>
      </svg>
    </div>
  );
}
