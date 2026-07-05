import type { Job } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { REGION_LABELS } from "@/lib/RegionLabels";
import { sanitizeJobDescription } from "@/lib/SanitizeHtml";
import { EligibilityBadge } from "./EligibilityBadge";

/**
 * The actual full-job-detail content (badges, salary, posted date, tags,
 * sanitized description) — extracted from Phase 6b's JobDetailPanel so it
 * can be reused both inside that slide-over dialog (the /jobs feed's
 * "expand a card" flow) AND embedded directly in a plain page section (the
 * /applications/[id] detail page's linked-job section), without duplicating
 * the markup or the HTML-sanitization logic in two places.
 */
export function JobDetailContent({ job }: Readonly<{ job: Job }>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <EligibilityBadge eligibility={job.eligibility} />
        <span className="text-xs font-medium text-foreground/60">
          {REGION_LABELS[job.region]}
        </span>
        {job.locationRaw && (
          <span className="text-xs text-foreground/45">
            {job.locationRaw}
          </span>
        )}
      </div>

      {job.salary && (
        <p className="text-sm font-semibold text-foreground/80">
          {job.salary}
        </p>
      )}

      <p className="text-xs text-foreground/45">
        Posted {formatRelativeTime(job.postedAt)}
      </p>

      {job.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] font-medium text-foreground/60"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div
        className="job-description prose-sm text-sm leading-relaxed text-foreground/80 [&_a]:font-medium [&_a]:text-primary-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2"
        // Job descriptions arrive as raw HTML from third-party job-board
        // APIs — sanitized via DOMPurify before ever reaching innerHTML,
        // never rendered as-is.
        dangerouslySetInnerHTML={{
          __html: sanitizeJobDescription(job.description),
        }}
      />
    </div>
  );
}
