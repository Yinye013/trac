import type { RawJob } from '../raw-job.type';

// Remotive asks integrators to poll at most 4x/day. Our ingestion cron runs
// every 6 hours (4x/day) and this is the only call site for this source —
// do not add another caller without revisiting that budget.
const REMOTIVE_API_URL = 'https://remotive.com/api/remote-jobs';
const MAX_AGE_DAYS = 14;

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  tags: string[];
  job_type: string | null;
  publication_date: string; // ISO timestamp, no timezone suffix
  candidate_required_location: string | null;
  salary: string | null;
  description: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

export async function fetchRemotiveJobs(): Promise<RawJob[]> {
  const res = await fetch(REMOTIVE_API_URL);
  if (!res.ok) {
    throw new Error(`Remotive API responded with ${res.status}`);
  }
  const data = (await res.json()) as RemotiveResponse;

  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  return data.jobs
    .map(mapRemotiveJob)
    .filter((job) => job.postedAt.getTime() >= cutoff);
}

function mapRemotiveJob(job: RemotiveJob): RawJob {
  return {
    source: 'remotive',
    sourceId: String(job.id),
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo || null,
    url: job.url,
    description: job.description,
    tags: job.tags ?? [],
    jobTypes: job.job_type ? [job.job_type] : [],
    locationRaw: job.candidate_required_location || null,
    salary: job.salary || null,
    postedAt: new Date(job.publication_date),
  };
}
