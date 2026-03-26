"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Activity, Settings, HelpCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const mainLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "History", href: "/history", icon: History },
    { name: "Prediction", href: "/predict", icon: Activity },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-neutral-200/60 bg-[var(--color-background)] flex flex-col h-screen sticky top-0">
      <div className="p-6 pb-8">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold text-[var(--color-primary-900)] tracking-tight">AgriForecast</h1>
          <p className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mt-1">The Digital Agronomist</p>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? "bg-white text-[var(--color-primary-900)] shadow-sm border-l-4 border-l-[var(--color-primary-900)] pl-3" 
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <div className="bg-[#EAF0EC] rounded-lg p-3 border border-[#D5E1DA]">
          <p className="text-[10px] font-bold text-[var(--color-primary-900)] uppercase tracking-wide mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary-900)]" />
            <span className="text-xs font-medium text-[var(--color-text-main)]">Satellites Online</span>
          </div>
        </div>

        <nav className="space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
            <HelpCircle className="w-4 h-4" />
            Support
          </a>
        </nav>
      </div>
    </aside>
  );
}
