const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

/** e.g. "3 days ago", "yesterday", "2 hours ago". Uses Intl, no date library. */
export function formatRelativeTime(isoDate: string): string {
  const seconds = (new Date(isoDate).getTime() - Date.now()) / 1000;
  const absSeconds = Math.abs(seconds);

  if (absSeconds < 60) {
    return relativeTimeFormat.format(0, "minute");
  }

  for (const [unit, unitSeconds] of UNITS) {
    if (absSeconds >= unitSeconds) {
      const value = Math.round(seconds / unitSeconds);
      return relativeTimeFormat.format(value, unit);
    }
  }

  return relativeTimeFormat.format(Math.round(seconds / 60), "minute");
}
