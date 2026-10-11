import type { Translation } from '../i18n';
import type { CallOutcome } from '../types';

export default function OutcomeBadge({ t, outcome }: { t: Translation; outcome: CallOutcome }) {
  const label =
    outcome === 'COMPLETED' ? t.outcomeCompleted : outcome === 'CANCELLED' ? t.outcomeCancelled : t.outcomeDeclined;
  return <span className={`badge badge--${outcome.toLowerCase()}`}>{label}</span>;
}
