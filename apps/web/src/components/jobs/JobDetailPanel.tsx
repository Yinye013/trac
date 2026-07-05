"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import type { Job } from "@job-tracker/shared";
import { formatRelativeTime } from "@/lib/FormatRelativeTime";
import { REGION_LABELS } from "@/lib/RegionLabels";
import { sanitizeJobDescription } from "@/lib/SanitizeHtml";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { CompanyLogo } from "./CompanyLogo";
import { EligibilityBadge } from "./EligibilityBadge";

export function JobDetailPanel({
  job,
  open,
  onOpenChange,
  onApply,
}: Readonly<{
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
}>) {
  const reducedMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && job && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col overflow-y-auto border-l border-border bg-background shadow-xl sm:w-[min(90vw,32rem)]"
                initial={reducedMotion ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="flex items-start gap-3 border-b border-border p-4">
                  <CompanyLogo
                    src={job.companyLogo}
                    company={job.company}
                    size={48}
                  />
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="text-base font-bold text-foreground">
                      {job.title}
                    </Dialog.Title>
                    <p className="text-sm font-medium text-foreground/60">
                      {job.company}
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close job details"
                      className="cursor-pointer rounded-lg p-1 text-foreground/60 hover:bg-surface"
                    >
                      ✕
                    </button>
                  </Dialog.Close>
                </div>

                <Dialog.Description className="sr-only">
                  Full details for {job.title} at {job.company}
                </Dialog.Description>

                <div className="flex flex-1 flex-col gap-4 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <EligibilityBadge eligibility={job.eligibility} />
                    <span className="text-xs font-medium text-foreground/60">
                      {REGION_LABELS[job.region]}
                    </span>
                    {job.locationRaw && (
                      <span className="text-xs text-foreground/45">
                        {job.locationRaw}
                      </span>
                    )}
                  </div>

                  {job.salary && (
                    <p className="text-sm font-semibold text-foreground/80">
                      {job.salary}
                    </p>
                  )}

                  <p className="text-xs text-foreground/45">
                    Posted {formatRelativeTime(job.postedAt)}
                  </p>

                  {job.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] font-medium text-foreground/60"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div
                    className="job-description prose-sm text-sm leading-relaxed text-foreground/80 [&_a]:font-medium [&_a]:text-primary-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2"
                    // Job descriptions arrive as raw HTML from third-party
                    // job-board APIs — sanitized via DOMPurify before ever
                    // reaching innerHTML, never rendered as-is.
                    dangerouslySetInnerHTML={{
                      __html: sanitizeJobDescription(job.description),
                    }}
                  />

                </div>

                <div className="border-t border-border p-4">
                  <button
                    type="button"
                    onClick={onApply}
                    className="w-full cursor-pointer rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
