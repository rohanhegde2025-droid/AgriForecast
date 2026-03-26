"use client";

import Link from "next/link";
import { Activity, Clock, Settings, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardSummary() {
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("prediction_history") || "[]");
    setHistoryCount(history.length);
  }, []);

  const navCards = [
    {
      title: "New Prediction",
      description: "Enter farm details and generate a yield and price forecast.",
      href: "/predict",
      icon: Activity,
      accent: "bg-[#EAF0EC]",
      iconColor: "text-[var(--color-primary-900)]",
      cta: "Start Prediction →",
    },
    {
      title: "Prediction History",
      description: `Review past predictions and track accuracy over time.`,
      href: "/history",
      icon: Clock,
      accent: "bg-[#FBF8EF]",
      iconColor: "text-[#8F7D65]",
      cta: `View ${historyCount} Records →`,
    },
    {
      title: "Settings",
      description: "Manage your profile, preferences, and notification settings.",
      href: "/settings",
      icon: Settings,
      accent: "bg-[#F4F5FA]",
      iconColor: "text-[#636B8A]",
      cta: "Manage →",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-white border border-neutral-200/60 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-900)] flex items-center justify-center text-white shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-main)] tracking-tight">
              Welcome to AgriForecast
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Data-driven decisions for every harvest season.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {navCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[var(--color-primary-900)]/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg ${card.accent} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-main)] mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                {card.description}
              </p>
              <span className="text-xs font-bold text-[var(--color-primary-900)] uppercase tracking-wider group-hover:underline">
                {card.cta}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Predictions", value: String(historyCount), sub: "All time" },
          { label: "Model Accuracy", value: "94.2%", sub: "Yield MAPE" },
          { label: "Active Season", value: "Rabi", sub: "2026" },
          { label: "System Status", value: "Online", sub: "All services" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#F7F9F8] border border-neutral-100 rounded-lg p-4">
            <p className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-[var(--color-text-main)]">{stat.value}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
