import type { Job } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { REGION_LABELS } from "@/lib/RegionLabels";
import { CompanyLogo } from "./CompanyLogo";
import { EligibilityBadge } from "./EligibilityBadge";
import { TagList } from "./TagList";

interface JobCardProps {
  job: Job;
  onExpand: () => void;
  onApply: () => void;
}

export function JobCard({ job, onExpand, onApply }: Readonly<JobCardProps>) {
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
      className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-border bg-background p-3.5 text-left transition-colors hover:border-primary-600/40 hover:bg-surface"
    >
      <div className="flex items-start gap-3">
        <CompanyLogo src={job.companyLogo} company={job.company} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-foreground">
            {job.title}
          </h3>
          <p className="truncate text-xs font-medium text-foreground/60">
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

      {job.salary && (
        <p className="text-xs font-semibold text-foreground/80">
          {job.salary}
        </p>
      )}

      <TagList tags={job.tags} />

      <div className="mt-1 flex items-center justify-between">
        <span className="text-[11px] text-foreground/45">
          {formatRelativeTime(job.postedAt)}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onApply();
          }}
          className="cursor-pointer rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
