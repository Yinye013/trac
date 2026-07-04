/**
 * Options for prisma.$transaction(...) calls against Neon's pooled connection.
 * Prisma's defaults (maxWait: 2000ms, timeout: 5000ms) are too tight here —
 * Neon's pooled endpoint occasionally takes longer than that just to hand
 * back a connection for the transaction to start on, which surfaces as
 * "Unable to start a transaction in the given time" under real load.
 */
export const NEON_TRANSACTION_OPTIONS = { maxWait: 10_000, timeout: 10_000 };

/** Same idea, but for transactions batching many writes (e.g. bulk upserts),
 * which need more running room once they do start. Observed exceeding a
 * 20s timeout by less than a second under real network conditions during
 * job ingestion — bumped to 30s for real headroom rather than a razor-thin
 * margin. */
export const NEON_BATCH_TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 30_000,
};
