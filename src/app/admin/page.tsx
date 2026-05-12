"use client";

import { useState } from "react";
import AuthCheck from "@/components/AuthCheck";
import AdminForm from "@/components/AdminForm";
import AdminAppList from "@/components/AdminAppList";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, ExternalLink, Settings, Database, Plus } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "form">("list");
  const [editingApp, setEditingApp] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "storage" | "settings">("catalog");

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
    <AuthCheck>
      <main className="min-h-screen bg-[#030303] text-white">
        {/* Sidebar / Sidebar Navigation (Glassmorphism) */}
        <div className="fixed top-0 left-0 h-full w-20 md:w-64 glass border-r-0 z-50 hidden sm:flex flex-col">
          <div className="p-8">
             <Link href="/" className="text-2xl font-black tracking-tighter text-gradient">FALIX</Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-8">
            <button 
              onClick={() => setActiveTab("catalog")}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                activeTab === "catalog" ? "bg-white/5 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5" : "text-white/30 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="hidden md:block text-xs font-black uppercase tracking-widest">Catalog</span>
            </button>
            <button 
              onClick={() => setActiveTab("storage")}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                activeTab === "storage" ? "bg-white/5 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5" : "text-white/30 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Database size={20} />
              <span className="hidden md:block text-xs font-black uppercase tracking-widest">Storage</span>
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                activeTab === "settings" ? "bg-white/5 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5" : "text-white/30 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings size={20} />
              <span className="hidden md:block text-xs font-black uppercase tracking-widest">Settings</span>
            </button>
          </nav>

          <div className="p-4 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400/50 hover:bg-red-400/10 hover:text-red-400 transition-all"
            >
              <LogOut size={20} />
              <span className="hidden md:block text-xs font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="sm:ml-20 md:ml-64 p-6 md:p-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Platform <span className="text-gradient">Manager</span></h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Authorized System Session: {auth.currentUser?.email}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              {view === "list" ? (
                <button 
                  onClick={startAdding}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all"
                >
                  <Plus size={14} />
                  Add New App
                </button>
              ) : (
                <button 
                  onClick={() => setView("list")}
                  className="glass px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                  Back to List
                </button>
              )}
              <Link 
                href="/" 
                target="_blank"
                className="glass px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                View Live Site
                <ExternalLink size={14} />
              </Link>
            </motion.div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl"
          >
            <AnimatePresence mode="wait">
              {view === "list" ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AdminAppList onEdit={startEditing} />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AdminForm 
                    editingApp={editingApp} 
                    onCancel={() => setView("list")} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[160px] -z-10 pointer-events-none" />
      </main>
    </AuthCheck>
  );
}
