import { Logger } from '@nestjs/common';
import type { RawJob } from '../raw-job.type';

// arbeitnow.com (no `www.`) 301-redirects here; hitting it directly avoids an
// extra round trip on every page of every fetch.
const ARBEITNOW_API_URL = 'https://www.arbeitnow.com/api/job-board-api';
const MAX_AGE_DAYS = 14;
// Safety cap in case an unusual volume of postings prevents us from ever
// reaching the 14-day cutoff — avoids an unbounded number of requests.
const MAX_PAGES = 50; // 100 jobs/page = up to 5000 jobs per run

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string | null;
  created_at: number; // unix seconds
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: { next: string | null };
}

const logger = new Logger('ArbeitnowFetcher');

export async function fetchArbeitnowJobs(): Promise<RawJob[]> {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const results: RawJob[] = [];
  let page = 1;

  // Arbeitnow orders newest-first by created_at, so page forward until we hit
  // a job older than our cutoff, then stop.
  for (let requestCount = 0; requestCount < MAX_PAGES; requestCount++) {
    const res = await fetch(`${ARBEITNOW_API_URL}?page=${page}`);
    if (!res.ok) {
      throw new Error(`Arbeitnow API responded with ${res.status}`);
    }
    const data = (await res.json()) as ArbeitnowResponse;

    if (data.data.length === 0) {
      break;
    }

    let sawOldJob = false;
    for (const job of data.data) {
      const postedAt = new Date(job.created_at * 1000);
      if (postedAt.getTime() < cutoff) {
        sawOldJob = true;
        break;
      }
      results.push(mapArbeitnowJob(job, postedAt));
    }

    if (sawOldJob || !data.links.next) {
      break;
    }
    page += 1;
  }

  logger.debug(
    `Fetched ${results.length} jobs within the last ${MAX_AGE_DAYS} days`,
  );
  return results;
}

function mapArbeitnowJob(job: ArbeitnowJob, postedAt: Date): RawJob {
  return {
    source: 'arbeitnow',
    sourceId: job.slug,
    title: job.title,
    company: job.company_name,
    companyLogo: null,
    url: job.url,
    description: job.description,
    tags: job.tags ?? [],
    jobTypes: job.job_types ?? [],
    locationRaw: job.location,
    salary: null,
    postedAt,
  };
}
