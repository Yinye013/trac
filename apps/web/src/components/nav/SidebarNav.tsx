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
    <aside className="glass-panel hidden h-dvh w-60 shrink-0 flex-col border-y-0 border-l-0 md:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="bg-gradient-accent glow-primary flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black text-white">
          jt
        </span>
        <span className="text-gradient text-lg font-black tracking-tight">
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
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gradient-accent-soft text-primary-600 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-primary-600/5 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <span className="bg-gradient-accent absolute inset-y-1.5 left-0 w-1 rounded-full" aria-hidden />
                )}
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-border/60 px-5 py-3.5">
        <span className="text-sm font-medium text-foreground/50">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
