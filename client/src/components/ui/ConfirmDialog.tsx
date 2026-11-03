"use client";

import { useEffect } from "react";

export type ConfirmOptions = {
  title: string;
  message?: string;
  /** bootstrap-icons class, e.g. "bi-trash3-fill" */
  icon?: string;
  /** danger = red (delete), primary = website colour (logout etc.) */
  variant?: "danger" | "primary";
  confirmText?: string;
  cancelText?: string;
};

type Props = ConfirmOptions & { open: boolean; onConfirm: () => void; onCancel: () => void };

/** SweetAlert-style confirm popup. Use through `useConfirm()` instead of rendering directly. */
export default function ConfirmDialog({ open, title, message, icon = "bi-question-circle-fill", variant = "primary", confirmText = "Yes", cancelText = "Cancel", onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="lb-ui-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()} role="alertdialog" aria-modal="true" aria-label={title}>
      <div className={`lb-ui-confirm is-${variant}`}>
        <span className="lb-ui-confirm-spark s1" aria-hidden="true">✦</span>
        <span className="lb-ui-confirm-spark s2" aria-hidden="true">✦</span>
        <span className="lb-ui-confirm-spark s3" aria-hidden="true">✦</span>
        <div className="lb-ui-confirm-icon"><i className={`bi ${icon}`}></i></div>
        <h4 className="lb-ui-confirm-title">{title}</h4>
        {message && <p className="lb-ui-confirm-msg">{message}</p>}
        <div className="lb-ui-confirm-actions">
          <button type="button" className="lb-ui-btn-cancel" onClick={onCancel}>{cancelText}</button>
          <button type="button" className="lb-ui-btn-ok" onClick={onConfirm} autoFocus>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
