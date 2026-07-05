"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Application,
  ApplicationStatus,
  ApplicationWithJob,
} from "@job-tracker/shared";
import { api } from "./Api";

function detailQueryKey(id: string) {
  return ["applications", id] as const;
}

export function useApplicationDetail(id: string) {
  return useQuery({
    queryKey: detailQueryKey(id),
    queryFn: () => api.get<ApplicationWithJob>(`/applications/${id}`),
  });
}

export interface UpdateApplicationFields {
  status?: ApplicationStatus;
  appliedAt?: string | null;
  followUpAt?: string | null;
  resumeVersion?: string | null;
  notes?: string | null;
}

/**
 * Updates the cached detail entry directly from the PATCH response rather
 * than invalidating/refetching — same reasoning as Phase 6c's
 * useUpdateApplicationStatus: the response already IS the fresh row, so a
 * second round trip just to re-fetch what we already have would only add
 * latency (and re-open the same kind of refetch-race flash that phase fixed
 * for the Kanban board). Also patches the `applications` list-query cache
 * (if present) so the Kanban/table view reflects the edit without needing
 * its own refetch either.
 */
export function useUpdateApplication(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: UpdateApplicationFields) =>
      api.patch<ApplicationWithJob>(`/applications/${id}`, fields),
    onSuccess: (updated) => {
      queryClient.setQueryData(detailQueryKey(id), updated);
      queryClient.setQueryData<Application[]>(["applications"], (current) =>
        current?.map((application) =>
          application.id === updated.id
            ? { ...application, ...updated }
            : application,
        ),
      );
    },
  });
}

export function useDeleteApplication(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`/applications/${id}`),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: detailQueryKey(id) });
      queryClient.setQueryData<Application[]>(["applications"], (current) =>
        current?.filter((application) => application.id !== id),
      );
    },
  });
}
