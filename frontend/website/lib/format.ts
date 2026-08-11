const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Formats an ISO date from the API as "Jan 2024".
 *
 * Parsed by hand rather than with `new Date(iso)`: that treats a bare
 * "2024-01-01" as UTC midnight, which renders as Dec 2023 for anyone west
 * of Greenwich. Admin-entered values are also free text in some places
 * ("2020 – 2024"), so anything unparseable is passed through unchanged.
 */
export function formatMonthYear(value: string | null | undefined): string {
  if (!value) return "";
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(value.trim());
  if (!m) return value;
  const year = m[1];
  const month = Number(m[2]);
  if (month < 1 || month > 12) return value;
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Jan 2024 — Present" for a role, using the same passthrough rules. */
export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  isCurrent: boolean
): string {
  const from = formatMonthYear(start);
  const to = isCurrent ? "Present" : formatMonthYear(end);
  if (from && to) return `${from} — ${to}`;
  return from || to;
}
