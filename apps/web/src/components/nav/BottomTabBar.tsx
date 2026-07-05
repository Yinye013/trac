"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
    >
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
              isActive
                ? "text-primary-600"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
      <div className="flex flex-1 flex-col items-center gap-0.5 py-1">
        <ThemeToggle />
      </div>
    </nav>
  );
}
