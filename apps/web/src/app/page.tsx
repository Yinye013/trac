import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6">
      <header className="mb-5">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Overview
        </h1>
        <p className="mt-1 text-sm font-medium text-foreground/60">
          Your job search at a glance.
        </p>
      </header>
      <DashboardOverview />
    </div>
  );
}
