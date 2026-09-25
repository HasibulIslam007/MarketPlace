import Link from "next/link";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

/**
 * Shared pill tabs. Renders links when `hrefFor` is provided (server-side filters)
 * or buttons with `onChange` when it is not (client-side tabs).
 */
export default function Tabs({
  items,
  active,
  onChange,
  ariaLabel,
  hrefFor,
}: {
  items: TabItem[];
  active: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
  hrefFor?: (id: string) => string;
}) {
  if (hrefFor) {
    return (
      <nav className="tabs" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={hrefFor(item.id)}
              className={`tab ${isActive ? "is-active" : ""}`.trim()}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
              {typeof item.count === "number" ? <span className="tab-count">{item.count}</span> : null}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          className="tab"
          id={`tab-${item.id}`}
          aria-selected={active === item.id}
          aria-controls={`panel-${item.id}`}
          onClick={onChange ? () => onChange(item.id) : undefined}
        >
          {item.label}
          {typeof item.count === "number" ? <span className="tab-count">{item.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

