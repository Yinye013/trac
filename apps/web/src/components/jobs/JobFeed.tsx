"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Application, Job } from "@job-tracker/shared";
import { api } from "@/lib/Api";
import { useInfiniteScrollTrigger } from "@/lib/UseInfiniteScrollTrigger";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { type JobFilters, useJobsFeed } from "@/lib/JobsQuery";
import { ApplyConfirmDialog } from "./ApplyConfirmDialog";
import { FilterDrawer } from "./FilterDrawer";
import { FilterSidebar } from "./FilterSidebar";
import { JobCard } from "./JobCard";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { JobDetailPanel } from "./JobDetailPanel";

const DEFAULT_FILTERS: JobFilters = { postedSince: 14 };

const SKELETON_KEYS_INITIAL = [
  "skel-a",
  "skel-b",
  "skel-c",
  "skel-d",
  "skel-e",
  "skel-f",
];
const SKELETON_KEYS_NEXT_PAGE = ["skel-next-a", "skel-next-b", "skel-next-c"];

export function JobFeed() {
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);
  const [applyTarget, setApplyTarget] = useState<Job | null>(null);
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useJobsFeed(filters);

  const applyMutation = useMutation({
    mutationFn: (jobId: string) => api.post<Application>(`/jobs/${jobId}/apply`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const sentinelRef = useInfiniteScrollTrigger({
    onIntersect: fetchNextPage,
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
  });

  const jobs = data?.pages.flatMap((page) => page.data) ?? [];

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

  return (
    <div className="flex min-h-0 flex-1">
      <FilterSidebar filters={filters} onChange={setFilters} />

      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        {isError && (
          <div className="rounded-xl border border-eligibility-restricted/30 bg-eligibility-restricted-bg p-4 text-sm text-eligibility-restricted">
            Couldn&apos;t load jobs: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {SKELETON_KEYS_INITIAL.map((key) => (
              <JobCardSkeleton key={key} />
            ))}
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm font-semibold text-foreground">
              No jobs match these filters
            </p>
            <p className="text-xs text-foreground/60">
              Try widening the posted-since window or clearing a filter.
            </p>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={
                  reducedMotion ? false : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index % 6, 5) * 0.04,
                }}
              >
                <JobCard
                  job={job}
                  onExpand={() => setExpandedJob(job)}
                  onApply={() => setApplyTarget(job)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {jobs.length > 0 && (
          <div ref={sentinelRef} className="mt-4">
            {isFetchingNextPage && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {SKELETON_KEYS_NEXT_PAGE.map((key) => (
                  <JobCardSkeleton key={key} />
                ))}
              </div>
            )}
            {!hasNextPage && !isFetchingNextPage && (
              <p className="py-6 text-center text-xs text-foreground/45">
                No more jobs match these filters.
              </p>
            )}
          </div>
        )}
      </div>

      <FilterDrawer
        filters={filters}
        onChange={setFilters}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

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
    </div>
  );
}
