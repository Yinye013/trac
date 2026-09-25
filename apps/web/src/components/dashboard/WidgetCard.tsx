import Link from "next/link";

interface WidgetCardProps {
  title: string;
  /** Optional "see the full view" link rendered in the widget header. */
  href?: string;
  linkLabel?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Shared shell for every dashboard widget: an elevated panel with a header
 * (title + optional link into the full page) and a body. Extracting this keeps
 * the four widgets consistent and avoids repeating the panel class soup in each
 * (per FRONTEND_GUIDELINES: real components over duplicated utility strings).
 */
export function WidgetCard({
  title,
  href,
  linkLabel = "View all",
  className,
  children,
}: Readonly<WidgetCardProps>) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-border bg-surface-elevated p-4 shadow-soft ${className ?? ""}`}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/55">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="cursor-pointer text-xs font-semibold text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400"
          >
            {linkLabel} →
          </Link>
        )}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}
