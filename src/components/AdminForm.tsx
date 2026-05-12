"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Plus, Upload, Check, Monitor, Laptop, Smartphone, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "windows", name: "Windows", icon: Monitor },
  { id: "mac", name: "macOS", icon: Laptop },
  { id: "linux", name: "Linux", icon: Cpu },
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
    if (editingApp?.mac_url) p.push("mac");
    if (editingApp?.linux_url) p.push("linux");
    if (editingApp?.android_url) p.push("android");
    return p;
  });
  const [platformLinks, setPlatformLinks] = useState<Record<string, string>>({
    windows: editingApp?.windows_url || "",
    mac: editingApp?.mac_url || "",
    linux: editingApp?.linux_url || "",
    android: editingApp?.android_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [themeColor, setThemeColor] = useState(editingApp?.themeColor || "#3b82f6");
  const [features, setFeatures] = useState<string[]>(editingApp?.features || ["", "", ""]);
  const [plans, setPlans] = useState<any[]>(editingApp?.plans || [
    { name: "Starter", price: 0 },
    { name: "Pro", price: 12 }
  ]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleLinkChange = (id: string, value: string) => {
    setPlatformLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = "";
      if (logo) {
        const storageRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
        await uploadBytes(storageRef, logo);
        logoUrl = await getDownloadURL(storageRef);
      }

      const appData = {
        title,
        slug: slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        logo_url: logoUrl || editingApp?.logo_url || "",
        windows_url: platformLinks.windows || null,
        mac_url: platformLinks.mac || null,
        linux_url: platformLinks.linux || null,
        android_url: platformLinks.android || null,
        themeColor,
        features: features.filter(f => f.trim() !== ""),
        plans,
        updated_at: serverTimestamp(),
      };

      if (editingApp?.id) {
        await updateDoc(doc(db, "apps", editingApp.id), appData);
      } else {
        await addDoc(collection(db, "apps"), {
          ...appData,
          created_at: serverTimestamp(),
        });
      }

      setSuccess(true);
      if (onCancel) onCancel();
      // Reset form
      setTitle("");
      setSlug("");
      setDescription("");
      setLogo(null);
      setLogoPreview(null);
      setSelectedPlatforms([]);
      setPlatformLinks({});
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding app: ", error);
      alert("Failed to add app. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="glass-card space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="text-blue-400" />
            {editingApp ? "Edit Application" : "App Metadata"}
          </div>
          {onCancel && (
            <button type="button" onClick={onCancel} className="text-[10px] text-white/30 hover:text-white uppercase tracking-[0.2em] transition-all">
                Cancel
            </button>
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">App Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Auto-generate slug if it's empty or matching previous title-slug
                if (!slug || slug === title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")) {
                   setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="e.g. SchoolOS Desktop"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Subdomain Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-mono"
              placeholder="e.g. schoolos"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Logo Artwork</label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full bg-white/5 border border-dashed border-white/10 rounded-2xl py-3 px-4 flex items-center justify-between group-hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <Upload size={16} className="text-white/40" />
                  <span className="text-xs text-white/60 font-medium">{logo ? logo.name : "Select PNG/SVG"}</span>
                </div>
                {logoPreview && (
                  <img src={logoPreview} alt="Preview" className="w-8 h-8 rounded-lg object-cover" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Brand Accent Color</label>
            <div className="flex gap-4">
                <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1 cursor-pointer"
                />
                <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-all uppercase"
                />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all min-h-[100px]"
            placeholder="Describe the application features and capabilities..."
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Key Features (Max 4)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
                <input
                    key={i}
                    type="text"
                    value={feature}
                    onChange={(e) => {
                        const newFeatures = [...features];
                        newFeatures[i] = e.target.value;
                        setFeatures(newFeatures);
                    }}
                    className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder={`Feature ${i + 1}`}
                />
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card space-y-8">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
          <Monitor className="text-blue-400" />
          Platform Distribution
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((p) => {
            const isSelected = selectedPlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-3 ${
                  isSelected 
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400" 
                    : "bg-white/5 border-white/5 text-white/20 hover:border-white/10"
                }`}
              >
                <p.icon size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedPlatforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
            >
              {selectedPlatforms.map((id) => (
                <div key={id} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                    {platforms.find(p => p.id === id)?.name} GitHub URL
                  </label>
                  <input
                    type="url"
                    value={platformLinks[id] || ""}
                    onChange={(e) => handleLinkChange(id, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="https://github.com/falix/repo/releases/..."
                    required
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-6 rounded-3xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
          success 
            ? "bg-green-500 text-white" 
            : "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20"
        } disabled:opacity-50`}
      >
        {loading ? (
          "Synchronizing Database..."
        ) : success ? (
          <>
            <Check size={24} />
            {editingApp ? "Changes Saved" : "App Published"}
          </>
        ) : (
          editingApp ? "Update Application" : "Publish Application"
        )}
      </button>
    </form>
  );
}
