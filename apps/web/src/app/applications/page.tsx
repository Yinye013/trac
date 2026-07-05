import { ApplicationsView } from "@/components/applications/ApplicationsView";

export default function ApplicationsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border p-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Applications
        </h1>
      </div>
      <ApplicationsView />
    </div>
  );
}
