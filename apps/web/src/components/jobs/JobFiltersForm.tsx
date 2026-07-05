import type { Eligibility, Region } from "@job-tracker/shared";
import type { JobFilters } from "@/lib/JobsQuery";
import { REGION_LABELS } from "@/lib/RegionLabels";

const ELIGIBILITY_OPTIONS: Array<{ value: Eligibility; label: string }> = [
  { value: "WORLDWIDE", label: "Worldwide" },
  { value: "RELOCATION_SPONSORED", label: "Relocation sponsored" },
  { value: "REGION_LIMITED", label: "Region limited" },
  { value: "RESTRICTED", label: "Restricted" },
  { value: "UNCLEAR", label: "Unclear" },
];

const REGION_OPTIONS: Array<{ value: Region; label: string }> = (
  Object.entries(REGION_LABELS) as Array<[Region, string]>
).map(([value, label]) => ({ value, label }));

const SOURCE_OPTIONS = ["himalayas", "remoteok", "arbeitnow", "remotive"];

const POSTED_SINCE_OPTIONS = [
  { value: 1, label: "Past day" },
  { value: 7, label: "Past week" },
  { value: 14, label: "Past 2 weeks" },
  { value: 30, label: "Past month" },
];

const selectClassName =
  "w-full cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600";

const labelClassName = "text-xs font-semibold text-foreground/60";

export function JobFiltersForm({
  filters,
  onChange,
}: Readonly<{
  filters: JobFilters;
  onChange: (next: JobFilters) => void;
}>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="role-filter" className={labelClassName}>
          Role keyword
        </label>
        <input
          id="role-filter"
          type="text"
          placeholder="e.g. frontend"
          value={filters.role ?? ""}
          onChange={(event) =>
            onChange({ ...filters, role: event.target.value || undefined })
          }
          className={selectClassName}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="eligibility-filter" className={labelClassName}>
          Eligibility
        </label>
        <select
          id="eligibility-filter"
          value={filters.eligibility ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              eligibility: (event.target.value || undefined) as
                | Eligibility
                | undefined,
            })
          }
          className={selectClassName}
        >
          <option value="">Any</option>
          {ELIGIBILITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-filter" className={labelClassName}>
          Region
        </label>
        <select
          id="region-filter"
          value={filters.region ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              region: (event.target.value || undefined) as
                | Region
                | undefined,
            })
          }
          className={selectClassName}
        >
          <option value="">Any</option>
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="posted-since-filter" className={labelClassName}>
          Posted
        </label>
        <select
          id="posted-since-filter"
          value={filters.postedSince ?? 14}
          onChange={(event) =>
            onChange({
              ...filters,
              postedSince: Number(event.target.value),
            })
          }
          className={selectClassName}
        >
          {POSTED_SINCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="source-filter" className={labelClassName}>
          Source
        </label>
        <select
          id="source-filter"
          value={filters.source ?? ""}
          onChange={(event) =>
            onChange({ ...filters, source: event.target.value || undefined })
          }
          className={selectClassName}
        >
          <option value="">Any</option>
          {SOURCE_OPTIONS.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
