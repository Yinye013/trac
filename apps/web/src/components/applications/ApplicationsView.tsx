"use client";

import type { ApplicationStatus } from "@job-tracker/shared";
import { useApplications, useUpdateApplicationStatus } from "@/lib/ApplicationsQuery";
import { ApplicationsTable } from "./ApplicationsTable";
import { KanbanBoard } from "./KanbanBoard";

export function ApplicationsView() {
  const { data: applications, isLoading, isError, error } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  function handleStatusChange(id: string, status: ApplicationStatus) {
    updateStatus.mutate({ id, status });
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent motion-reduce:animate-none" />
          <p className="text-sm text-foreground/60">Loading applications…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-sm rounded-xl border border-eligibility-restricted/30 bg-eligibility-restricted-bg p-4 text-center text-sm text-eligibility-restricted">
          Couldn&apos;t load applications:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-semibold text-foreground">
            No applications yet
          </p>
          <p className="text-xs text-foreground/60">
            Apply to a job from the Jobs feed to see it show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0">
      <div className="hidden h-full md:block">
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      </div>
      <div className="h-full overflow-y-auto p-3 md:hidden">
        <ApplicationsTable
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
