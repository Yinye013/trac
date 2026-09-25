"use client";

import { JobsAvailableWidget } from "./JobsAvailableWidget";
import { StatusBreakdownWidget } from "./StatusBreakdownWidget";
import { DueFollowUpsWidget } from "./DueFollowUpsWidget";
import { RecentJobsWidget } from "./RecentJobsWidget";

/**
 * Bento-style overview grid. On desktop (lg) a 3-column layout:
 *   row 1  [ jobs available (1) ][ applications by status (2) ]
 *   row 2  [ due follow-ups  (1) ][ recently added jobs   (2) ]
 * Tablet (md) reflows to a plain 2-column grid; mobile stacks to one column.
 * DOM order (stats → follow-ups → jobs) doubles as the mobile priority order.
 * `items-start` keeps each widget its natural height instead of stretching a
 * short card to match a tall neighbour.
 */
export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <JobsAvailableWidget />
      </div>
      <div className="lg:col-span-2">
        <StatusBreakdownWidget />
      </div>
      <div className="lg:col-span-1">
        <DueFollowUpsWidget />
      </div>
      <div className="lg:col-span-2">
        <RecentJobsWidget />
      </div>
    </div>
  );
}
