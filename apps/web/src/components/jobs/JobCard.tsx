import type { Job } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { REGION_LABELS } from "@/lib/RegionLabels";
import { CompanyLogo } from "./CompanyLogo";
import { EligibilityBadge } from "./EligibilityBadge";
import { TagList } from "./TagList";

interface JobCardProps {
  job: Job;
  onExpand: () => void;
  /**
   * Optional so the compact dashboard variant can render a card that only
   * opens the detail slide-over, without an Apply button. When omitted, the
   * Apply CTA is not rendered at all.
   */
  onApply?: () => void;
  /**
   * "compact" is the dashboard "recently added" variant: tighter spacing,
   * smaller type, and tags/salary/Apply trimmed so several fit in a dense
   * widget. Same component (per DRY) — only presentation differs.
   */
  variant?: "default" | "compact";
}

export function JobCard({
  job,
  onExpand,
  onApply,
  variant = "default",
}: Readonly<JobCardProps>) {
  const compact = variant === "compact";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onExpand();
        }
      }}
      className={
        compact
          ? "card-modern flex cursor-pointer flex-col gap-2 rounded-xl p-3 text-left"
          : "card-modern flex cursor-pointer flex-col gap-3 rounded-2xl p-4 text-left"
      }
    >
      <div className="flex items-start gap-3">
        <CompanyLogo src={job.companyLogo} company={job.company} />
        <div className="min-w-0 flex-1">
          <h3
            className={
              compact
                ? "truncate text-sm font-bold text-foreground"
                : "truncate text-base font-bold text-foreground"
            }
          >
            {job.title}
          </h3>
          <p
            className={
              compact
                ? "truncate text-xs font-medium text-foreground/60"
                : "truncate text-sm font-medium text-foreground/60"
            }
          >
            {job.company}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <EligibilityBadge eligibility={job.eligibility} />
        <span className="text-[11px] font-medium text-foreground/50">
          {REGION_LABELS[job.region]}
        </span>
      </div>

      {!compact && job.salary && (
        <p className="text-sm font-semibold text-foreground/80">
          {job.salary}
        </p>
      )}

      {!compact && <TagList tags={job.tags} />}

      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-foreground/45">
          {formatRelativeTime(job.postedAt)}
        </span>
        {onApply && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onApply();
            }}
            className="bg-gradient-accent glow-primary cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
