import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">AgriForecast</p>
          <p className="text-xs text-neutral-400">Helping farmers make better crop decisions.</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-neutral-400">
          <Link href="/dashboard" className="hover:text-neutral-600 transition-colors">Dashboard</Link>
          <Link href="/predict" className="hover:text-neutral-600 transition-colors">Predict</Link>
          <Link href="/history" className="hover:text-neutral-600 transition-colors">History</Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
