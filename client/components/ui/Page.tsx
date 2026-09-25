import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";

/** Standard page shell: same background, same container, same vertical rhythm. */
export function Page({
  children,
  narrow = false,
  className = "",
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  return (
    <main className="z-page">
      <div className={`z-container ${narrow ? "z-container-narrow" : ""} ${className}`.trim()}>{children}</div>
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="z-page-head">
      <div>
        {eyebrow ? <span className="z-eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="z-actions">{actions}</div> : null}
    </header>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  actionLink,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  actionLink?: { href: string; label: string };
}) {
  return (
    <header className="z-section-head">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actionLink ? (
        <Link href={actionLink.href} className="z-link">
          {actionLink.label} <Icon name="arrow-right" size={16} />
        </Link>
      ) : (
        action
      )}
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="crumbs-item">
          {index > 0 ? <span className="sep" aria-hidden="true">/</span> : null}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
