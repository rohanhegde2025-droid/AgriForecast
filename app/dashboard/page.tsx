"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardSummary } from "@/components/dashboard-summary";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-10 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-primary-900)] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Overview of your crop predictions and market data.</p>
        </header>
        <DashboardSummary />
      </div>
    </AppShell>
  );
}
