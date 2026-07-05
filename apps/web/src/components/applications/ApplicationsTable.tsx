"use client";

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Application, ApplicationStatus } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { FollowUpFlag } from "./FollowUpFlag";
import { StatusMenu } from "./StatusMenu";

interface ApplicationsTableProps {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export function ApplicationsTable({
  applications,
  onStatusChange,
}: Readonly<ApplicationsTableProps>) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs font-semibold text-foreground/50">
          <th className="px-3 py-2 font-semibold">Company</th>
          <th className="px-3 py-2 font-semibold">Title</th>
          <th className="px-3 py-2 font-semibold">Status</th>
          <th className="hidden px-3 py-2 font-semibold sm:table-cell">
            Applied
          </th>
          <th className="hidden px-3 py-2 font-semibold sm:table-cell">
            Follow-up
          </th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => {
          const isExpanded = expandedId === application.id;
          return (
            <Fragment key={application.id}>
              <tr
                onClick={() =>
                  setExpandedId(isExpanded ? null : application.id)
                }
                aria-expanded={isExpanded}
                className="cursor-pointer border-b border-border transition-colors hover:bg-surface"
              >
                <td className="max-w-32 truncate px-3 py-2.5 font-medium text-foreground">
                  {application.company}
                </td>
                <td className="max-w-40 truncate px-3 py-2.5 text-foreground/80">
                  {application.title}
                </td>
                <td
                  className="px-3 py-2.5"
                  onClick={(event) => event.stopPropagation()}
                >
                  <StatusMenu
                    currentStatus={application.status}
                    onChange={(status) =>
                      onStatusChange(application.id, status)
                    }
                  />
                </td>
                <td className="hidden px-3 py-2.5 text-xs text-foreground/60 sm:table-cell">
                  {application.appliedAt
                    ? formatRelativeTime(application.appliedAt)
                    : "—"}
                </td>
                <td className="hidden px-3 py-2.5 sm:table-cell">
                  <FollowUpFlag followUpAt={application.followUpAt} />
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="p-0">
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1.5 border-b border-border bg-surface/50 px-3 py-3 text-xs text-foreground/70 sm:hidden">
                          <p>
                            Applied:{" "}
                            {application.appliedAt
                              ? formatRelativeTime(application.appliedAt)
                              : "Not yet applied"}
                          </p>
                          <div>
                            <FollowUpFlag
                              followUpAt={application.followUpAt}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 border-b border-border bg-surface/50 px-3 py-3 text-xs text-foreground/70">
                          <p>
                            <span className="font-semibold text-foreground/50">
                              Resume version:
                            </span>{" "}
                            {application.resumeVersion ?? "—"}
                          </p>
                          <p>
                            <span className="font-semibold text-foreground/50">
                              Notes:
                            </span>{" "}
                            {application.notes ?? "—"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
