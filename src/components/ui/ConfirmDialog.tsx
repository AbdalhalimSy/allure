"use client";
import Button from "@/components/ui/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[61] w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-black"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          {description ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" className="min-w-[96px]" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            className="min-w-[120px] bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
            onClick={onConfirm}
            isLoading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
