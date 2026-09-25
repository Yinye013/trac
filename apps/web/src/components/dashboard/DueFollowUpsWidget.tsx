"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDueFollowUps } from "@/lib/ApplicationsQuery";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { FollowUpFlag } from "@/components/applications/FollowUpFlag";
import { WidgetCard } from "./WidgetCard";
import { WidgetMessage } from "./WidgetMessage";

const MAX_ROWS = 5;
const SKELETON_KEYS = ["f-a", "f-b", "f-c"];

export function DueFollowUpsWidget() {
  const { data, isLoading, isError } = useDueFollowUps();
  const reducedMotion = useReducedMotion();

  // The endpoint already returns most-overdue-first, capped server-side; we
  // trim to the 5 most urgent for the at-a-glance widget.
  const applications = (data?.data ?? []).slice(0, MAX_ROWS);

  return (
    <WidgetCard title="Due follow-ups" href="/applications" linkLabel="View all">
      {isError ? (
        <WidgetMessage tone="error">
          Couldn&apos;t load follow-ups.
        </WidgetMessage>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="h-14 w-full animate-pulse rounded-xl bg-foreground/10"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <WidgetMessage tone="positive">
          You&apos;re all caught up — nothing due. 🎉
        </WidgetMessage>
      ) : (
        <ul className="flex flex-col gap-2">
          {applications.map((application, index) => (
            <motion.li
              key={application.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Link
                href={`/applications/${application.id}`}
                className="card-modern flex cursor-pointer flex-col gap-1.5 rounded-xl p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {application.title}
                    </p>
                    <p className="truncate text-xs font-medium text-foreground/60">
                      {application.company}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <FollowUpFlag followUpAt={application.followUpAt} />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
