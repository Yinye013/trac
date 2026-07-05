import { JobFeed } from "@/components/jobs/JobFeed";

export default function JobsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border p-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Jobs
        </h1>
      </div>
      <JobFeed />
    </div>
  );
}
