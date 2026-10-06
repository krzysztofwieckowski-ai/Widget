import type { PartnerStatus } from '../../types';

type StatusBadgeProps = { status: PartnerStatus; label: string };

/** Coloured dot + text label: the status is never conveyed by colour alone. */
export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
