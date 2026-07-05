import { getFollowUpUrgency } from "@/lib/FollowUpUrgency";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";

const URGENCY_STYLES = {
  overdue: "bg-status-rejected-bg text-status-rejected",
  "due-soon": "bg-status-interview-bg text-status-interview",
} as const;

export function FollowUpFlag({
  followUpAt,
}: Readonly<{ followUpAt: string | null }>) {
  const urgency = getFollowUpUrgency(followUpAt);
  if (!urgency || !followUpAt) return null;

  const label =
    urgency === "overdue"
      ? `Overdue, follow up ${formatRelativeTime(followUpAt)}`
      : `Follow up ${formatRelativeTime(followUpAt)}`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${URGENCY_STYLES[urgency]}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
