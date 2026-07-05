"use client";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface ApplyConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  company: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function ApplyConfirmDialog({
  open,
  onOpenChange,
  jobTitle,
  company,
  onConfirm,
  isPending,
}: Readonly<ApplyConfirmDialogProps>) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Log this application?"
      description={
        <>
          This logs <span className="font-medium">{jobTitle}</span> at{" "}
          <span className="font-medium">{company}</span> as applied, then
          opens the job posting in a new tab.
        </>
      }
      confirmLabel="Confirm & open"
      pendingLabel="Logging..."
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
