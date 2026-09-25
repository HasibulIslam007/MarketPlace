import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  flush = false,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return <section className={`card ${flush ? "card-flush" : ""} ${className}`.trim()}>{children}</section>;
}

export function CardHead({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="card-head">
      <div>
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-body ${className}`.trim()}>{children}</div>;
}

export function CardFoot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <footer className={`card-foot ${className}`.trim()}>{children}</footer>;
}
