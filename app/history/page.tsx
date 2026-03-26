"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HistoryTable } from "@/components/history-table";
import { TrendingUp, Sparkles, Sprout } from "lucide-react";
import Image from "next/image";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="pb-20">
        
        {/* Banner Section */}
        <div className="relative h-64 w-full overflow-hidden bg-[#2A3630]">
          <Image 
            src="https://images.unsplash.com/photo-1628359355624-c55bc783feed?auto=format&fit=crop&q=80&sat=-50" 
            alt="Farm view" fill className="object-cover opacity-60 mix-blend-overlay" unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-10 max-w-6xl mx-auto flex items-end">
            <div className="w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-main)] tracking-tight mb-4 drop-shadow-sm">
                Harvest Prediction <span className="italic text-[var(--color-primary-900)]">Archive</span>
              </h1>
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg inline-block shadow-sm border border-white max-w-lg mb-[-20px] relative z-10">
                <p className="text-sm text-[var(--color-text-muted)] font-medium leading-relaxed">
                  Review historical yield data across your Punjab and Haryana holdings to optimize the next Rabi season.
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-10 pt-16 mt-4">
          <HistoryTable />

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 mt-12">
            
            {/* Accuracy Rating Box */}
            <div className="bg-[#F5F8F7] border border-[#E9F0EC] p-8 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Regional Accuracy Rating</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm">
                  Our models currently show a 94.2% correlation between prediction and harvest for the Northern Indian Plains.
                </p>
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-[var(--color-primary-900)] tracking-tight mb-1">94.2%</p>
                  <p className="text-[9px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase">NORTH INDIA AVERAGE</p>
                </div>
                <div className="flex gap-1 h-12 items-end">
                  <div className="w-8 h-4 bg-[var(--color-primary-900)]/20 rounded-sm" />
                  <div className="w-8 h-6 bg-[var(--color-primary-900)]/30 rounded-sm" />
                  <div className="w-8 h-7 bg-[var(--color-primary-900)]/40 rounded-sm" />
                  <div className="w-8 h-9 bg-[var(--color-primary-900)]/60 rounded-sm" />
                  <div className="w-8 h-12 bg-[var(--color-primary-900)] rounded-sm" />
                </div>
              </div>
            </div>

            {/* Soil Health Analysis Action */}
            <div className="bg-[#FBF8EF] border border-[#F2ECE1] p-8 rounded-xl shadow-sm flex flex-col">
              <Sparkles className="w-6 h-6 text-[#8F7D65] mb-6" />
              <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Soil Health Analysis</h3>
              <p className="text-sm text-[#8F7D65] leading-relaxed mb-8">
                Update your NPK levels for the upcoming Rabi wheat crop to increase prediction accuracy by up to 4%.
              </p>
              <button className="text-[10px] font-bold text-[#8F7D65] tracking-widest uppercase flex items-center gap-2 mt-auto group">
                UPDATE SOIL DATA <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </AppShell>
  );
}
