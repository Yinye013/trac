"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_LINKS } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { useReducedMotion } from "@/lib/UseReducedMotion";

export function SidebarNav() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <aside className="hidden h-dvh w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-14 items-center gap-2 px-4">
        <span className="text-lg font-black tracking-tight text-primary-600">
          job-tracker
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2" aria-label="Main">
        {NAV_LINKS.map((link, index) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <motion.div
              key={link.href}
              initial={reducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-600/10 text-primary-600"
                    : "text-foreground/70 hover:bg-primary-600/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="text-xs font-medium text-foreground/50">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
