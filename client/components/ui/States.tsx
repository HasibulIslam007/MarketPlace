import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";

type Tone = "brand" | "success" | "warning" | "danger" | "info";

const STATE_TONE: Record<Tone, string> = {
  brand: "",
  success: "z-state-success",
  warning: "z-state-warning",
  danger: "z-state-danger",
  info: "",
};

/** One empty-state component for the whole app. */
export function EmptyState({
  icon = "package",
  title,
  text,
  action,
  compact = false,
}: {
  icon?: IconName;
  title: string;
  text?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`z-state ${compact ? "z-state-compact" : ""}`.trim()}>
      <span className="z-state-icon">
        <Icon name={icon} size={28} />
      </span>
      <h2 className="z-state-title">{title}</h2>
      {text ? <p className="z-state-text">{text}</p> : null}
      {action ? <div className="z-state-actions">{action}</div> : null}
    </div>
  );
}

/** Terminal outcome screen (payment / order status). */
export function ResultState({
  tone = "brand",
  icon = "check-circle",
  title,
  text,
  meta,
  action,
}: {
  tone?: Tone;
  icon?: IconName;
  title: string;
  text?: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={`z-state ${STATE_TONE[tone]}`.trim()}>
      <span className="z-state-icon">
        <Icon name={icon} size={28} />
      </span>
      <h1 className="z-state-title">{title}</h1>
      {text ? <p className="z-state-text">{text}</p> : null}
      {meta ? <p className="z-state-meta">{meta}</p> : null}
      {action ? <div className="z-state-actions">{action}</div> : null}
    </div>
  );
}

/** Retryable error screen used by every error boundary. */
export function ErrorState({
  title = "Something went wrong",
  text = "We could not load this page. Please try again.",
  retryLabel = "Try again",
  onRetry,
}: {
  title?: string;
  text?: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="z-state z-state-danger">
      <span className="z-state-icon">
        <Icon name="alert" size={28} />
      </span>
      <h2 className="z-state-title">{title}</h2>
      <p className="z-state-text">{text}</p>
      {onRetry ? (
        <div className="z-state-actions">
          <Button variant="secondary" onClick={onRetry}>
            <Icon name="refresh" size={18} />
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="z-loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      {label}
    </div>
  );
}

export function Banner({
  tone = "info",
  icon,
  children,
}: {
  tone?: Tone;
  icon?: IconName;
  children: ReactNode;
}) {
  const toneClass = tone === "brand" || tone === "info" ? "z-banner-info" : `z-banner-${tone}`;
  return (
    <div className={`z-banner ${toneClass}`} role={tone === "danger" ? "alert" : undefined}>
      <Icon name={icon ?? (tone === "success" ? "check-circle" : tone === "danger" ? "alert-circle" : "info")} />
      <span>{children}</span>
    </div>
  );
}

export function Skeleton({
  width,
  height = 16,
  radius,
  className = "",
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ display: "block", width: width ?? "100%", height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

/** Shared product-grid skeleton so every product list loads identically. */
export function SkeletonProductGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="z-cards" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="pcard">
          <div className="pcard-media">
            <Skeleton height="100%" radius={0} />
          </div>
          <div className="pcard-body">
            <Skeleton width="40%" height={12} />
            <Skeleton width="80%" height={18} />
            <Skeleton width="100%" height={12} />
            <Skeleton width="35%" height={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
