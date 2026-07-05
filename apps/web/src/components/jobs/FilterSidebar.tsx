import type { JobFilters } from "@/lib/JobsQuery";
import { JobFiltersForm } from "./JobFiltersForm";

export function FilterSidebar({
  filters,
  onChange,
}: Readonly<{
  filters: JobFilters;
  onChange: (next: JobFilters) => void;
}>) {
  return (
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border p-4 lg:block">
      <h2 className="mb-4 text-sm font-bold text-foreground">Filters</h2>
      <JobFiltersForm filters={filters} onChange={onChange} />
    </aside>
  );
}
