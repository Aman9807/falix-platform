import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, Check, Zap } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

async function getAppData(slug: string) {
  const appsRef = collection(db, "apps");
  const q = query(appsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : querySnapshot.docs[0].data();
}

export default async function AppPlanPage({ params }: { params: { subdomain: string } }) {
  const appData = await getAppData(params.subdomain);

  if (!appData) return <div>App not found</div>;

  const plans = appData.plans || [
    { name: "Free", price: "0", features: ["Basic Access"] }
  ];

  return (
    <main className="min-h-screen bg-[#050508] text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <SectionReveal className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
            Pricing <span className="text-blue-500">Plans.</span>
          </h1>
          <p className="text-xl text-white/40 font-medium max-w-2xl">
            Choose the perfect plan for your {appData.title} experience. Scale as you grow.
          </p>
        </SectionReveal>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan: any, i: number) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="glass-card p-10 flex flex-col h-full relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                <div className="mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">${plan.price}</span>
                    <span className="text-white/20 text-sm font-bold uppercase tracking-widest">/ Month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-center gap-3 text-white/60 font-medium">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-blue-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                  Select {plan.name}
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>

      </div>
    </main>
  );
}
