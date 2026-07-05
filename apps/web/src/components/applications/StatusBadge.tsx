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
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
