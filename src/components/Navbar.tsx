"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FBUser } from "firebase/auth";
import { ADMIN_EMAILS } from "@/lib/constants";
import { ShieldAlert } from "lucide-react";

const NAV_LINKS = [
  { name: "About",     href: "/about" },
  { name: "Downloads", href: "/downloads" },
  { name: "Pricing",   href: "/pricing" },
  { name: "Reviews",   href: "/reviews" },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [user,        setUser]        = useState<FBUser | null>(null);
  const [isAdmin,     setIsAdmin]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (u && u.email) {
        const email = u.email.toLowerCase().trim();
        setIsAdmin(ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(email));
      } else {
        setIsAdmin(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Fixed wrapper ── */}
      <header className="fixed top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none">
        <nav
          className="pointer-events-auto w-full"
          style={{
            maxWidth: scrolled ? 820 : 1300,
            margin: "0 auto",
            padding: "1.25rem 1.5rem 0",
            transition: "max-width 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Pill container */}
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: scrolled
                ? "rgba(5,5,8,0.75)"
                : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 9999,
              padding: "0.5rem 0.5rem 0.5rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.4)" : "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                flexShrink: 0,
              }}
            >
              FLYNX
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    style={{
                      padding: "0.4rem 0.9rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      borderRadius: 9999,
                      color: active ? "#F8FAFC" : "rgba(248,250,252,0.45)",
                      background: active ? "rgba(255,255,255,0.08)" : "transparent",
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.target as HTMLElement).style.color = "#F8FAFC";
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.target as HTMLElement).style.color = "rgba(248,250,252,0.45)";
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "#f87171",
                        padding: "0.4rem 0.75rem", borderRadius: 9999,
                        background: "rgba(248,113,113,0.05)",
                        transition: "all 0.2s",
                      }}
                    >
                      <ShieldAlert size={14} />
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "#60a5fa",
                      padding: "0.4rem 0.75rem", borderRadius: 9999,
                      transition: "color 0.15s",
                    }}
                  >
                    <User size={14} />
                    Profile
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  style={{
                    fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "rgba(248,250,252,0.45)",
                    padding: "0.4rem 0.75rem", borderRadius: 9999,
                    transition: "color 0.15s",
                  }}
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/downloads"
                className="btn-primary"
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.7rem" }}
              >
                Get Started
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </motion.div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[199]"
            style={{ background: "rgba(5,5,8,0.95)", backdropFilter: "blur(16px)" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
              {/* Links */}
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16,1,0.3,1] }}
                >
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: pathname === link.href ? "#F8FAFC" : "rgba(248,250,252,0.35)",
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 w-full max-w-xs mt-4"
              >
                <Link href="/login" className="btn-secondary" style={{ justifyContent: "center" }}>
                  Sign In
                </Link>
                <Link href="/downloads" className="btn-primary" style={{ justifyContent: "center" }}>
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
