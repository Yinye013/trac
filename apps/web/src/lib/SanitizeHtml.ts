import DOMPurify from "dompurify";

/**
 * Job descriptions come back as raw HTML from third-party job-board APIs
 * (Himalayas, RemoteOK, etc.) — never trust it, always sanitize before
 * rendering via dangerouslySetInnerHTML.
 */
export function sanitizeJobDescription(html: string): string {
  if (typeof window === "undefined") {
    // DOMPurify needs a DOM; this component only renders on the client
    // (job detail panel is only shown after a user interaction), but guard
    // against SSR/build-time execution just in case.
    return "";
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "a",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}
