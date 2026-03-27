import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Menu, X } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar - Handles its own responsive visibility based on isSidebarOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[var(--color-primary-900)] border-b border-[var(--color-gold)]/20 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#E8F0E4] tracking-tighter">
              Agri<span className="text-[var(--color-gold)]">Forecast</span>
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-[var(--color-gold)] hover:bg-[var(--color-primary-800)]/40 rounded-lg transition-colors border border-[var(--color-gold)]/20 shadow-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
