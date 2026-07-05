import Link from "next/link";

export function ApplicationBreadcrumb({
  company,
  title,
}: Readonly<{ company: string; title: string }>) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      <Link
        href="/applications"
        className="cursor-pointer font-medium text-foreground/60 transition-colors hover:text-primary-600"
      >
        Applications
      </Link>
      <span aria-hidden="true" className="text-foreground/30">
        /
      </span>
      <span className="min-w-0 truncate font-semibold text-foreground">
        {company} – {title}
      </span>
    </nav>
  );
}
