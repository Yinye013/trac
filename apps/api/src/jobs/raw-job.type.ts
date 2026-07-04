export interface RawJob {
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
  salary: string | null;
  postedAt: Date;
}
