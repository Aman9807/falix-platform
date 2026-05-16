"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Upload, Check, Monitor, Laptop, Smartphone, Cpu, Save, X, CreditCard, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "windows", name: "Windows", icon: Monitor },
  { id: "mac",     name: "macOS",   icon: Laptop },
  { id: "linux",   name: "Linux",   icon: Cpu },
  { id: "android", name: "Android", icon: Smartphone },
  { id: "website", name: "Website", icon: Globe },
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
    if (editingApp?.website_url) p.push("website");
    return p;
  });
  const [platformLinks, setPlatformLinks] = useState<Record<string, string>>({
    windows: editingApp?.windows_url || "",
    mac:     editingApp?.mac_url || "",
    linux:   editingApp?.linux_url || "",
    android: editingApp?.android_url || "",
    website: editingApp?.website_url || "",
  });
  const [plans, setPlans] = useState<any[]>(editingApp?.plans || [
    { name: "Starter", price: "0", features: ["Basic Support", "Limited Storage"] }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 800 * 1024) {
        alert("Logo artwork size must be less than 800KB. Please compress the image or use a smaller PNG/SVG.");
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlan = () => setPlans([...plans, { name: "", price: "", features: [""] }]);
  const removePlan = (idx: number) => setPlans(plans.filter((_, i) => i !== idx));
  const updatePlan = (idx: number, field: string, val: any) => {
    const newPlans = [...plans];
    newPlans[idx][field] = val;
    setPlans(newPlans);
  };

  const addFeature = (planIdx: number) => {
    const newPlans = [...plans];
    newPlans[planIdx].features.push("");
    setPlans(newPlans);
  };

  const updateFeature = (planIdx: number, featureIdx: number, val: string) => {
    const newPlans = [...plans];
    newPlans[planIdx].features[featureIdx] = val;
    setPlans(newPlans);
  };

  const removeFeature = (planIdx: number, featureIdx: number) => {
    const newPlans = [...plans];
    newPlans[planIdx].features = newPlans[planIdx].features.filter((_: any, i: number) => i !== featureIdx);
    setPlans(newPlans);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let logoUrl = editingApp?.logo_url || "";
      if (logo && logoPreview) {
        console.log("[Admin] Storing logo as Base64 in Firestore...");
        logoUrl = logoPreview;
      }

      // Sanitize plans: remove empty features
      const sanitizedPlans = plans.map(p => ({
        ...p,
        features: p.features.filter((f: string) => f.trim() !== "")
      }));

      const appData = {
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: description.trim(),
        logo_url: logoUrl,
        windows_url: platformLinks.windows || null,
        mac_url:     platformLinks.mac || null,
        linux_url:   platformLinks.linux || null,
        android_url: platformLinks.android || null,
        website_url: platformLinks.website || null,
        plans: sanitizedPlans,
        updated_at:  serverTimestamp(),
      };

      console.log("[Admin] Submitting App Data:", appData);

      if (editingApp?.id) {
        await updateDoc(doc(db, "apps", editingApp.id), appData);
        console.log("[Admin] Successfully updated app.");
      } else {
        const docRef = await addDoc(collection(db, "apps"), { ...appData, created_at: serverTimestamp() });
        console.log("[Admin] Successfully added new app with ID:", docRef.id);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) onCancel();
      }, 1500);
    } catch (error: any) {
      console.error("[Admin] Firebase Error:", error);
      alert(`Error saving application: ${error.message || "Unknown error"}`);
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }} className="platforms-grid">
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

      {/* ── Pricing Plans ── */}
      <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <CreditCard size={20} style={{ color: "#60a5fa" }} />
            Subscription Plans
          </h3>
          <button type="button" onClick={addPlan} className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}>
            <Plus size={14} /> Add Plan
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {plans.map((plan, pIdx) => (
            <motion.div key={pIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1.25rem", position: "relative" }}>
              <button type="button" onClick={() => removePlan(pIdx)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "rgba(248,113,113,0.5)", cursor: "pointer" }}><X size={16} /></button>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p className="label" style={{ marginBottom: "0.4rem", fontSize: "0.65rem" }}>Plan Name</p>
                  <input style={inputStyle} value={plan.name} placeholder="Starter" onChange={(e) => updatePlan(pIdx, "name", e.target.value)} />
                </div>
                <div>
                  <p className="label" style={{ marginBottom: "0.4rem", fontSize: "0.65rem" }}>Price ($)</p>
                  <input style={inputStyle} value={plan.price} placeholder="0" onChange={(e) => updatePlan(pIdx, "price", e.target.value)} />
                </div>
              </div>

              <div>
                <p className="label" style={{ marginBottom: "0.75rem", fontSize: "0.65rem" }}>Features</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {plan.features.map((feat: string, fIdx: number) => (
                    <div key={fIdx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={{ ...inputStyle, padding: "0.6rem 1rem" }} value={feat} placeholder="Feature detail..." onChange={(e) => updateFeature(pIdx, fIdx, e.target.value)} />
                      <button type="button" onClick={() => removeFeature(pIdx, fIdx)} style={{ padding: "0.5rem", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: "0.75rem", color: "#f87171" }}><X size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addFeature(pIdx)} style={{ alignSelf: "flex-start", marginTop: "0.5rem", fontSize: "0.7rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Feature</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
