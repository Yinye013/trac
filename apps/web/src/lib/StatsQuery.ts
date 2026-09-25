"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApplicationStatus } from "@job-tracker/shared";
import { api } from "./Api";

export type StatusCounts = Record<ApplicationStatus, number>;

/**
 * `GET /applications/stats` returns a fixed-shape summary
 * (`{success, data: {SAVED, APPLIED, ...}}`), not a paginated list — so it
 * goes through `api.get`, which unwraps the `{success, data}` envelope and
 * hands back the counts object directly. The endpoint zero-fills every
 * status key server-side, so the consumer never has to guard a missing key.
 */
export function useApplicationStats() {
  return useQuery({
    queryKey: ["applications", "stats"],
    queryFn: () => api.get<StatusCounts>("/applications/stats"),
  });
}
