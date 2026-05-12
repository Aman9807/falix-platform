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
    const q = query(collection(db, "apps"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as App[];
      setApps(appsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this app?")) {
      try {
        await deleteDoc(doc(db, "apps", id));
      } catch (error) {
        console.error("Error deleting app: ", error);
        alert("Failed to delete app.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {apps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-6">
              <img src={app.logo_url} alt={app.title} className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/10" />
              <div>
                <h3 className="text-xl font-black uppercase tracking-widest">{app.title}</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{app.slug}.falix.in</p>
                <div className="flex gap-2 mt-2">
                    {app.windows_url && <Monitor size={12} className="text-blue-400" />}
                    {app.mac_url && <Laptop size={12} className="text-indigo-400" />}
                    {app.linux_url && <Cpu size={12} className="text-purple-400" />}
                    {app.android_url && <Smartphone size={12} className="text-green-400" />}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href={`http://${app.slug}.localhost:3000`} 
                target="_blank" 
                className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
              >
                <ExternalLink size={18} />
              </a>
              <button 
                onClick={() => onEdit(app)}
                className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(app.id)}
                className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {apps.length === 0 && (
        <div className="glass-card p-20 text-center opacity-40">
           <p className="font-black uppercase tracking-widest text-xs">No applications published yet.</p>
        </div>
      )}
    </div>
  );
}
