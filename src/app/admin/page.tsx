"use client";

import { useState } from "react";
import AuthCheck from "@/components/AuthCheck";
import AdminForm from "@/components/AdminForm";
import AdminAppList from "@/components/AdminAppList";
import SectionReveal from "@/components/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, ExternalLink, Plus, Package } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "form">("list");
  const [editingApp, setEditingApp] = useState<any>(null);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const startEditing = (app: any) => {
    setEditingApp(app);
    setView("form");
  };

  const startAdding = () => {
    setEditingApp(null);
    setView("form");
  };

  return (
    <AuthCheck requireAdmin>
      <div style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div className="container-xl">
          
          {/* Admin Header */}
          <SectionReveal style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <p className="label" style={{ marginBottom: "0.5rem" }}>Administrator</p>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
                  Platform <span className="text-gradient">Manager.</span>
                </h1>
                <p style={{ 
                  fontSize: "0.875rem", color: "rgba(248,250,252,0.4)", marginTop: "0.5rem",
                  maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" 
                }}>
                  Logged in as: {auth.currentUser?.email}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link href="/" target="_blank" className="btn-secondary" style={{ padding: "0.75rem 1.25rem" }}>
                  <ExternalLink size={14} /> Live Site
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="btn-secondary" 
                  style={{ padding: "0.75rem 1.25rem", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </SectionReveal>

          {/* Main Dashboard Area */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            
            {/* View Toggle / Actions */}
            <SectionReveal delay={0.1}>
              <div className="glass-card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "1.25rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    onClick={() => setView("list")}
                    style={{ 
                      padding: "0.6rem 1.25rem", borderRadius: "0.875rem", fontSize: "0.75rem", fontWeight: 700,
                      background: view === "list" ? "rgba(255,255,255,0.08)" : "transparent",
                      color: view === "list" ? "#fff" : "rgba(248,250,252,0.4)",
                      border: "none", cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    <Package size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                    App Catalog
                  </button>
                </div>

                {view === "list" && (
                  <button onClick={startAdding} className="btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem" }}>
                    <Plus size={14} /> Add New App
                  </button>
                )}
                {view === "form" && (
                  <button onClick={() => setView("list")} className="btn-secondary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem" }}>
                    Back to Catalog
                  </button>
                )}
              </div>
            </SectionReveal>

            {/* Content Slot */}
            <SectionReveal delay={0.2}>
              <div style={{ minHeight: "400px" }}>
                <AnimatePresence mode="wait">
                  {view === "list" ? (
                    <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                      <AdminAppList onEdit={startEditing} />
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                      <AdminForm editingApp={editingApp} onCancel={() => setView("list")} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>

          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
