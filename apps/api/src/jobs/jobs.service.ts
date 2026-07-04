import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NEON_BATCH_TRANSACTION_OPTIONS } from '../common/prisma-transaction-options';
import { PrismaService } from '../prisma/prisma.service';
import { fetchArbeitnowJobs } from './fetchers/arbeitnow.fetcher';
import { fetchHimalayasJobs } from './fetchers/himalayas.fetcher';
import { fetchRemoteOkJobs } from './fetchers/remoteok.fetcher';
import { fetchRemotiveJobs } from './fetchers/remotive.fetcher';
import { resolveEligibility } from './eligibility-heuristic';
import { isRoleMatch } from './role-matcher';
import type { RawJob } from './raw-job.type';

const INGEST_WINDOW_DAYS = 14;
// Prisma has no bulk-upsert — each upsert is its own round-trip, and a run
// can match 500-1000+ jobs across sources. Wrapping ALL of them in one
// interactive transaction reliably exceeds any reasonable timeout, so we
// chunk into small batches, each atomic on its own. This trades whole-run
// atomicity for per-batch atomicity; since upserts are idempotent on
// (source, sourceId), a crash mid-run just leaves later batches to be
// picked up (and self-corrected) by the next 6-hour cron cycle.
const UPSERT_BATCH_SIZE = 50;

export interface IngestSummary {
  fetched: number;
  matched: number;
  ingested: number;
  duplicatesSkipped: number;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async ingestJobs(): Promise<IngestSummary> {
    const rawJobs = await this.fetchAllSources();

    const cutoff = Date.now() - INGEST_WINDOW_DAYS * 24 * 60 * 60 * 1000;

    const withinWindow = rawJobs.filter(
      (job) => job.postedAt.getTime() >= cutoff,
    );

    const matched = withinWindow.filter(isRoleMatch);

    const existingKeys = await this.findExistingKeys(matched);

    const upsertOps = matched.map((job) => {
      const { eligibility, region } = resolveEligibility(job);
      return this.prisma.job.upsert({
        where: {
          source_sourceId: { source: job.source, sourceId: job.sourceId },
        },
        create: {
          source: job.source,
          sourceId: job.sourceId,
          title: job.title,
          company: job.company,
          companyLogo: job.companyLogo,
          url: job.url,
          description: job.description,
          tags: job.tags,
          jobTypes: job.jobTypes,
          locationRaw: job.locationRaw,
          eligibility,
          region,
          salary: job.salary,
          postedAt: job.postedAt,
        },
        update: {
          title: job.title,
          company: job.company,
          companyLogo: job.companyLogo,
          url: job.url,
          description: job.description,
          tags: job.tags,
          jobTypes: job.jobTypes,
          locationRaw: job.locationRaw,
          eligibility,
          region,
          salary: job.salary,
          postedAt: job.postedAt,
        },
      });
    });

    for (let i = 0; i < upsertOps.length; i += UPSERT_BATCH_SIZE) {
      const batch = upsertOps.slice(i, i + UPSERT_BATCH_SIZE);
      await this.prisma.$transaction(batch, NEON_BATCH_TRANSACTION_OPTIONS);
    }

    const duplicatesSkipped = matched.filter((job) =>
      existingKeys.has(this.jobKey(job.source, job.sourceId)),
    ).length;

    const summary: IngestSummary = {
      fetched: rawJobs.length,
      matched: matched.length,
      ingested: matched.length - duplicatesSkipped,
      duplicatesSkipped,
    };

    this.logger.log(
      `Fetched ${summary.fetched}, matched ${summary.matched}, ingested ${summary.ingested}, ${summary.duplicatesSkipped} duplicates skipped`,
    );

    return summary;
  }

  private async fetchAllSources(): Promise<RawJob[]> {
    const sourceFetchers: Array<{
      name: string;
      fetch: () => Promise<RawJob[]>;
    }> = [
      { name: 'himalayas', fetch: fetchHimalayasJobs },
      { name: 'remoteok', fetch: fetchRemoteOkJobs },
      { name: 'arbeitnow', fetch: fetchArbeitnowJobs },
      { name: 'remotive', fetch: fetchRemotiveJobs },
    ];

    const settled = await Promise.allSettled(
      sourceFetchers.map((source) => source.fetch()),
    );

    const rawJobs: RawJob[] = [];
    settled.forEach((result, index) => {
      const sourceName = sourceFetchers[index].name;
      if (result.status === 'fulfilled') {
        rawJobs.push(...result.value);
      } else {
        const reason =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        this.logger.warn(`Source "${sourceName}" failed to fetch: ${reason}`);
      }
    });

    return rawJobs;
  }

  private async findExistingKeys(jobs: RawJob[]): Promise<Set<string>> {
    if (jobs.length === 0) {
      return new Set();
    }
    const existing = await this.prisma.job.findMany({
      where: {
        OR: jobs.map((job) => ({ source: job.source, sourceId: job.sourceId })),
      },
      select: { source: true, sourceId: true },
    });
    return new Set(
      existing.map((job) => this.jobKey(job.source, job.sourceId)),
    );
  }

  private jobKey(source: string, sourceId: string): string {
    return `${source}:${sourceId}`;
  }
}
