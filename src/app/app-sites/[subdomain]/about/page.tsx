import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

async function getAppData(slug: string) {
  const appsRef = collection(db, "apps");
  const q = query(appsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  return querySnapshot.docs[0].data();
}

export default async function AboutAppPage({ params }: { params: { subdomain: string } }) {
  const appData = await getAppData(params.subdomain);

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
    <main className="flex min-h-screen flex-col items-center bg-[#030303] text-white">
      <div className="w-full max-w-4xl px-6 py-12 flex items-center justify-between z-10 relative">
        <Link 
            href={`/`} 
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
        >
            <ArrowLeft size={16} /> Back to App
        </Link>
        <Link 
            href="https://flynx.site" 
            className="text-white/30 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black"
        >
            Powered by Flynx
        </Link>
      </div>

      <SectionReveal className="w-full max-w-4xl px-6 pb-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="shrink-0 relative">
                <div 
                    className="absolute inset-0 blur-2xl rounded-[2rem] opacity-30" 
                    style={{ backgroundColor: appData.themeColor || "#3b82f6" }}
                />
                <img 
                    src={appData.logo_url} 
                    alt={appData.title} 
                    className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] object-cover relative z-10 shadow-2xl border border-white/10"
                />
            </div>
            
            <div className="flex-1">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">
                    {appData.title}
                </h1>
                
                <div className="flex flex-wrap gap-3 mb-8">
                    {appData.platforms?.map((plat: string) => (
                        <span key={plat} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest font-bold text-white/60">
                            {plat}
                        </span>
                    ))}
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest font-bold text-white/60">
                        v{appData.version || "1.0.0"}
                    </span>
                </div>

                <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-white/60 prose-headings:uppercase prose-headings:tracking-tighter">
                    <p className="whitespace-pre-wrap">{appData.description}</p>
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                    {appData.website_url && (
                        <Link 
                            href={appData.website_url}
                            target="_blank"
                            style={{ backgroundColor: appData.themeColor || "#fff", color: appData.themeColor ? "#fff" : "#000" }}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                        >
                            <ExternalLink size={18} /> Open Website
                        </Link>
                    )}
                    <Link 
                        href={`/download`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                        <Download size={18} /> Downloads
                    </Link>
                </div>
            </div>
        </div>

        {appData.features && appData.features.length > 0 && (
            <div className="mt-24">
                <h2 className="text-2xl font-black tracking-tighter uppercase mb-8 border-b border-white/10 pb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {appData.features.map((feature: string, i: number) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-lg uppercase tracking-tight mb-2 text-white/90">{feature}</h3>
                            <p className="text-white/40 text-sm">Experience the power of {appData.title} with advanced {feature.toLowerCase()} capabilities.</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </SectionReveal>

      {/* Animated Background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div 
              className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse" 
              style={{ backgroundColor: appData.themeColor || "#3b82f6" }}
          />
      </div>
    </main>
  );
}
