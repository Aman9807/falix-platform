"use client";

import { motion } from "framer-motion";
import { 
  auth, googleProvider, githubProvider 
} from "@/lib/firebase";
import { 
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword 
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [mode,     setMode]     = useState<"signin"|"signup">("signin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/profile");
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(" (auth/invalid-credential).", ""));
    } finally { setLoading(false); }
  };

  const social = async (provider: any) => {
    try { await signInWithPopup(auth, provider); router.push("/profile"); }
    catch (err: any) { setError(err.message); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", paddingTop: "5rem" }} className="login-layout">

      {/* Left: Brand panel */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "4rem 3rem",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden",
      }} className="login-brand">
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          >
            <p className="label" style={{ marginBottom: "1.5rem" }}>Flynx Platform</p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 0.95,
              marginBottom: "1.5rem",
            }}>
              Your portal to the{" "}
              <span className="text-gradient">ecosystem.</span>
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(248,250,252,0.45)", lineHeight: 1.7, maxWidth: "38ch" }}>
              Sign in to access your Flynx dashboard, manage subscriptions, and control your branded SaaS deployments.
            </p>
          </motion.div>

          {/* Testimonial quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16,1,0.3,1] }}
            style={{
              marginTop: "3rem",
              padding: "1.25rem 1.5rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "1rem",
              borderLeft: "3px solid #2563EB",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "rgba(248,250,252,0.6)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              "Flynx transformed how we manage our entire academy. The platform just works."
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(248,250,252,0.3)", fontWeight: 600 }}>— Alex M., Head Coach, FC Velocity</p>
          </motion.div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem 2rem",
      }}>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em",
              marginBottom: "0.375rem",
            }}>
              {mode === "signin" ? "Welcome back." : "Create your account."}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(248,250,252,0.4)" }}>
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(m => m === "signin" ? "signup" : "signin")}
                style={{ color: "#60a5fa", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Social login */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Google", fn: () => social(googleProvider) },
              { label: "GitHub", fn: () => social(githubProvider) },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.fn}
                style={{
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "0.75rem",
                  fontSize: "0.8125rem", fontWeight: 600,
                  color: "rgba(248,250,252,0.7)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              >
                Continue with {btn.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span className="label">or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(248,250,252,0.25)", pointerEvents: "none" }} />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                style={{
                  width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "0.75rem", color: "#F8FAFC",
                  fontSize: "0.875rem", outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(248,250,252,0.25)", pointerEvents: "none" }} />
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "0.75rem", color: "#F8FAFC",
                  fontSize: "0.875rem", outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>

            {error && (
              <p style={{
                fontSize: "0.8rem", color: "#f87171",
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.15)",
                padding: "0.625rem 0.875rem", borderRadius: "0.625rem",
              }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="btn-primary"
              style={{ marginTop: "0.25rem", width: "100%", justifyContent: "center", padding: "0.875rem", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Authenticating…" : mode === "signin" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-layout { grid-template-columns: 1fr !important; }
          .login-brand  { display: none !important; }
        }
      `}</style>
    </div>
  );
}
