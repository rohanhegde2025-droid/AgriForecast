"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, HelpCircle, Search } from "lucide-react";
import { useSession } from "next-auth/react";

export function TopHeader() {
  const pathname = usePathname();
  // Mock session to avoid errors when disconnected
  const session = { user: { name: "Farmer" } };

  // Generate breadcrumb tabs
  const tabs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "History", href: "/history" },
    { name: "Prediction", href: "/predict" },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-neutral-200/60 bg-[var(--color-background)] sticky top-0 z-40">
      {/* Tabs / Breadcrumbs */}
      <div className="flex items-center gap-6 h-full">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`text-sm font-medium h-full flex items-center border-b-2 transition-colors ${
                isActive 
                  ? "border-[var(--color-primary-900)] text-[var(--color-text-main)]" 
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search data..." 
            className="pl-9 pr-4 py-1.5 bg-neutral-100 rounded-full text-sm border-none focus:ring-1 focus:ring-[var(--color-primary-900)] w-64"
          />
        </div>
        
        <div className="flex items-center gap-4 text-[var(--color-text-muted)]">
          <button className="hover:text-[var(--color-text-main)] transition-colors"><Bell className="w-4 h-4" /></button>
          <button className="hover:text-[var(--color-text-main)] transition-colors"><HelpCircle className="w-4 h-4" /></button>
          <div className="w-7 h-7 rounded-full bg-[var(--color-primary-900)] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {session.user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
