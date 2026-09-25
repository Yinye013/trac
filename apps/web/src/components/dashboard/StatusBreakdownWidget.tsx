"use client";

import { motion } from "framer-motion";
import type { ApplicationStatus } from "@job-tracker/shared";
import { useApplicationStats } from "@/lib/StatsQuery";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { STATUS_LABELS, STATUS_ORDER } from "@/components/applications/StatusBadge";
import { WidgetCard } from "./WidgetCard";
import { WidgetMessage } from "./WidgetMessage";

/**
 * Solid status-color fills for the bars/dots. Full class names (never
 * `bg-status-${status}`) so Tailwind's build-time scanner keeps them —
 * dynamically-built class names silently vanish in production.
 */
const STATUS_BAR_FILL: Record<ApplicationStatus, string> = {
  SAVED: "bg-status-saved",
  APPLIED: "bg-status-applied",
  INTERVIEW: "bg-status-interview",
  OFFER: "bg-status-offer",
  REJECTED: "bg-status-rejected",
  WITHDRAWN: "bg-status-withdrawn",
};

export function StatusBreakdownWidget() {
  const { data, isLoading, isError } = useApplicationStats();
  const reducedMotion = useReducedMotion();

  const total = data
    ? STATUS_ORDER.reduce((sum, status) => sum + data[status], 0)
    : 0;

  return (
    <WidgetCard title="Applications by status" href="/applications">
      {isError ? (
        <WidgetMessage tone="error">
          Couldn&apos;t load application stats.
        </WidgetMessage>
      ) : isLoading ? (
        <div className="flex flex-col gap-2.5">
          {STATUS_ORDER.map((status) => (
            <div
              key={status}
              className="h-3.5 w-full animate-pulse rounded-full bg-foreground/10"
            />
          ))}
        </div>
      ) : total === 0 ? (
        <WidgetMessage>
          No applications yet — apply to a job to start tracking.
        </WidgetMessage>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-gradient text-2xl font-black leading-none">
              {total}
            </span>
            <span className="text-sm font-medium text-foreground/60">
              total applications
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {STATUS_ORDER.map((status) => {
              const count = data![status];
              const share = total > 0 ? (count / total) * 100 : 0;
              // Keep a tiny nonzero slice visible so single applications register.
              const width = count > 0 ? Math.max(share, 5) : 0;

              return (
                <li key={status} className="flex items-center gap-3">
                  <div className="flex w-24 shrink-0 items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${STATUS_BAR_FILL[status]}`}
                      aria-hidden
                    />
                    <span className="truncate text-xs font-semibold text-foreground/70">
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                      className={`h-full rounded-full ${STATUS_BAR_FILL[status]}`}
                      initial={reducedMotion ? false : { width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-bold tabular-nums text-foreground">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </WidgetCard>
  );
}
