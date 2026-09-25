"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Application, Job } from "@job-tracker/shared";
import { api } from "@/lib/Api";
import { useRecentJobs } from "@/lib/JobsQuery";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailPanel } from "@/components/jobs/JobDetailPanel";
import { ApplyConfirmDialog } from "@/components/jobs/ApplyConfirmDialog";
import { WidgetCard } from "./WidgetCard";
import { WidgetMessage } from "./WidgetMessage";

const SKELETON_KEYS = ["r-a", "r-b", "r-c"];

export function RecentJobsWidget() {
  const { data, isLoading, isError } = useRecentJobs(5);
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);
  const [applyTarget, setApplyTarget] = useState<Job | null>(null);
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();

  // Mirrors JobFeed's apply flow so the detail slide-over's Apply button works
  // identically here (log the application, invalidate the apps cache, open the
  // posting). Small enough to inline; extracting a shared hook would be
  // premature for two call sites.
  const applyMutation = useMutation({
    mutationFn: (jobId: string) => api.post<Application>(`/jobs/${jobId}/apply`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  function handleApplyConfirm() {
    if (!applyTarget) return;
    const job = applyTarget;
    applyMutation.mutate(job.id, {
      onSuccess: () => {
        setApplyTarget(null);
        window.open(job.url, "_blank", "noopener,noreferrer");
      },
    });
  }

  const jobs = data?.data ?? [];

  return (
    <WidgetCard title="Recently added jobs" href="/jobs" linkLabel="View all">
      {isError ? (
        <WidgetMessage tone="error">Couldn&apos;t load recent jobs.</WidgetMessage>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="h-20 w-full animate-pulse rounded-xl bg-foreground/10"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <WidgetMessage>No new jobs in the last 14 days.</WidgetMessage>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <JobCard
                job={job}
                variant="compact"
                onExpand={() => setExpandedJob(job)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <JobDetailPanel
        job={expandedJob}
        open={expandedJob !== null}
        onOpenChange={(open) => !open && setExpandedJob(null)}
        onApply={() => {
          if (expandedJob) setApplyTarget(expandedJob);
        }}
      />

      <ApplyConfirmDialog
        open={applyTarget !== null}
        onOpenChange={(open) => !open && setApplyTarget(null)}
        jobTitle={applyTarget?.title ?? ""}
        company={applyTarget?.company ?? ""}
        onConfirm={handleApplyConfirm}
        isPending={applyMutation.isPending}
      />
    </WidgetCard>
  );
}
