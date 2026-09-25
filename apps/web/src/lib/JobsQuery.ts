"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

function buildJobsQueryString(
  filters: JobFilters,
  page: number,
  limit: number = JOBS_PAGE_LIMIT,
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
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

/** The /jobs page's default filter set — kept here so the dashboard's
 *  "jobs available" count and "recently added" list stay in sync with what
 *  the feed shows by default (last 14 days, matched roles). */
export const DASHBOARD_JOB_FILTERS: JobFilters = { postedSince: 14 };

/**
 * The dashboard "jobs available" stat: how many jobs currently match the
 * default feed filters. We only need the number, so we request `limit=1` and
 * read `pagination.totalItems` — `paginate()` runs its COUNT query regardless
 * of `limit`, so this returns the true total while sending just one row over
 * the wire (cheaper than fetching a full page purely for its count, and no
 * new backend count endpoint needed).
 */
export function useJobsCount(filters: JobFilters = DASHBOARD_JOB_FILTERS) {
  return useQuery({
    queryKey: ["jobs", "count", filters],
    queryFn: async () => {
      const page = await api.getPaginated<Job>(
        `/jobs?${buildJobsQueryString(filters, 1, 1)}`,
      );
      return page.pagination.totalItems;
    },
  });
}

/**
 * The dashboard "recently added jobs" list. `/jobs` is always ordered
 * `postedAt DESC` server-side, so fetching the first `limit` rows already
 * gives the most recent — no sort param needed.
 */
export function useRecentJobs(
  limit = 5,
  filters: JobFilters = DASHBOARD_JOB_FILTERS,
) {
  return useQuery({
    queryKey: ["jobs", "recent", limit, filters],
    queryFn: () =>
      api.getPaginated<Job>(
        `/jobs?${buildJobsQueryString(filters, 1, limit)}`,
      ),
  });
}
