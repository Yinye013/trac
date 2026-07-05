export type FollowUpUrgency = "overdue" | "due-soon" | null;

const DUE_SOON_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * Derived client-side from `followUpAt` rather than cross-referencing
 * GET /applications/due-followup — that endpoint's "overdue" definition
 * (`followUpAt <= now`) already reduces to a single comparison, and every
 * application (not just the due ones) needs an urgency value computed for
 * rendering, so a second network round-trip would just re-derive information
 * already present in the same `followUpAt` field this view already fetched.
 */
export function getFollowUpUrgency(
  followUpAt: string | null,
): FollowUpUrgency {
  if (!followUpAt) return null;

  const dueAt = new Date(followUpAt).getTime();
  const now = Date.now();

  if (dueAt <= now) return "overdue";
  if (dueAt - now <= DUE_SOON_WINDOW_MS) return "due-soon";
  return null;
}
