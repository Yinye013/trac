import Link from "next/link";
import type { Application, ApplicationStatus } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { FollowUpFlag } from "./FollowUpFlag";
import { StatusMenu } from "./StatusMenu";

interface ApplicationCardContentProps {
  application: Application;
  onStatusChange: (status: ApplicationStatus) => void;
  isDragging?: boolean;
}

/**
 * Purely presentational card body — no drag wiring of its own. Used both by
 * `ApplicationCard` (the real, sortable card in a column) and directly inside
 * `DragOverlay` (the floating copy that follows the cursor while dragging).
 * The overlay copy must NOT also call `useSortable` — dnd-kit already drives
 * its position, and a second `useSortable` subscription on the same id fights
 * with the real card's, which is what caused the drag animation to stutter.
 */
export function ApplicationCardContent({
  application,
  onStatusChange,
  isDragging,
}: Readonly<ApplicationCardContentProps>) {
  return (
    <div
      className={`card-modern flex cursor-pointer flex-col gap-2.5 rounded-2xl p-3.5 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/applications/${application.id}`}
          onPointerDown={(event) => event.stopPropagation()}
          className="min-w-0 cursor-pointer"
        >
          <h3 className="truncate text-sm font-bold text-foreground transition-colors hover:text-primary-600">
            {application.title}
          </h3>
          <p className="truncate text-xs font-medium text-foreground/60">
            {application.company}
          </p>
        </Link>
        <div onPointerDown={(event) => event.stopPropagation()}>
          <StatusMenu
            currentStatus={application.status}
            onChange={onStatusChange}
          />
        </div>
      </div>

      <FollowUpFlag followUpAt={application.followUpAt} />

      <p className="text-[11px] text-foreground/45">
        {application.appliedAt
          ? `Applied ${formatRelativeTime(application.appliedAt)}`
          : `Saved ${formatRelativeTime(application.createdAt)}`}
      </p>
    </div>
  );
}
