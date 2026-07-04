import type { RawJob } from '../raw-job.type';

const REMOTEOK_API_URL = 'https://remoteok.com/api';

interface RemoteOkJob {
  id: string;
  position: string;
  company: string;
  company_logo?: string;
  logo?: string;
  url?: string;
  apply_url?: string;
  description: string;
  tags: string[];
  location?: string;
  salary_min?: number;
  salary_max?: number;
  date: string; // ISO timestamp
}

// RemoteOK's response is a JSON array whose first element is a metadata/legal
// notice object, not a job — every real job entry has an `id`.
type RemoteOkEntry = RemoteOkJob | { legal: string };

export async function fetchRemoteOkJobs(): Promise<RawJob[]> {
  const res = await fetch(REMOTEOK_API_URL, {
    headers: { 'User-Agent': 'job-tracker (personal project)' },
  });
  if (!res.ok) {
    throw new Error(`RemoteOK API responded with ${res.status}`);
  }
  const data = (await res.json()) as RemoteOkEntry[];

  return data.filter((entry): entry is RemoteOkJob => 'id' in entry).map(mapRemoteOkJob);
}

function mapRemoteOkJob(job: RemoteOkJob): RawJob {
  const salary =
    job.salary_min && job.salary_max
      ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
      : null;

  return {
    source: 'remoteok',
    sourceId: job.id,
    title: job.position,
    company: job.company,
    companyLogo: job.company_logo || job.logo || null,
    url: job.apply_url || job.url || '',
    description: job.description,
    tags: job.tags ?? [],
    jobTypes: [],
    locationRaw: job.location || null,
    salary,
    postedAt: new Date(job.date),
  };
}
