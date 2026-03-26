import Link from "next/link";
import { Activity } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded bg-[#EAF0EC] text-[var(--color-primary-900)] flex items-center justify-center mb-5">
        <Activity className="w-6 h-6 opacity-80" />
      </div>
      <h3 className="text-base font-bold text-[var(--color-text-main)] mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="primary-button text-xs px-5 py-2 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
