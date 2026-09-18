"use client";

// Confirmation for irreversible actions (delete a board, delete an account). Built on
// Base UI's AlertDialog so focus is trapped and Escape/Cancel always work. `onConfirm`
// returns an error sentence to show, or nothing on success; children can add fields
// (e.g. a password) that the caller reads in onConfirm.
import { useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";

export function ConfirmDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  pendingLabel = "Deleting…",
  onConfirm,
  children,
}: {
  triggerLabel: string;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  onConfirm: () => Promise<string | void>;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setPending(true);
    setError(null);
    const result = await onConfirm().catch(() => "Something went wrong. Please try again.");
    setPending(false);
    if (typeof result === "string") setError(result);
    else setOpen(false);
  };

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <AlertDialog.Trigger className="w-full rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-[100] bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <AlertDialog.Popup className="fixed bottom-0 left-1/2 z-[101] w-full max-w-md -translate-x-1/2 rounded-t-3xl bg-white p-6 pb-8 shadow-2xl transition-[opacity,transform] duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:rounded-3xl sm:pb-6">
          <AlertDialog.Title className="font-heading text-2xl text-[var(--brand-ink)]">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-black/60">{description}</AlertDialog.Description>
          {children ? <div className="mt-4">{children}</div> : null}
          {error ? (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex gap-3">
            <AlertDialog.Close
              disabled={pending}
              className="flex-1 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold disabled:opacity-50"
            >
              Cancel
            </AlertDialog.Close>
            <button
              type="button"
              onClick={confirm}
              disabled={pending}
              className="flex-1 rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
            >
              {pending ? pendingLabel : confirmLabel}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
