import type { PartnerStatus } from '../../types';
import type { Translation } from '../../i18n';

type StatusSelectorProps = {
  t: Translation;
  status: PartnerStatus;
  onChange: (status: PartnerStatus) => void;
};

const STATUSES: PartnerStatus[] = ['AVAILABLE', 'BUSY', 'AWAY', 'OFFLINE'];

/** Native radio group (arrow keys move between options) styled as pills. */
export default function StatusSelector({ t, status, onChange }: StatusSelectorProps) {
  return (
    <fieldset className="status-selector">
      <legend className="status-selector-legend">{t.status}</legend>
      <div className="status-options">
        {STATUSES.map((value) => (
          <label key={value} className={`status-option status-badge--${value.toLowerCase()}`}>
            <input
              type="radio"
              name="partner-status"
              value={value}
              checked={status === value}
              onChange={() => onChange(value)}
            />
            <span className="status-dot" aria-hidden="true" />
            {t.statusLabels[value]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
