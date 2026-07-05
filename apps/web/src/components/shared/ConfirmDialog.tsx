"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/UseReducedMotion";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
  /** Red/destructive styling for the confirm button (e.g. delete actions). */
  destructive?: boolean;
}

/**
 * Generic centered confirmation modal — extracted from Phase 6b's
 * ApplyConfirmDialog so the Apply-confirmation and Delete-confirmation flows
 * share one implementation instead of two near-identical Radix Dialogs.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel,
  onConfirm,
  isPending,
  destructive,
}: Readonly<ConfirmDialogProps>) {
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
                  reducedMotion ? false : { opacity: 0, scale: 0.95, y: 8 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18 }}
              >
                <Dialog.Title className="text-base font-bold text-foreground">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-1.5 text-sm text-foreground/70">
                  {description}
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
                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      destructive
                        ? "bg-status-rejected hover:opacity-90"
                        : "bg-primary-600 hover:bg-primary-700"
                    }`}
                  >
                    {isPending && pendingLabel ? pendingLabel : confirmLabel}
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
