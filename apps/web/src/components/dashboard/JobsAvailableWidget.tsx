"use client";

import { motion } from "framer-motion";
import { useJobsCount } from "@/lib/JobsQuery";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { WidgetCard } from "./WidgetCard";
import { WidgetMessage } from "./WidgetMessage";

export function JobsAvailableWidget() {
  const { data, isLoading, isError } = useJobsCount();
  const reducedMotion = useReducedMotion();

  return (
    <WidgetCard title="Jobs available" href="/jobs" linkLabel="Browse jobs">
      {isError ? (
        <WidgetMessage tone="error">Couldn&apos;t load job count.</WidgetMessage>
      ) : isLoading ? (
        <div className="h-11 w-24 animate-pulse rounded-lg bg-foreground/10" />
      ) : (
        <div className="flex flex-col gap-1">
          <motion.span
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gradient text-3xl font-black leading-none"
          >
            {data ?? 0}
          </motion.span>
          <span className="text-sm font-medium text-foreground/60">
            matching roles, last 14 days
          </span>
        </div>
      )}
    </WidgetCard>
  );
}
