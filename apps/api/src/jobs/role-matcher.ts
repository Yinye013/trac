import type { RawJob } from './raw-job.type';

const ROLE_KEYWORDS = [
  'frontend',
  'front-end',
  'front end',
  'full stack',
  'full-stack',
  'fullstack',
  'web developer',
  'webdev',
  'react',
  'react.js',
  'reactjs',
  'next.js',
  'nextjs',
  'vue',
  'vue.js',
  'vuejs',
  'nuxt',
  'angular',
  'angular.js',
  'javascript',
  'typescript',
  'node',
  'node.js',
  'nodejs',
  'software engineer',
  'software developer',
];

/**
 * True if the job's title or tags case-insensitively match any of our target
 * role keywords. Runs at ingest time — non-matches are discarded before they
 * ever reach the database.
 */
export function isRoleMatch(job: RawJob): boolean {
  const haystack = [job.title, ...job.tags].join(' ').toLowerCase();
  return ROLE_KEYWORDS.some((keyword) => haystack.includes(keyword));
}
