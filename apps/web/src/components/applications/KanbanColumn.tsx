"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Application, ApplicationStatus } from "@job-tracker/shared";
import { ApplicationCard } from "./ApplicationCard";
import { STATUS_LABELS } from "./StatusBadge";

const COLUMN_ACCENT: Record<ApplicationStatus, string> = {
  SAVED: "border-t-status-saved",
  APPLIED: "border-t-status-applied",
  INTERVIEW: "border-t-status-interview",
  OFFER: "border-t-status-offer",
  REJECTED: "border-t-status-rejected",
  WITHDRAWN: "border-t-status-withdrawn",
};

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export function KanbanColumn({
  status,
  applications,
  onStatusChange,
}: Readonly<KanbanColumnProps>) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`flex w-72 shrink-0 flex-col rounded-xl border border-border border-t-2 bg-surface/50 ${COLUMN_ACCENT[status]}`}
    >
      <div className="flex shrink-0 items-center justify-between px-3 py-2.5">
        <h2 className="text-sm font-bold text-foreground">
          {STATUS_LABELS[status]}
        </h2>
        <span className="rounded-full bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-foreground/50">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 pt-0 transition-colors ${
          isOver ? "bg-primary-600/5" : ""
        }`}
      >
        <SortableContext
          items={applications.map((application) => application.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusChange={(newStatus) =>
                onStatusChange(application.id, newStatus)
              }
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border py-8 text-center text-xs text-foreground/40">
            No applications
          </div>
        )}
      </div>
    </div>
  );
}
