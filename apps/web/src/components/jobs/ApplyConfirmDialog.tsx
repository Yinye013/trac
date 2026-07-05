"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/UseReducedMotion";

interface ApplyConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  company: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function ApplyConfirmDialog({
  open,
  onOpenChange,
  jobTitle,
  company,
  onConfirm,
  isPending,
}: Readonly<ApplyConfirmDialogProps>) {
  const reducedMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
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
                className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-5 shadow-xl"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, scale: 0.95, y: 8 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18 }}
              >
                <Dialog.Title className="text-base font-bold text-foreground">
                  Log this application?
                </Dialog.Title>
                <Dialog.Description className="mt-1.5 text-sm text-foreground/70">
                  This logs <span className="font-medium">{jobTitle}</span> at{" "}
                  <span className="font-medium">{company}</span> as applied,
                  then opens the job posting in a new tab.
                </Dialog.Description>

                <div className="mt-5 flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isPending}
                    className="cursor-pointer rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? "Logging..." : "Confirm & open"}
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
