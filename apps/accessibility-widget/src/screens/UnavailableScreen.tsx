import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import { ClockIcon } from '../components/icons';

type Props = { t: Translation; onTryAgain: () => void; onClose: () => void };

/** Shown when no support agent + translator pair is available. No call is started. */
export default function UnavailableScreen({ t, onTryAgain, onClose }: Props) {
  return (
    <Screen
      title={t.unavailableTitle}
      icon={<ClockIcon />}
      iconTone="warning"
      actions={
        <>
          <button type="button" className="button button--secondary" onClick={onClose}>
            {t.close}
          </button>
          <button type="button" className="button button--primary" onClick={onTryAgain}>
            {t.tryAgain}
          </button>
        </>
      }
    >
      <p className="screen-text">{t.unavailableDescription}</p>
      <p className="screen-note">{t.unavailableNote}</p>
    </Screen>
  );
}
