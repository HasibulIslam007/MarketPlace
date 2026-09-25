"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  text?: string;
}

interface ToastApi {
  success: (title: string, text?: string) => void;
  error: (title: string, text?: string) => void;
  info: (title: string, text?: string) => void;
}

const ToastContext = createContext<ToastApi | undefined>(undefined);
const TOAST_TTL = 4500;
let toastId = 0;

/** App-wide notification system. Mounted once in the root layout. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, title: string, text?: string) => {
      toastId += 1;
      const id = toastId;
      setToasts((current) => [...current, { id, tone, title, text }]);
      window.setTimeout(() => dismiss(id), TOAST_TTL);
    },
    [dismiss]
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, text) => push("success", title, text),
      error: (title, text) => push("error", title, text),
      info: (title, text) => push("info", title, text),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-viewport" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tone}`} role="status">
            <Icon
              name={toast.tone === "success" ? "check-circle" : toast.tone === "error" ? "alert-circle" : "info"}
            />
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              {toast.text ? <p className="toast-text">{toast.text}</p> : null}
            </div>
            <button type="button" className="toast-close" aria-label="Dismiss" onClick={() => dismiss(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
