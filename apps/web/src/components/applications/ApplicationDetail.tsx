"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useApplicationDetail,
  useDeleteApplication,
  useUpdateApplication,
} from "@/lib/ApplicationDetailQuery";
import { ApiError } from "@/lib/Api";
import { ApplicationBreadcrumb } from "./ApplicationBreadcrumb";
import { ApplicationDetailView } from "./ApplicationDetailView";
import { ApplicationEditForm } from "./ApplicationEditForm";
import { DeleteApplicationDialog } from "./DeleteApplicationDialog";

export function ApplicationDetail({ id }: Readonly<{ id: string }>) {
  const router = useRouter();
  const { data: application, isLoading, isError, error } =
    useApplicationDetail(id);
  const updateApplication = useUpdateApplication(id);
  const deleteApplication = useDeleteApplication(id);

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent motion-reduce:animate-none" />
          <p className="text-sm text-foreground/60">
            Loading application…
          </p>
        </div>
      </div>
    );
  }

  const isNotFound = error instanceof ApiError && error.statusCode === 404;

  if (isNotFound) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-semibold text-foreground">
          Application not found
        </p>
        <p className="text-xs text-foreground/60">
          It may have been deleted, or the link is incorrect.
        </p>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-sm rounded-xl border border-eligibility-restricted/30 bg-eligibility-restricted-bg p-4 text-center text-sm text-eligibility-restricted">
          Couldn&apos;t load this application:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
      <ApplicationBreadcrumb
        company={application.company}
        title={application.title}
      />

      {mode === "view" ? (
        <ApplicationDetailView
          application={application}
          onEdit={() => setMode("edit")}
          onDeleteRequest={() => setDeleteDialogOpen(true)}
        />
      ) : (
        <ApplicationEditForm
          application={application}
          isSaving={updateApplication.isPending}
          onCancel={() => setMode("view")}
          onSave={(fields) =>
            updateApplication.mutate(fields, {
              onSuccess: () => setMode("view"),
            })
          }
        />
      )}

      <DeleteApplicationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        isPending={deleteApplication.isPending}
        onConfirm={() =>
          deleteApplication.mutate(undefined, {
            onSuccess: () => router.push("/applications"),
          })
        }
      />
    </div>
  );
}
