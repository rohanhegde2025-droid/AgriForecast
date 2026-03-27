"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HistoryTable } from "@/components/history-table";
import { TrendingUp, Sparkles, Sprout } from "lucide-react";
import Image from "next/image";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* Banner Section */}
        <div className="relative h-64 w-full overflow-hidden bg-[var(--color-primary-900)] border-b border-[var(--color-gold)]/20 shadow-md">
          <Image 
            src="/images/dashboard_overview.png" 
            alt="Farm view" fill className="object-cover opacity-20 mix-blend-plus-lighter" unoptimized={false} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-10 max-w-6xl mx-auto flex items-end">
            <div className="w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-[#E8F0E4] tracking-tight mb-6 drop-shadow-sm">
                Harvest Prediction <span className="italic text-[var(--color-gold)]">Archive</span>
              </h1>
              <div className="bg-[var(--color-primary-800)]/80 backdrop-blur-md p-5 rounded-lg inline-block shadow-lg border border-[var(--color-gold)]/20 max-w-xl mb-[-24px] relative z-10">
                <p className="text-sm text-[#CBD5C9] font-medium leading-relaxed tracking-wide">
                  Review historical yield data across your agricultural holdings to optimize the next season and track AI model accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-10 pt-20 mt-4">
          <HistoryTable />

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 mt-16">
            
            {/* Accuracy Rating Box */}
            <div className="glass-dark border border-[var(--color-gold)]/20 p-8 rounded-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[#E8F0E4] mb-3 flex items-center gap-3">
                  <TrendingUp className="text-[var(--color-gold)] w-5 h-5" /> Regional Accuracy Rating
                </h3>
                <p className="text-sm text-[#CBD5C9] leading-relaxed max-w-sm">
                  Our models currently show a 94.2% correlation between prediction and harvest for the Northern Indian Plains.
                </p>
              </div>
              <div className="mt-8 flex items-end justify-between relative z-10">
                <div>
                  <p className="text-5xl font-black text-[#E8F0E4] tracking-tighter mb-1 drop-shadow-md">94.2<span className="text-3xl text-[var(--color-gold)]">%</span></p>
                  <p className="text-[10px] font-bold text-[var(--color-gold)] tracking-widest uppercase opacity-80">NORTH INDIA AVERAGE</p>
                </div>
                <div className="flex gap-2 h-16 items-end group-hover:gap-3 transition-all duration-500">
                  <div className="w-8 h-4 bg-[var(--color-primary-800)] border border-[var(--color-gold)]/20 rounded-t-sm shadow-sm" />
                  <div className="w-8 h-6 bg-[var(--color-primary-800)] border border-[var(--color-gold)]/30 rounded-t-sm shadow-sm" />
                  <div className="w-8 h-8 bg-[var(--color-primary-800)] border border-[var(--color-gold)]/40 rounded-t-sm shadow-sm" />
                  <div className="w-8 h-11 bg-[var(--color-primary-800)] border border-[var(--color-gold)]/60 rounded-t-sm shadow-md" />
                  <div className="w-8 h-16 bg-[var(--color-gold)] shadow-[0_0_15px_rgba(212,160,23,0.3)] rounded-t-sm" />
                </div>
              </div>
            </div>

            {/* Soil Health Analysis Action */}
            <div className="bg-[var(--color-primary-800)] border border-[var(--color-gold)]/30 p-8 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden group hover:border-[var(--color-gold)]/60 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles className="w-6 h-6 text-[var(--color-gold)] mb-6 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
              <h3 className="text-lg font-bold text-[#E8F0E4] mb-3 relative z-10 tracking-wide">Soil Health Analysis</h3>
              <p className="text-sm text-[#CBD5C9] leading-relaxed mb-8 relative z-10 font-medium">
                Update your NPK levels for the upcoming Rabi crop to increase prediction accuracy by up to 4%.
              </p>
              <button className="text-[10px] font-bold text-[var(--color-gold)] tracking-widest uppercase flex items-center gap-2 mt-auto group/btn relative z-10 py-2 border-b border-transparent hover:border-[var(--color-gold)] w-max transition-colors">
                UPDATE SOIL DATA <span className="text-lg group-hover/btn:translate-x-1.5 transition-transform">→</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </AppShell>
  );
}
