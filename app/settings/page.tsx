"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Farmer", email: "farmer@example.com" });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "Farmer",
          email: firebaseUser.email || "farmer@example.com",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-10 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-[#E8F0E4] tracking-tight mb-2 drop-shadow-sm">Account Settings</h1>
          <p className="text-sm text-[var(--color-gold)] font-medium tracking-wide">Manage your preferences and secure your agricultural profile.</p>
        </header>

        <div className="glass-dark border border-[var(--color-gold)]/20 rounded-xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary-800)] to-[var(--color-gold)]/40" />
          
          <div className="space-y-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest mb-2 opacity-80">Full Name</p>
                <p className="text-lg font-bold text-[#E8F0E4] tracking-wide">{user.name}</p>
              </div>
              <button className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest border border-[var(--color-gold)]/30 px-4 py-2 rounded-sm hover:bg-[var(--color-gold)]/10 transition-colors">Edit</button>
            </div>
            
            <div className="pt-8 border-t border-[var(--color-gold)]/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest mb-2 opacity-80">Email Identifier</p>
                  <p className="text-lg font-bold text-[#E8F0E4] tracking-wide">{user.email}</p>
                </div>
                <span className="bg-[#E8F0E4]/10 text-[#E8F0E4] border border-[#E8F0E4]/30 px-3 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase h-max">Verified</span>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--color-gold)]/10">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest mb-2 opacity-80">Security Control</p>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-medium text-[#CBD5C9]">Google Authentication Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center md:justify-start">
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-3 text-[11px] font-bold text-red-500 uppercase tracking-widest border border-red-500/30 px-8 py-4 rounded-sm hover:bg-red-500/10 transition-all duration-300"
          >
            Terminal Session: <span className="text-red-400 group-hover:scale-105 transition-transform">Log Out</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
