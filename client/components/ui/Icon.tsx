import type { ReactNode } from "react";

export type IconName =
  | "search"
  | "close"
  | "arrow-right"
  | "arrow-left"
  | "chevron-down"
  | "check"
  | "check-circle"
  | "alert"
  | "alert-circle"
  | "info"
  | "bag"
  | "heart"
  | "sun"
  | "menu"
  | "trash"
  | "plus"
  | "minus"
  | "package"
  | "users"
  | "clipboard"
  | "upload"
  | "image"
  | "sparkles"
  | "truck"
  | "refresh"
  | "logout"
  | "user"
  | "home"
  | "lock"
  | "star"
  | "filter"
  | "shield";

const PATHS: Record<IconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  "arrow-right": <path d="M4 12h15M13 6l6 6-6 6" />,
  "arrow-left": <path d="M20 12H5M11 18l-6-6 6-6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  "check-circle": <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5L16 9.5" /></>,
  alert: <><path d="M12 4.5 2.8 20h18.4L12 4.5Z" /><path d="M12 10v4M12 17.2v.1" /></>,
  "alert-circle": <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.2v.1" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.8v.1" /></>,
  bag: <><path d="M5 8.5h14l1 12H4l1-12Z" /><path d="M8.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" /></>,
  heart: <path d="M20.84 8.61c0 5.08-8.84 10.39-8.84 10.39S3.16 13.69 3.16 8.61A4.61 4.61 0 0 1 12 6.28a4.61 4.61 0 0 1 8.84 2.33Z" />,
  sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2.5v2M12 19.5v2M4.58 4.58l1.42 1.42M18 18l1.42 1.42M2.5 12h2M19.5 12h2M4.58 19.42 6 18M18 6l1.42-1.42" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  trash: <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  package: <><path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></>,
  users: <><circle cx="9" cy="9" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M17 11.5a3 3 0 1 0 0-6M21 20a5 5 0 0 0-4-4.9" /></>,
  clipboard: <><path d="M9 4.5h6M9 4.5a2 2 0 0 0-2 2v.5M15 4.5a2 2 0 0 1 2 2v.5M6.5 7h11v13h-11z" /><path d="M9.5 12h5M9.5 15.5h5" /></>,
  upload: <path d="M12 16V5M8 9l4-4 4 4M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />,
  image: <><rect x="4" y="4.5" width="16" height="15" rx="2.5" /><path d="m5.5 16 4-4 3 3 2.5-2.5 4.5 4.5" /><circle cx="9" cy="9.5" r="1.2" /></>,
  sparkles: <><path d="M12 4.5 13.6 9l4.4 1.6-4.4 1.6L12 16.5l-1.6-4.3L6 10.6 10.4 9 12 4.5Z" /><path d="M18.5 4v3M17 5.5h3M6 17v2.5M4.75 18.25h2.5" /></>,
  truck: <><path d="M3 7h10v10H3zM13 10h4.2l2.8 3v4h-7z" /><circle cx="7" cy="18.5" r="1.6" /><circle cx="17" cy="18.5" r="1.6" /></>,
  refresh: <path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4.5h-4.5" />,
  logout: <path d="M15 4.5h3.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H15M11 15.5l3.5-3.5L11 8.5M14.5 12H4" />,
  user: <><circle cx="12" cy="8.5" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V20H4z" /><path d="M9.5 20v-6h5v6" /></>,
  lock: <><rect x="4.5" y="10" width="15" height="10.5" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></>,
  star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.6Z" fill="currentColor" stroke="none" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  shield: <><path d="M12 3.5 5 6v5.5c0 4.3 3 8 7 9 4-1 7-4.7 7-9V6l-7-2.5Z" /><path d="m9.2 12 2 2 3.6-3.8" /></>,
};

export default function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
