"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HomeSpeedTestProps {
  dict: {
    badge: string;
    title: string;
    desc: string;
    btn: string;
    metrics: {
      mbps: string;
      ping: string;
      upload: string;
    };
  };
  locale: string;
}

export function HomeSpeedTest({ dict, locale }: HomeSpeedTestProps) {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
      
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" />
              {dict.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {dict.title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              {dict.desc}
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href={`/${locale}/dashboard/speedtest`}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-blue-600/20">
                  {dict.btn} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="w-full max-w-md aspect-square rounded-[3rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center relative mb-8">
                 <div className="absolute inset-0 border-8 border-blue-600/20 rounded-full"></div>
                 <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                 <Gauge className="w-20 h-20 text-blue-500" />
              </div>
              
              <div className="text-center">
                 <div className="text-5xl font-black tracking-tighter mb-1">0.00</div>
                 <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{dict.metrics.mbps}</div>
              </div>
              
              <div className="mt-8 flex gap-6">
                 <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">{dict.metrics.ping}</div>
                    <div className="text-lg font-bold">-- ms</div>
                 </div>
                 <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">{dict.metrics.upload}</div>
                    <div className="text-lg font-bold">-- Mbps</div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
