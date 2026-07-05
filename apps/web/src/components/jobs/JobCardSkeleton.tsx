export function JobCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col gap-2.5 rounded-xl border border-border bg-background p-3.5 motion-reduce:animate-none"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-surface" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-3/4 rounded bg-surface" />
          <div className="h-3 w-1/2 rounded bg-surface" />
        </div>
      </div>
      <div className="h-4 w-24 rounded-full bg-surface" />
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-md bg-surface" />
        <div className="h-5 w-14 rounded-md bg-surface" />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="h-3 w-16 rounded bg-surface" />
        <div className="h-7 w-16 rounded-lg bg-surface" />
      </div>
    </div>
  );
}
