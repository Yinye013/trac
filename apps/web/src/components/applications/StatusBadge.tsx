import type { ApplicationStatus } from "@job-tracker/shared";

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  SAVED: "bg-status-saved-bg text-status-saved",
  APPLIED: "bg-status-applied-bg text-status-applied",
  INTERVIEW: "bg-status-interview-bg text-status-interview",
  OFFER: "bg-status-offer-bg text-status-offer",
  REJECTED: "bg-status-rejected-bg text-status-rejected",
  WITHDRAWN: "bg-status-withdrawn-bg text-status-withdrawn opacity-70",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export function StatusBadge({
  status,
}: Readonly<{ status: ApplicationStatus }>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-current/15 ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}
