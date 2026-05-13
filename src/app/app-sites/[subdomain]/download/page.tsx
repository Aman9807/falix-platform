import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Monitor, Laptop, Cpu, Smartphone, ArrowLeft, Download, ChevronRight } from "lucide-react";

async function getAppData(slug: string) {
  const appsRef = collection(db, "apps");
  const q = query(appsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  return querySnapshot.docs[0].data();
}

export default async function DownloadPage({ params }: { params: { subdomain: string } }) {
  const appData = await getAppData(params.subdomain);

  if (!appData) {
    return null; // Should be handled by layout or middleware but safety first
  }

  const platforms = [
    { id: "windows", name: "Windows", icon: Monitor, url: appData.windows_url },
    { id: "mac", name: "macOS", icon: Laptop, url: appData.mac_url },
    { id: "linux", name: "Linux", icon: Cpu, url: appData.linux_url },
    { id: "android", name: "Android", icon: Smartphone, url: appData.android_url },
  ];

  const availablePlatforms = platforms.filter(p => p.url);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#030303] text-white">
      <Navbar />
      
      <section className="w-full pt-48 pb-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px] mb-12"
          >
            <ArrowLeft size={14} />
            Back to App
          </Link>
          
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
             <img 
                src={appData.logo_url} 
                alt={appData.title} 
                className="w-32 h-32 rounded-3xl object-cover shadow-2xl border border-white/10"
              />
              <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
                    Download <span className="text-gradient">{appData.title}</span>
                  </h1>
                  <p className="text-white/40 font-medium max-w-lg">
                    Select your platform below to get the latest version of {appData.title}. 
                    All downloads are verified and secure.
                  </p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availablePlatforms.length > 0 ? (
              availablePlatforms.map((platform) => (
                <a 
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                       <platform.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest mb-1">{platform.name}</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Latest Release v1.0.4</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                    <Download size={18} />
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-full glass-card p-20 text-center">
                 <p className="text-white/20 font-black uppercase tracking-widest">No downloads available for this app yet.</p>
              </div>
            )}
          </div>

          {/* Additional Info Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
             <div className="glass-card p-8 space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs text-blue-400">Security</h4>
                <p className="text-xs text-white/40 leading-relaxed font-medium">All binaries are signed with Cognis's official certificate and scanned for vulnerabilities.</p>
             </div>
             <div className="glass-card p-8 space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs text-blue-400">Updates</h4>
                <p className="text-xs text-white/40 leading-relaxed font-medium">Built-in OTA engine ensures you're always running the latest version with zero downtime.</p>
             </div>
             <div className="glass-card p-8 space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs text-blue-400">Support</h4>
                <p className="text-xs text-white/40 leading-relaxed font-medium">Need help? Join our community or contact support at help@cognis.in.</p>
             </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-20 px-6 border-t border-white/5 mt-auto">
        <div className="container mx-auto flex justify-between items-center opacity-40">
            <span className="font-black tracking-tighter text-2xl">COGNIS</span>
            <p className="text-xs font-bold uppercase tracking-widest">© 2026 COGNIS PLATFORM.</p>
        </div>
      </footer>
    </main>
  );
}
