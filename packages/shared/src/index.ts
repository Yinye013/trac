export interface Ping {
  message: string;
  timestamp: number;
}

export type Eligibility =
  | "WORLDWIDE"
  | "RELOCATION_SPONSORED"
  | "REGION_LIMITED"
  | "RESTRICTED"
  | "UNCLEAR";

export type Region =
  | "USA"
  | "CANADA"
  | "UK"
  | "GERMANY"
  | "NETHERLANDS"
  | "IRELAND"
  | "PORTUGAL"
  | "SPAIN"
  | "FRANCE"
  | "SWITZERLAND"
  | "EU_OTHER"
  | "GULF"
  | "ASIA_PACIFIC"
  | "OTHER"
  | "UNCLEAR";

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

/** Mirrors apps/api's Prisma `Job` model — kept in sync manually. */
export interface Job {
  id: string;
  source: string;
  sourceId: string;
  title: string;
  company: string;
  companyLogo: string | null;
  url: string;
  description: string;
  tags: string[];
  jobTypes: string[];
  locationRaw: string | null;
  eligibility: Eligibility;
  region: Region;
  salary: string | null;
  postedAt: string;
  fetchedAt: string;
}

/** Mirrors apps/api's Prisma `Application` model — kept in sync manually. */
export interface Application {
  id: string;
  jobId: string | null;
  title: string;
  company: string;
  url: string | null;
  status: ApplicationStatus;
  appliedAt: string | null;
  followUpAt: string | null;
  resumeVersion: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * The shape `GET /applications/:id` returns specifically — it includes the
 * linked `Job` (via Prisma's `include: { job: true }`), unlike the plain
 * `Application` returned by list/create/update endpoints. `job` is `null`
 * for applications logged manually with no linked aggregator job.
 */
export interface ApplicationWithJob extends Application {
  job: Job | null;
}
