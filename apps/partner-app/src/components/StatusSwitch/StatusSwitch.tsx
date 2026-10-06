import type { PartnerStatus } from '../../types';
import type { Translation } from '../../i18n';

type StatusSwitchProps = {
  t: Translation;
  status: PartnerStatus;
  onChange: (status: PartnerStatus) => void;
};

/**
 * "Offline ⟷ Available" toggle. A native button with role="switch": Space/Enter toggles it and
 * screen readers announce "Available, switch, on/off". The state is shown by the thumb position,
 * the highlighted (bold) side label and the colour — never by colour alone.
 */
export default function StatusSwitch({ t, status, onChange }: StatusSwitchProps) {
  const isAvailable = status === 'AVAILABLE';

  return (
    <div className="status-switch">
      <p className="status-switch-title">{t.status}</p>
      <button
        type="button"
        role="switch"
        aria-checked={isAvailable}
        aria-labelledby="status-switch-available"
        aria-describedby="status-switch-hint"
        className="switch"
        onClick={() => onChange(isAvailable ? 'OFFLINE' : 'AVAILABLE')}
      >
        <span className="switch-side switch-side--off">{t.statusLabels.OFFLINE}</span>
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
        <span id="status-switch-available" className="switch-side switch-side--on">
          {t.statusLabels.AVAILABLE}
        </span>
      </button>
      <p id="status-switch-hint" className="status-switch-hint">
        {t.availabilitySwitchHint}
      </p>
    </div>
  );
}
