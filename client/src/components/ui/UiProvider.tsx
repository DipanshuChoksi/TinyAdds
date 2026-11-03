"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import ConfirmDialog, { type ConfirmOptions } from "./ConfirmDialog";

/* ---------------- Toast ---------------- */
type ToastType = "success" | "error" | "info" | "warning";
type ToastItem = { id: number; type: ToastType; message: string; duration: number };

const ICONS: Record<ToastType, string> = {
  success: "bi-check-circle-fill",
  error: "bi-x-circle-fill",
  info: "bi-info-circle-fill",
  warning: "bi-exclamation-triangle-fill",
};

export type ToastApi = {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);
const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

/** Toast: `const toast = useToast(); toast.success("Saved!")` */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <UiProvider>");
  return ctx;
}

/** Swal-style confirm: `const ok = await useConfirm()({ title: "Delete?", variant: "danger" })` */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <UiProvider>");
  return ctx;
}

export default function UiProvider({ children }: { children: ReactNode }) {
  /* toasts */
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, type, message, duration }]);
    setTimeout(() => remove(id), duration);
  }, [remove]);

  const toastApi = useMemo<ToastApi>(() => ({
    success: (m, d) => push("success", m, d),
    error: (m, d) => push("error", m, d),
    info: (m, d) => push("info", m, d),
    warning: (m, d) => push("warning", m, d),
  }), [push]);

  /* confirm */
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setDialog({ ...options, resolve })), []);

  const close = (result: boolean) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return (
    <ToastContext.Provider value={toastApi}>
      <ConfirmContext.Provider value={confirm}>
        {children}

        <div className="lb-ui-toasts" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`lb-ui-toast is-${t.type}`} role="status">
              <i className={`bi ${ICONS[t.type]} lb-ui-toast-ico`}></i>
              <span className="lb-ui-toast-msg">{t.message}</span>
              <button type="button" className="lb-ui-toast-x" onClick={() => remove(t.id)} aria-label="Close"><i className="bi bi-x-lg"></i></button>
              <span className="lb-ui-toast-bar" style={{ animationDuration: `${t.duration}ms` }}></span>
            </div>
          ))}
        </div>

        <ConfirmDialog
          open={!!dialog}
          title={dialog?.title ?? ""}
          message={dialog?.message}
          icon={dialog?.icon}
          variant={dialog?.variant}
          confirmText={dialog?.confirmText}
          cancelText={dialog?.cancelText}
          onConfirm={() => close(true)}
          onCancel={() => close(false)}
        />
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}
