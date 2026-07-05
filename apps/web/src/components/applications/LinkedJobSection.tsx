import type { Job } from "@job-tracker/shared";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { JobDetailContent } from "@/components/jobs/JobDetailContent";

export function LinkedJobSection({ job }: Readonly<{ job: Job | null }>) {
  if (!job) {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-foreground/50">
        No linked job listing — this application was logged manually.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-4 flex items-start gap-3">
        <CompanyLogo src={job.companyLogo} company={job.company} size={40} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-foreground">
            {job.title}
          </h3>
          <p className="truncate text-xs font-medium text-foreground/60">
            {job.company}
          </p>
        </div>
      </div>
      <JobDetailContent job={job} />
    </div>
  );
}
