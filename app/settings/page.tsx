"use client";

import { signOut } from "next-auth/react";
import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  const user = { name: "Farmer", email: "farmer@example.com" };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-10 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-primary-900)] tracking-tight">Settings</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage your account preferences.</p>
        </header>

        <div className="card-container space-y-5">
          <div>
            <p className="text-[10px] font-bold text-[var(--color-primary-900)] uppercase tracking-wide mb-1">Name</p>
            <p className="text-sm font-medium text-[var(--color-text-main)]">{user.name}</p>
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-[10px] font-bold text-[var(--color-primary-900)] uppercase tracking-wide mb-1">Email</p>
            <p className="text-sm font-medium text-[var(--color-text-main)]">{user.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="secondary-button text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
          >
            Log Out
          </button>
        </div>
      </div>
    </AppShell>
  );
}
