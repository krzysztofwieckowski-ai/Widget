import type { CallOutcome } from '../../types';
import type { Translation } from '../../i18n';
import { CheckCircleIcon, CloseIcon, PhoneEndIcon } from '../icons';

type OutcomeBadgeProps = { t: Translation; outcome: CallOutcome };

/** Icon + text per outcome, so the result is never conveyed by colour alone. */
export default function OutcomeBadge({ t, outcome }: OutcomeBadgeProps) {
  switch (outcome) {
    case 'COMPLETED':
      return (
        <span className="outcome-badge">
          <CheckCircleIcon />
          {t.completed}
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="outcome-badge outcome-badge--muted">
          <CloseIcon />
          {t.cancelled}
        </span>
      );
    case 'DECLINED':
      return (
        <span className="outcome-badge outcome-badge--declined">
          <PhoneEndIcon />
          {t.declined}
        </span>
      );
  }
}
