"use client";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export function DeleteApplicationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}>) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete this application?"
      description="This can't be undone."
      confirmLabel="Delete"
      pendingLabel="Deleting..."
      onConfirm={onConfirm}
      isPending={isPending}
      destructive
    />
  );
}
