import { Logger } from '@nestjs/common';
import type { RawJob } from '../raw-job.type';

const HIMALAYAS_API_URL = 'https://himalayas.app/jobs/api';
const PAGE_SIZE = 20; // Himalayas caps `limit` at 20 regardless of what's requested
const MAX_AGE_DAYS = 14;
// Himalayas' listing is huge (100k+ jobs) and only pages 20 at a time, so
// walking back a full 14 days can mean 1000+ sequential requests and starts
// getting 429'd well before that. We cap how far we'll page and space
// requests out to stay a well-behaved API consumer — this means we likely
// only see the most recent slice of the 14-day window from this source,
// not the full window other sources cover.
const MAX_PAGES = 100;
const REQUEST_DELAY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface HimalayasJob {
  title: string;
  companyName: string;
  companyLogo: string | null;
  employmentType: string | null;
  categories: string[];
  locationRestrictions: string[] | null;
  description: string;
  pubDate: number; // unix seconds
  applicationLink: string;
  guid: string;
}

interface HimalayasResponse {
  offset: number;
  limit: number;
  totalCount: number;
  jobs: HimalayasJob[];
}

const logger = new Logger('HimalayasFetcher');

export async function fetchHimalayasJobs(): Promise<RawJob[]> {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const results: RawJob[] = [];
  let offset = 0;

  // Himalayas returns jobs newest-first, so we page forward until we see a job
  // older than our cutoff, then stop — but cap total pages and space requests
  // out (see MAX_PAGES/REQUEST_DELAY_MS above) so we don't hammer their API.
  for (let page = 0; page < MAX_PAGES; page++) {
    if (page > 0) {
      await delay(REQUEST_DELAY_MS);
    }

    const res = await fetch(`${HIMALAYAS_API_URL}?limit=${PAGE_SIZE}&offset=${offset}`);
    if (!res.ok) {
      if (page === 0) {
        throw new Error(`Himalayas API responded with ${res.status}`);
      }
      // Already have partial results from earlier pages — log and stop
      // rather than discarding what we successfully fetched.
      logger.warn(`Himalayas API responded with ${res.status} after ${page} pages, stopping early`);
      break;
    }
    const data = (await res.json()) as HimalayasResponse;

    if (data.jobs.length === 0) {
      break;
    }

    let sawOldJob = false;
    for (const job of data.jobs) {
      const postedAt = new Date(job.pubDate * 1000);
      if (postedAt.getTime() < cutoff) {
        sawOldJob = true;
        break;
      }
      results.push(mapHimalayasJob(job, postedAt));
    }

    if (sawOldJob || data.jobs.length < PAGE_SIZE) {
      break;
    }
    offset += PAGE_SIZE;
  }

  logger.debug(`Fetched ${results.length} jobs within the last ${MAX_AGE_DAYS} days`);
  return results;
}

function mapHimalayasJob(job: HimalayasJob, postedAt: Date): RawJob {
  return {
    source: 'himalayas',
    sourceId: job.guid,
    title: job.title,
    company: job.companyName,
    companyLogo: job.companyLogo ?? null,
    url: job.applicationLink,
    description: job.description,
    tags: job.categories ?? [],
    jobTypes: job.employmentType ? [job.employmentType] : [],
    locationRaw: job.locationRestrictions?.length ? job.locationRestrictions.join(', ') : null,
    salary: null,
    postedAt,
  };
}
