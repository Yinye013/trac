import type { ApplicationWithJob } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { FollowUpFlag } from "./FollowUpFlag";
import { LinkedJobSection } from "./LinkedJobSection";
import { STATUS_LABELS, STATUS_STYLES } from "./StatusBadge";

const fieldLabelClassName = "text-xs font-semibold text-foreground/50";

export function ApplicationDetailView({
  application,
  onEdit,
  onDeleteRequest,
}: Readonly<{
  application: ApplicationWithJob;
  onEdit: () => void;
  onDeleteRequest: () => void;
}>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
            {application.title}
          </h1>
          <p className="truncate text-sm font-medium text-foreground/60">
            {application.company}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDeleteRequest}
            className="cursor-pointer rounded-lg bg-status-rejected-bg px-3 py-1.5 text-sm font-medium text-status-rejected transition-colors hover:opacity-80"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className={fieldLabelClassName}>Status</span>
          <span
            className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[application.status]}`}
          >
            {STATUS_LABELS[application.status]}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className={fieldLabelClassName}>Applied</span>
          <span className="text-sm text-foreground/80">
            {application.appliedAt
              ? formatRelativeTime(application.appliedAt)
              : "Not yet applied"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className={fieldLabelClassName}>Follow-up</span>
          {application.followUpAt ? (
            <FollowUpFlag followUpAt={application.followUpAt} />
          ) : (
            <span className="text-sm text-foreground/50">Not set</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className={fieldLabelClassName}>Resume version</span>
          <span className="text-sm text-foreground/80">
            {application.resumeVersion ?? "—"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className={fieldLabelClassName}>Notes</span>
        <p className="whitespace-pre-line text-sm text-foreground/80">
          {application.notes ?? "—"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className={fieldLabelClassName}>Linked job</span>
        <LinkedJobSection job={application.job} />
      </div>
    </div>
  );
}
