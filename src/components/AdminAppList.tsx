"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Edit2, Trash2, ExternalLink, Monitor, Laptop, Smartphone, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface App {
  id: string;
  title: string;
  slug: string;
  logo_url: string;
  description: string;
  windows_url?: string;
  mac_url?: string;
  linux_url?: string;
  android_url?: string;
}

export default function AdminAppList({ onEdit }: { onEdit: (app: App) => void }) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "apps"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as App[];
      
      // Sort client-side so apps without created_at still show up
      appsData.sort((a: any, b: any) => {
        const timeA = a.created_at?.seconds || 0;
        const timeB = b.created_at?.seconds || 0;
        return timeB - timeA;
      });

      console.log(`[Admin] Found ${appsData.length} apps in database.`);
      setApps(appsData);
      setLoading(false);
    }, (error) => {
      console.error("[Admin] Firestore Read Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this application from the ecosystem?")) {
      try {
        await deleteDoc(doc(db, "apps", id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(37,99,235,0.1)", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <AnimatePresence mode="popLayout">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card"
            style={{ padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              {app.logo_url ? (
                <img src={app.logo_url} alt={app.title} style={{ width: 56, height: 56, borderRadius: "1rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: "1rem", background: "linear-gradient(135deg, #2563EB, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                  {app.title?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{app.title}</h3>
                <p className="label" style={{ marginTop: "0.25rem", color: "#60a5fa" }}>{app.slug}.falix.in</p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
                  {app.windows_url && <Monitor size={12} style={{ color: "rgba(248,250,252,0.2)" }} />}
                  {app.mac_url     && <Laptop size={12} style={{ color: "rgba(248,250,252,0.2)" }} />}
                  {app.linux_url   && <Cpu size={12} style={{ color: "rgba(248,250,252,0.2)" }} />}
                  {app.android_url && <Smartphone size={12} style={{ color: "rgba(248,250,252,0.2)" }} />}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a 
                href={`http://${app.slug}.localhost:3000`} target="_blank" 
                style={{ width: 42, height: 42, borderRadius: "0.875rem", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(248,250,252,0.3)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(248,250,252,0.3)"}
              >
                <ExternalLink size={18} />
              </a>
              <button 
                onClick={() => onEdit(app)}
                style={{ width: 42, height: 42, borderRadius: "0.875rem", background: "rgba(37,99,235,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,99,235,0.1)"; e.currentTarget.style.color = "#60a5fa"; }}
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(app.id)}
                style={{ width: 42, height: 42, borderRadius: "0.875rem", background: "rgba(248,113,113,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.color = "#f87171"; }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {apps.length === 0 && (
        <div className="glass-card" style={{ padding: "4rem", textAlign: "center", opacity: 0.3 }}>
          <p className="label">No applications found in catalog</p>
        </div>
      )}
    </div>
  );
}
