"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import type { Job } from "@job-tracker/shared";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { CompanyLogo } from "./CompanyLogo";
import { JobDetailContent } from "./JobDetailContent";

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

                <div className="flex-1 p-4">
                  <JobDetailContent job={job} />
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
