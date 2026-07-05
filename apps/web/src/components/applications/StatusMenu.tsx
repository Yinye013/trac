"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ApplicationStatus } from "@job-tracker/shared";
import { STATUS_LABELS, STATUS_ORDER, StatusBadge } from "./StatusBadge";

interface StatusMenuProps {
  currentStatus: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

/**
 * The one place status-change UI lives — used by both the Kanban card and
 * the mobile table row so drag-and-drop and click-to-change both funnel
 * into the same `useUpdateApplicationStatus` mutation via `onChange`,
 * rather than two separate status-editing implementations.
 */
export function StatusMenu({
  currentStatus,
  onChange,
  disabled,
}: Readonly<StatusMenuProps>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={`Change status, currently ${STATUS_LABELS[currentStatus]}`}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          <StatusBadge status={currentStatus} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-36 rounded-lg border border-border bg-background p-1 shadow-lg"
        >
          {STATUS_ORDER.map((status) => (
            <DropdownMenu.Item
              key={status}
              onSelect={() => onChange(status)}
              className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-surface data-[highlighted]:bg-surface ${
                status === currentStatus
                  ? "font-semibold text-foreground"
                  : "text-foreground/70"
              }`}
            >
              {STATUS_LABELS[status]}
              {status === currentStatus && (
                <span aria-hidden="true" className="text-primary-600">
                  ✓
                </span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
