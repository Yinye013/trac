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
      className="glass-panel fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] md:hidden"
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
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${
              isActive
                ? "text-primary-600 dark:text-primary-300"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                isActive ? "bg-gradient-accent-soft" : ""
              }`}
            >
              <Icon className="h-5.5 w-5.5" />
            </span>
            {link.label}
          </Link>
        );
      })}
      <div className="flex flex-1 flex-col items-center gap-1 py-2.5">
        <ThemeToggle />
      </div>
    </nav>
  );
}
