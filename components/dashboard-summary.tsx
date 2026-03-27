"use client";

import Link from "next/link";
import Image from "next/image";
import { Activity, Clock, Settings, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase";
import { getHistory } from "@/lib/api";

export function DashboardSummary() {
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await getHistory();
        setHistoryCount(data.length);
      } else {
        setHistoryCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const navCards = [
    {
      title: "New Prediction",
      description: "Enter farm details and generate a yield and price forecast using our ML models.",
      href: "/predict",
      icon: Activity,
      cta: "Start Prediction →",
    },
    {
      title: "Prediction History",
      description: "Review past predictions and track crop output accuracy over time.",
      href: "/history",
      icon: Clock,
      cta: `View ${historyCount} Records →`,
    },
    {
      title: "Settings",
      description: "Manage your profile, platform preferences, and notification settings.",
      href: "/settings",
      icon: Settings,
      cta: "Manage →",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Welcome Banner */}
      <div className="glass-dark rounded-xl overflow-hidden relative shadow-lg min-h-[160px] flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/dashboard_overview.png" 
            alt="Farm Overview" 
            fill 
            className="object-cover opacity-[0.25] mix-blend-plus-lighter" 
          />
          {/* Enhanced Green Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-900)] via-[var(--color-primary-900)]/80 to-[var(--color-primary-900)]/20" />
        </div>
        
        <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-6 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="w-14 h-14 rounded-[12px] bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/40 flex items-center justify-center text-[var(--color-gold)] shadow-[0_0_20px_rgba(212,160,23,0.15)] flex-shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#E8F0E4] tracking-tight">
                Welcome to AgriForecast
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-gold)] mt-1.5 font-bold tracking-widest uppercase">
                Data-driven decisions for every harvest season
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {navCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`group glass-dark rounded-xl p-7 shadow-sm hover:shadow-xl hover:shadow-[var(--color-gold)]/5 border-transparent hover:border-[var(--color-gold)]/30 hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden stagger-${index + 1}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Subtle gold glow inside card on hover */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-gold)]/0 rounded-full blur-3xl group-hover:bg-[var(--color-gold)]/10 transition-colors duration-700" />

              <div className="w-12 h-12 rounded-[10px] bg-[var(--color-primary-800)] border border-[var(--color-gold)]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-md">
                <Icon className="w-6 h-6 text-[var(--color-gold)]" />
              </div>
              
              <h3 className="text-xl font-bold text-[#E8F0E4] mb-3 tracking-tight">
                {card.title}
              </h3>
              <p className="text-[14px] text-[#CBD5C9] leading-relaxed mb-8 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {card.description}
              </p>
              
              <div className="flex items-center pt-5 border-t border-[var(--color-text-muted)]/10 mt-auto">
                <span className="text-xs font-bold text-[var(--color-gold)] uppercase tracking-widest group-hover:translate-x-1.5 transition-transform duration-300">
                  {card.cta}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Total Predictions", value: String(historyCount), sub: "All time" },
          { label: "Expected Accuracy", value: "94.2%", sub: "Yield MAPE" },
          { label: "Active Season", value: "Rabi", sub: "2026" },
          { label: "System Status", value: "Online", sub: "All services" },
        ].map((stat, i) => (
          <div key={stat.label} className="metric-panel rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-[var(--color-gold)] transition-colors duration-300">
            {/* Background glow in stats */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[var(--color-gold)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-gold)]/15 transition-colors duration-500" />
            
            <p className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest mb-3 relative z-10 w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {stat.label}
            </p>
            <p className="text-3xl font-extrabold text-[#E8F0E4] relative z-10 tracking-tight">{stat.value}</p>
            <p className="text-xs text-[#CBD5C9] mt-2 relative z-10 font-bold opacity-50 uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

