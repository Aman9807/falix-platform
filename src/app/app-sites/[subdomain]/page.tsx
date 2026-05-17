import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, Download, Monitor, Laptop, Cpu, Smartphone, Globe } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import Pricing from "@/components/Pricing";

async function getAppData(slug: string) {
  const appsRef = collection(db, "apps");
  const q = query(appsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  return querySnapshot.docs[0].data();
}

export default async function AppSubdomainPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const appData = await getAppData(subdomain);

  if (!appData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter">404</h1>
          <p className="text-white/40 uppercase tracking-widest font-bold">Application Not Found</p>
          <Link href="https://flynx.site" className="text-blue-500 hover:underline">Back to Flynx</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      
      {/* Dynamic App Hero */}
      <SectionReveal className="relative w-full py-20 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="max-content relative z-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-6xl">
            <div className="mb-12 relative">
              <div 
                className="absolute inset-0 blur-3xl rounded-full opacity-20" 
                style={{ backgroundColor: appData.themeColor || "#3b82f6" }}
              />
              <img 
                src={appData.logo_url} 
                alt={appData.title} 
                className="w-24 h-24 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3rem] object-cover relative z-10 shadow-2xl border border-white/10"
              />
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase mb-12 leading-[0.85]">
              {appData.title}
            </h1>
            
            <p className="text-xl md:text-3xl text-white/40 font-medium mb-16 max-w-3xl leading-relaxed uppercase tracking-tight">
              {appData.description}
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <Link 
                href={`/download`}
                style={{ backgroundColor: appData.themeColor || "#3b82f6" }}
                className="hover:opacity-90 text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center gap-4 group"
              >
                {appData.website_url && !appData.windows_url ? <Globe size={24} /> : <Download size={24} />}
                {appData.website_url && !appData.windows_url ? "Launch Website" : "Get Started Now"}
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
            <div 
                className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse" 
                style={{ backgroundColor: appData.themeColor || "#3b82f6" }}
            />
            <div 
                className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse" 
                style={{ backgroundColor: appData.themeColor || "#3b82f6", animationDelay: '2s' }}
            />
        </div>
      </SectionReveal>

      {/* Features Section (Bento Grid) */}
      <SectionReveal className="w-full py-48 px-6">
        <div className="max-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(appData.features && appData.features.length > 0) ? (
                    appData.features.map((feature: string, i: number) => (
                        <div 
                            key={i} 
                            className={`glass-card p-16 flex flex-col justify-end min-h-[400px] group transition-all hover:bg-white/[0.05] ${i === 0 ? 'lg:col-span-2' : ''}`}
                        >
                            <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter" style={{ color: i === 0 ? (appData.themeColor || "#fff") : "#fff" }}>
                                {feature}
                            </h3>
                            <p className="text-white/40 text-lg font-bold uppercase tracking-tight leading-relaxed max-w-md">Experience the power of {appData.title} with advanced {feature.toLowerCase()} support.</p>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="glass-card lg:col-span-2 p-16 flex flex-col justify-end min-h-[500px]">
                            <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter">Native Performance</h3>
                            <p className="text-white/40 text-xl font-bold uppercase tracking-tight">Optimized for every architecture. Get the best out of your hardware with Flynx's high-speed engine.</p>
                        </div>
                        <div className="glass-card p-16 flex flex-col justify-end min-h-[500px]">
                            <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter">Secure</h3>
                            <p className="text-white/40 text-xl font-bold uppercase tracking-tight">Built with security first. All your data is encrypted and protected.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
      </SectionReveal>

      <SectionReveal className="w-full py-48 px-6 bg-white/[0.01]">
         <div className="max-content text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">Choose Your Plan</h2>
            <p className="text-white/40 mb-12 max-w-xl mx-auto uppercase tracking-widest font-bold">Transparent pricing for every stage of your growth.</p>
            <Link 
                href={`/plan`}
                className="inline-flex px-12 py-6 rounded-2xl border border-white/10 hover:border-white/40 transition-colors uppercase tracking-widest font-black text-xs"
            >
                View Detailed Plans
            </Link>
         </div>
      </SectionReveal>

      {/* CTA Section */}
      <SectionReveal className="w-full py-48 px-6">
        <div className="max-content">
            <div 
                className="glass-card p-24 md:p-32 text-center rounded-[5rem]"
                style={{ borderColor: `${appData.themeColor}33` || "rgba(255,255,255,0.1)" }}
            >
                 <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter uppercase leading-[0.85]">Ready to elevate <br /> your experience?</h2>
                 <Link 
                    href={`/download`}
                    style={{ backgroundColor: appData.themeColor || "#fff", color: appData.themeColor ? "#fff" : "#000" }}
                    className="inline-flex px-16 py-8 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                >
                    {appData.website_url && !appData.windows_url ? `Open ${appData.title}` : `Download ${appData.title}`}
                </Link>
            </div>
        </div>
      </SectionReveal>

      <footer className="w-full py-24 px-6 border-t border-white/5 mt-auto">
        <div className="max-content flex flex-col md:flex-row justify-between items-center gap-12 opacity-20">
            <span className="font-black tracking-tighter text-4xl">FLYNX</span>
            <p className="text-xs font-black uppercase tracking-[0.3em]">© 2026 {appData.title.toUpperCase()}. POWERED BY FLYNX ENGINE.</p>
        </div>
      </footer>
    </main>
  );
}
