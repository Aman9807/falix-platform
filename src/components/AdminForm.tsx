"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Plus, Upload, Check, Monitor, Laptop, Smartphone, Cpu, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "windows", name: "Windows", icon: Monitor },
  { id: "mac",     name: "macOS",   icon: Laptop },
  { id: "linux",   name: "Linux",   icon: Cpu },
  { id: "android", name: "Android", icon: Smartphone },
];

export default function AdminForm({ editingApp, onCancel }: { editingApp?: any, onCancel?: () => void }) {
  const [title, setTitle] = useState(editingApp?.title || "");
  const [slug, setSlug] = useState(editingApp?.slug || "");
  const [description, setDescription] = useState(editingApp?.description || "");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(editingApp?.logo_url || null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => {
    const p = [];
    if (editingApp?.windows_url) p.push("windows");
    if (editingApp?.mac_url)     p.push("mac");
    if (editingApp?.linux_url)   p.push("linux");
    if (editingApp?.android_url) p.push("android");
    return p;
  });
  const [platformLinks, setPlatformLinks] = useState<Record<string, string>>({
    windows: editingApp?.windows_url || "",
    mac:     editingApp?.mac_url || "",
    linux:   editingApp?.linux_url || "",
    android: editingApp?.android_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogo(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let logoUrl = editingApp?.logo_url || "";
      if (logo) {
        const storageRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
        await uploadBytes(storageRef, logo);
        logoUrl = await getDownloadURL(storageRef);
      }

      const appData = {
        title,
        slug: slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        logo_url: logoUrl,
        windows_url: platformLinks.windows || null,
        mac_url:     platformLinks.mac || null,
        linux_url:   platformLinks.linux || null,
        android_url: platformLinks.android || null,
        updated_at:  serverTimestamp(),
      };

      if (editingApp?.id) {
        await updateDoc(doc(db, "apps", editingApp.id), appData);
      } else {
        await addDoc(collection(db, "apps"), { ...appData, created_at: serverTimestamp() });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) onCancel();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Error saving application.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "1rem", padding: "1rem 1.25rem", color: "#fff", fontSize: "0.875rem", outline: "none",
    transition: "border-color 0.2s"
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* ── Metadata ── */}
      <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Plus size={20} style={{ color: "#60a5fa" }} />
          {editingApp ? "Edit Details" : "App Metadata"}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-grid">
          <div>
            <p className="label" style={{ marginBottom: "0.625rem" }}>App Title</p>
            <input 
              style={inputStyle} value={title} required placeholder="e.g. SchoolOS Desktop"
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingApp) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>
          <div>
            <p className="label" style={{ marginBottom: "0.625rem" }}>Slug / Subdomain</p>
            <input 
              style={{ ...inputStyle, fontFamily: "monospace" }} value={slug} required placeholder="e.g. schoolos"
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
              onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>
        </div>

        <div>
          <p className="label" style={{ marginBottom: "0.625rem" }}>Description</p>
          <textarea 
            style={{ ...inputStyle, minHeight: 120, resize: "none" }} value={description} required
            placeholder="What does this app do?"
            onChange={(e) => setDescription(e.target.value)}
            onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>

        <div>
          <p className="label" style={{ marginBottom: "0.625rem" }}>Logo Artwork</p>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <input type="file" accept="image/*" onChange={handleLogoChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
            <div style={{ ...inputStyle, borderStyle: "dashed", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(248,250,252,0.4)" }}>
                <Upload size={18} />
                <span style={{ fontSize: "0.8125rem" }}>{logo ? logo.name : "Choose PNG or SVG"}</span>
              </div>
              {logoPreview && <img src={logoPreview} style={{ width: 32, height: 32, borderRadius: "0.5rem", objectFit: "cover" }} />}
            </div>
          </div>
        </div>
      </div>

      {/* ── Distribution ── */}
      <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Monitor size={20} style={{ color: "#60a5fa" }} />
          Platform Distribution
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }} className="platforms-grid">
          {platforms.map(({ id, name, icon: Icon }) => {
            const isSelected = selectedPlatforms.includes(id);
            return (
              <button
                key={id} type="button" onClick={() => setSelectedPlatforms(prev => isSelected ? prev.filter(p => p !== id) : [...prev, id])}
                style={{ 
                  padding: "1rem", borderRadius: "1rem", background: isSelected ? "rgba(37,99,235,0.1)" : "rgba(255,255,255,0.02)",
                  border: isSelected ? "1px solid #2563EB" : "1px solid rgba(255,255,255,0.05)",
                  color: isSelected ? "#fff" : "rgba(248,250,252,0.2)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{name}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedPlatforms.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {selectedPlatforms.map(id => (
                <div key={id}>
                  <p className="label" style={{ marginBottom: "0.5rem" }}>{platforms.find(p => p.id === id)?.name} Download URL</p>
                  <input 
                    style={inputStyle} type="url" required value={platformLinks[id] || ""} placeholder="https://github.com/..."
                    onChange={(e) => setPlatformLinks(prev => ({ ...prev, [id]: e.target.value }))}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button 
          type="submit" disabled={loading} className="btn-primary" 
          style={{ flex: 1, height: "4rem", justifyContent: "center", background: success ? "#34d399" : "var(--primary)" }}
        >
          {loading ? "Synchronizing..." : success ? <Check size={24} /> : editingApp ? "Save Changes" : "Publish Application"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary" style={{ padding: "0 2rem" }}>
            Cancel
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .platforms-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </form>
  );
}
