"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Application, ApplicationStatus } from "@job-tracker/shared";
import { api, type Paginated } from "./Api";

const APPLICATIONS_QUERY_KEY = ["applications"] as const;
const MAX_PAGE_LIMIT = 50;

/**
 * The API caps `limit` at 50/page. A personal tracker's application count is
 * expected to stay in the dozens, not thousands, and the Kanban board needs
 * every application in memory at once (it renders all statuses side by side,
 * not one paginated slice) — so this fetches every page up front rather than
 * wiring real infinite-scroll pagination for a view that can't page column by
 * column anyway. Revisit if this app ever needs to handle hundreds+ of rows.
 */
async function fetchAllApplications(): Promise<Application[]> {
  const first = await api.getPaginated<Application>(
    `/applications?page=1&limit=${MAX_PAGE_LIMIT}&sortBy=createdAt&sortOrder=desc`,
  );

  if (first.pagination.totalPages <= 1) {
    return first.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: first.pagination.totalPages - 1 }, (_, index) =>
      api.getPaginated<Application>(
        `/applications?page=${index + 2}&limit=${MAX_PAGE_LIMIT}&sortBy=createdAt&sortOrder=desc`,
      ),
    ),
  );

  return [first.data, ...remainingPages.map((page) => page.data)].flat();
}

export function useApplications() {
  return useQuery({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: fetchAllApplications,
  });
}

export function useDueFollowUps() {
  return useQuery({
    queryKey: ["applications", "due-followup"],
    queryFn: () =>
      api.getPaginated<Application>("/applications/due-followup"),
  });
}

interface UpdateStatusVariables {
  id: string;
  status: ApplicationStatus;
}

/**
 * Optimistic status update: the cache is patched immediately (so drag-and-
 * drop and the status menu both feel instant), and rolled back to the
 * pre-mutation snapshot if the PATCH fails. Doesn't send `appliedAt` — the
 * API auto-sets it server-side when status becomes APPLIED and none was
 * supplied in the same request (see apps/api ApplicationsService).
 *
 * Deliberately does NOT `invalidateQueries` on success/settle. This list is
 * fetched via `fetchAllApplications` — several sequential/parallel paginated
 * GETs, not one atomic request — and Neon's connection can occasionally take
 * several seconds (see [[project_job_tracker_architecture]] cold-start note).
 * A background refetch after every status change re-opens exactly the
 * flash-back-to-the-old-status window the optimistic update exists to avoid:
 * the query briefly sits in a refetching state before the new multi-page
 * result lands, during which stale-looking data can surface. The PATCH
 * response already IS the updated row, so it's merged into the cache
 * directly in `onSuccess` instead — no second round trip needed at all.
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusVariables) =>
      api.patch<Application>(`/applications/${id}`, { status }),
    onMutate: ({ id, status }) => {
      const previous = queryClient.getQueryData<Application[]>(
        APPLICATIONS_QUERY_KEY,
      );

      queryClient.setQueryData<Application[]>(
        APPLICATIONS_QUERY_KEY,
        (current) =>
          current?.map((application) =>
            application.id === id ? { ...application, status } : application,
          ),
      );

      return { previous };
    },
    onSuccess: (updatedApplication) => {
      queryClient.setQueryData<Application[]>(
        APPLICATIONS_QUERY_KEY,
        (current) =>
          current?.map((application) =>
            application.id === updatedApplication.id
              ? updatedApplication
              : application,
          ),
      );
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPLICATIONS_QUERY_KEY, context.previous);
      }
    },
  });
}
