"use client";

import AuthCheck from "@/components/AuthCheck";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, ShieldCheck, Zap, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Default data if doc doesn't exist yet
          setUserData({
            subscriptionStatus: "active", // Default for demo
            plan: "Free",
            joinedDate: new Date().toLocaleDateString(),
          });
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
      <main className="min-h-screen bg-[#030303] text-white">
        <Navbar />
        
        <div className="container mx-auto pt-48 px-6 pb-32">
          <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
              <div className="flex items-center gap-8 text-center md:text-left">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-black">
                  {auth.currentUser?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Member Profile</h1>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{auth.currentUser?.email}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="glass px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center gap-2"
              >
                <LogOut size={14} />
                Terminate Session
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Subscription Status Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                    <CreditCard size={20} className="text-blue-400" />
                    Subscription
                  </h2>
                  <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${userData?.subscriptionStatus === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {userData?.subscriptionStatus || "Inactive"}
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Plan</span>
                    <span className="text-sm font-black uppercase tracking-widest text-blue-400">{userData?.plan || "Standard"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Member Since</span>
                    <span className="text-sm font-bold text-white/60">{userData?.joinedDate || "May 2026"}</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">
                  Upgrade Plan
                </button>
              </motion.div>

              {/* Account Security Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-10 space-y-8"
              >
                <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <ShieldCheck size={20} className="text-indigo-400" />
                  Security
                </h2>

                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Two-Factor Auth</h4>
                      <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Enabled via Authenticator</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Device Authorization</h4>
                      <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">3 Active Sessions</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Manage Settings
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[160px]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[160px]" />
        </div>
      </main>
    </AuthCheck>
  );
}
