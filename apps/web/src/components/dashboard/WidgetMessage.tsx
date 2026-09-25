interface WidgetMessageProps {
  tone?: "neutral" | "error" | "positive";
  children: React.ReactNode;
}

const TONE_STYLES = {
  neutral: "border-border text-foreground/60",
  error:
    "border-eligibility-restricted/30 bg-eligibility-restricted-bg text-eligibility-restricted",
  positive:
    "border-status-offer/30 bg-status-offer-bg text-status-offer",
} as const;

/**
 * Shared empty/error message block for widgets. Each widget owns its own
 * loading/empty/error state (a failure in one must not blank the whole page),
 * and this keeps those states styled consistently rather than as bare text.
 */
export function WidgetMessage({
  tone = "neutral",
  children,
}: Readonly<WidgetMessageProps>) {
  return (
    <div
      className={`flex h-full items-center justify-center rounded-xl border border-dashed px-3 py-6 text-center text-sm font-medium ${TONE_STYLES[tone]}`}
    >
      {children}
    </div>
  );
}
