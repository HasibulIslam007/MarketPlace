import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "soft" | "success" | "warning" | "danger" | "info" | "lime";

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "",
  brand: "badge-brand",
  soft: "badge-soft",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  info: "badge-info",
  lime: "badge-lime",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`badge ${TONE_CLASS[tone]} ${className}`.trim()}>{children}</span>;
}

/** Shared stock label so every product surface describes availability identically. */
export function stockBadge(stock: number): { tone: BadgeTone; label: string } {
  if (stock <= 0) return { tone: "danger", label: "Out of stock" };
  if (stock <= 5) return { tone: "warning", label: `Only ${stock} left` };
  return { tone: "success", label: "In stock" };
}

const NEW_WINDOW_DAYS = 30;

/** A product counts as "New" when it was added within the last 30 days. */
export function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}
