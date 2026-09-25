import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClass({
  variant = "primary",
  size = "md",
  block = false,
  icon = false,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: boolean;
  className?: string;
}) {
  return [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "",
    block ? "btn-block" : "",
    icon ? "btn-icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Renders a spinner and disables the control. */
  loading?: boolean;
  /** Renders a square icon-only button. */
  iconOnly?: boolean;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  prefetch?: boolean;
}

/** The single button primitive for the whole app (renders a Link when `href` is set). */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  iconOnly = false,
  className,
  href,
  type = "button",
  disabled = false,
  onClick,
  title,
  ariaLabel,
  ariaExpanded,
  ariaControls,
  prefetch,
}: ButtonProps) {
  const classes = buttonClass({ variant, size, block, icon: iconOnly, className });
  const content = (
    <>
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        prefetch={prefetch}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-busy={loading}
    >
      {content}
    </button>
  );
}
