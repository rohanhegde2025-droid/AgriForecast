"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardSummary } from "@/components/dashboard-summary";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-10 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#E8F0E4] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--color-gold)] mt-1 font-medium tracking-wide">Overview of your crop predictions and market data.</p>
        </header>
        <DashboardSummary />
      </div>
    </AppShell>
  );
}
