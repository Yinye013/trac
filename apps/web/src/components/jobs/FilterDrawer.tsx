"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import type { JobFilters } from "@/lib/JobsQuery";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { JobFiltersForm } from "./JobFiltersForm";

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function FilterDrawer({
  filters,
  onChange,
  open,
  onOpenChange,
}: Readonly<{
  filters: JobFilters;
  onChange: (next: JobFilters) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const reducedMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open filters"
          className="fixed bottom-20 right-4 z-30 flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-700 lg:hidden"
        >
          <FilterIcon className="h-4 w-4" />
          Filters
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(85vw,20rem)] flex-col overflow-y-auto border-l border-border bg-background p-4 shadow-xl lg:hidden"
                initial={reducedMotion ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-sm font-bold text-foreground">
                    Filters
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close filters"
                      className="cursor-pointer rounded-lg p-1 text-foreground/60 hover:bg-surface"
                    >
                      ✕
                    </button>
                  </Dialog.Close>
                </div>
                <JobFiltersForm filters={filters} onChange={onChange} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
