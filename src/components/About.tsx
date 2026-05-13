"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe, Cpu } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "High Performance",
    description: "Built on the Cognis Engine for uncompromising speed and efficiency."
  },
  {
    icon: Shield,
    title: "Unified Security",
    description: "Enterprise-grade protection across all our applications."
  },
  {
    icon: Globe,
    title: "Global Sync",
    description: "Your data follows you seamlessly across every device and platform."
  },
  {
    icon: Cpu,
    title: "Native Power",
    description: "True native performance for Windows, Mac, Linux, and Android."
  }
];

const About = () => {
  return (
    <section id="about" className="relative w-full py-32 px-6 overflow-hidden">
      {/* 3D Background Objects */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-600/5 rounded-[4rem] blur-[100px] -z-10" 
      />

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.8]">
              REDESIGNING THE <br />
              <span className="text-gradient">DIGITAL ECOSYSTEM.</span>
            </h2>
            <p className="text-lg text-white/40 font-medium max-w-xl leading-relaxed">
              At Cognis, we don't just build software; we craft experiences. Our mission is to bridge the gap between platforms, 
              creating a unified world where your tools work together in perfect harmony.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {features.map((f, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs">{f.title}</h3>
                  <p className="text-xs text-white/30 font-medium leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
            className="flex-1 relative"
          >
            <div className="glass-card aspect-square rounded-[4rem] p-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent group-hover:opacity-40 transition-opacity" />
               <div className="w-full h-full rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <span className="text-8xl font-black text-white/5 select-none">COGNIS</span>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full scale-150" 
                  />
                  <div className="absolute w-48 h-48 bg-blue-500/20 rounded-full blur-[80px]" />
               </div>
            </div>
            
            {/* Floating Stats */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass px-8 py-6 rounded-3xl shadow-2xl"
            >
              <p className="text-3xl font-black text-gradient">24M+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Active Users</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
