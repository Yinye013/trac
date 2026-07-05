"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Eligibility, Job, Region } from "@job-tracker/shared";
import { api, type Paginated } from "./Api";

export interface JobFilters {
  eligibility?: Eligibility;
  region?: Region;
  postedSince?: number;
  role?: string;
  source?: string;
}

const JOBS_PAGE_LIMIT = 20;

function buildJobsQueryString(filters: JobFilters, page: number): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(JOBS_PAGE_LIMIT));
  if (filters.eligibility) params.set("eligibility", filters.eligibility);
  if (filters.region) params.set("region", filters.region);
  if (filters.postedSince != null) {
    params.set("postedSince", String(filters.postedSince));
  }
  if (filters.role) params.set("role", filters.role);
  if (filters.source) params.set("source", filters.source);
  return params.toString();
}

export function useJobsFeed(filters: JobFilters) {
  return useInfiniteQuery<Paginated<Job>>({
    queryKey: ["jobs", filters],
    queryFn: ({ pageParam }) =>
      api.getPaginated<Job>(`/jobs?${buildJobsQueryString(filters, pageParam as number)}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
