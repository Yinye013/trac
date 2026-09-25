import type { Eligibility } from "@job-tracker/shared";

const ELIGIBILITY_STYLES: Record<Eligibility, string> = {
  WORLDWIDE: "bg-eligibility-worldwide-bg text-eligibility-worldwide",
  RELOCATION_SPONSORED:
    "bg-eligibility-relocation-bg text-eligibility-relocation",
  REGION_LIMITED:
    "bg-eligibility-region-limited-bg text-eligibility-region-limited",
  RESTRICTED: "bg-eligibility-restricted-bg text-eligibility-restricted",
  UNCLEAR: "bg-eligibility-unclear-bg text-eligibility-unclear",
};

const ELIGIBILITY_LABELS: Record<Eligibility, string> = {
  WORLDWIDE: "Worldwide",
  RELOCATION_SPONSORED: "Relocation sponsored",
  REGION_LIMITED: "Region limited",
  RESTRICTED: "Restricted",
  UNCLEAR: "Unclear",
};

export function EligibilityBadge({
  eligibility,
}: Readonly<{ eligibility: Eligibility }>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-current/15 ${ELIGIBILITY_STYLES[eligibility]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {ELIGIBILITY_LABELS[eligibility]}
    </span>
  );
}
