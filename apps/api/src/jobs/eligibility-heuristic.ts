import { Eligibility, Region } from '../generated/prisma/enums';
import type { RawJob } from './raw-job.type';

export interface EligibilityResult {
  eligibility: Eligibility;
  region: Region;
}

const HARD_RESTRICTED_KEYWORDS = [
  'citizens only',
  'must be a citizen of',
  'security clearance required',
  'no visa sponsorship',
  'will not sponsor',
];

const RESTRICTIVE_KEYWORDS = [
  'must be based in',
  'must reside in',
  'must be located in',
  'must be authorized to work in',
  'work authorization required',
  'residents only',
  'based only',
  'must currently reside',
  'candidates must be located in',
];

const RELOCATION_KEYWORDS = [
  'visa sponsorship',
  'visa sponsored',
  'sponsor visa',
  'will sponsor',
  'relocation assistance',
  'relocation support',
  'relocation package',
  'we relocate',
  'help you relocate',
  'relocation provided',
];

const WORLDWIDE_KEYWORDS = [
  'remote worldwide',
  'remote - worldwide',
  'remote (worldwide)',
  'work from anywhere',
  'remote anywhere',
  'anywhere in the world',
  'global remote',
  'remote - global',
  'distributed team',
  'remote-first',
];

// Explicit country/region name -> our Region enum. Checked in this order so
// that more specific multi-word names are tried before short ones that could
// accidentally substring-match inside a longer country name.
const REGION_NAME_MAP: Array<[string, Region]> = [
  ['united states', Region.USA],
  ['u.s.a', Region.USA],
  ['u.s.', Region.USA],
  ['usa', Region.USA],
  ['canada', Region.CANADA],
  ['united kingdom', Region.UK],
  ['uk', Region.UK],
  ['germany', Region.GERMANY],
  ['netherlands', Region.NETHERLANDS],
  ['ireland', Region.IRELAND],
  ['portugal', Region.PORTUGAL],
  ['spain', Region.SPAIN],
  ['france', Region.FRANCE],
  ['switzerland', Region.SWITZERLAND],
  ['uae', Region.GULF],
  ['united arab emirates', Region.GULF],
  ['dubai', Region.GULF],
  ['saudi', Region.GULF],
  ['qatar', Region.GULF],
  ['singapore', Region.ASIA_PACIFIC],
  ['japan', Region.ASIA_PACIFIC],
  ['australia', Region.ASIA_PACIFIC],
  ['new zealand', Region.ASIA_PACIFIC],
  ['philippines', Region.ASIA_PACIFIC],
  ['india', Region.ASIA_PACIFIC],
  ['hong kong', Region.ASIA_PACIFIC],
  ['south korea', Region.ASIA_PACIFIC],
];

// EU member states without their own explicit Region enum value — a match
// here (and no match above) resolves to EU_OTHER rather than OTHER/UNCLEAR.
const OTHER_EU_COUNTRIES = [
  'austria',
  'belgium',
  'bulgaria',
  'croatia',
  'cyprus',
  'czech republic',
  'czechia',
  'denmark',
  'estonia',
  'finland',
  'greece',
  'hungary',
  'italy',
  'latvia',
  'lithuania',
  'luxembourg',
  'malta',
  'poland',
  'romania',
  'slovakia',
  'slovenia',
  'sweden',
];

function findMatchedKeyword(text: string, keywords: string[]): string | null {
  return keywords.find((keyword) => text.includes(keyword)) ?? null;
}

/**
 * Returns the sentence containing `keyword`, or a fallback window around it
 * if the text doesn't split cleanly into sentences.
 */
function extractSurroundingSentence(text: string, keyword: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const match = sentences.find((sentence) => sentence.includes(keyword));
  if (match) {
    return match;
  }
  const index = text.indexOf(keyword);
  const start = Math.max(0, index - 100);
  const end = Math.min(text.length, index + keyword.length + 100);
  return text.slice(start, end);
}

function extractRegion(text: string): Region {
  for (const [name, region] of REGION_NAME_MAP) {
    if (text.includes(name)) {
      return region;
    }
  }
  if (OTHER_EU_COUNTRIES.some((country) => text.includes(country))) {
    return Region.EU_OTHER;
  }
  return Region.UNCLEAR;
}

/**
 * Determines eligibility + region for a raw job from its combined text
 * (title + description + locationRaw), using ordered keyword-group matching.
 * Pure function: no DB or HTTP calls, safe to unit test directly.
 */
export function resolveEligibility(job: RawJob): EligibilityResult {
  const combined = [job.title, job.description, job.locationRaw ?? '']
    .join(' ')
    .toLowerCase();

  const hardRestrictedMatch = findMatchedKeyword(combined, HARD_RESTRICTED_KEYWORDS);
  if (hardRestrictedMatch) {
    const sentence = extractSurroundingSentence(combined, hardRestrictedMatch);
    return { eligibility: Eligibility.RESTRICTED, region: extractRegion(sentence) };
  }

  const restrictiveMatch = findMatchedKeyword(combined, RESTRICTIVE_KEYWORDS);
  if (restrictiveMatch) {
    const sentence = extractSurroundingSentence(combined, restrictiveMatch);
    return { eligibility: Eligibility.REGION_LIMITED, region: extractRegion(sentence) };
  }

  const relocationMatch = findMatchedKeyword(combined, RELOCATION_KEYWORDS);
  if (relocationMatch) {
    const sentence = extractSurroundingSentence(combined, relocationMatch);
    return { eligibility: Eligibility.RELOCATION_SPONSORED, region: extractRegion(sentence) };
  }

  const worldwideMatch = findMatchedKeyword(combined, WORLDWIDE_KEYWORDS);
  if (worldwideMatch) {
    // No sentence-scoped extraction here — a "worldwide" posting's company
    // HQ/origin (if present at all) is company metadata, not something tied
    // to the sentence the worldwide keyword appears in, so we look at the
    // whole combined text instead.
    return { eligibility: Eligibility.WORLDWIDE, region: extractRegion(combined) };
  }

  return { eligibility: Eligibility.UNCLEAR, region: Region.UNCLEAR };
}
