"use client";

import AuthCheck from "@/components/AuthCheck";
import SectionReveal from "@/components/SectionReveal";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, ShieldCheck, Zap, LogOut, Settings, Calendar, Mail } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setUserData({
              plan: "Free Tier",
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              status: "Active"
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <AuthCheck>
      <div style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div className="container-xl">
          
          {/* Header Section */}
          <SectionReveal style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ 
                  width: 80, height: 80, borderRadius: "2rem", 
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", fontWeight: 700, color: "#fff",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.3)"
                }}>
                  {auth.currentUser?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="label" style={{ marginBottom: "0.5rem" }}>Account Dashboard</p>
                  <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
                    Welcome back, <span className="text-gradient">User.</span>
                  </h1>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="btn-secondary"
                style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.2)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </SectionReveal>

          {/* Bento Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem" }} className="profile-grid">
            
            {/* Left Column: Main Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Account Overview */}
              <SectionReveal delay={0.1}>
                <div className="glass-card" style={{ padding: "2rem" }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <User size={20} style={{ color: "#60a5fa" }} />
                    Personal Information
                  </h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }} className="info-grid">
                    <div style={{ minWidth: 0 }}>
                      <p className="label" style={{ marginBottom: "0.5rem" }}>Email Address</p>
                      <div style={{ 
                        display: "flex", alignItems: "center", gap: "0.625rem", 
                        color: "rgba(248,250,252,0.8)", fontSize: "0.9375rem", fontWeight: 500,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}>
                        <Mail size={16} style={{ opacity: 0.3, flexShrink: 0 }} />
                        {auth.currentUser?.email}
                      </div>
                    </div>
                    <div>
                      <p className="label" style={{ marginBottom: "0.5rem" }}>Member Since</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "rgba(248,250,252,0.8)", fontSize: "0.9375rem", fontWeight: 500 }}>
                        <Calendar size={16} style={{ opacity: 0.3 }} />
                        {userData?.joinedDate || "May 2026"}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>

              {/* Subscriptions */}
              <SectionReveal delay={0.2}>
                <div className="glass-card" style={{ padding: "2rem", background: "rgba(37,99,235,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <CreditCard size={20} style={{ color: "#60a5fa" }} />
                      Subscription Plan
                    </h3>
                    <span style={{ 
                      padding: "0.4rem 0.8rem", borderRadius: "0.75rem", 
                      fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", 
                      letterSpacing: "0.08em", background: "#34d39920", color: "#34d399" 
                    }}>
                      {userData?.status || "Active"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                      <h4 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>{userData?.plan || "Starter Plan"}</h4>
                      <p style={{ fontSize: "0.875rem", color: "rgba(248,250,252,0.4)", marginTop: "0.4rem" }}>Next billing cycle: June 12, 2026</p>
                    </div>
                    <button className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontSize: "0.8125rem" }}>
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Right Column: Security & Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <SectionReveal delay={0.3}>
                <div className="glass-card" style={{ padding: "2rem" }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <ShieldCheck size={20} style={{ color: "#60a5fa" }} />
                    Security
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                      { icon: <Zap size={16} />, title: "Two-Factor Auth", status: "Enabled", color: "#34d399" },
                      { icon: <User size={16} />, title: "Active Sessions", status: "3 Devices", color: "rgba(248,250,252,0.4)" }
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ color: "rgba(248,250,252,0.2)" }}>{item.icon}</div>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{item.title}</span>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: item.color }}>{item.status}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-secondary" style={{ width: "100%", marginTop: "2rem", justifyContent: "center", height: "3.5rem" }}>
                    <Settings size={18} />
                    Account Settings
                  </button>
                </div>
              </SectionReveal>
            </div>

          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .profile-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .info-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          }
        `}</style>
      </div>
    </AuthCheck>
  );
}
