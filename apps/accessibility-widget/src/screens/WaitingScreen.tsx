import type { Translation } from '../i18n';
import Screen from '../components/Screen';

type Props = { t: Translation; onCancel: () => void };

export default function WaitingScreen({ t, onCancel }: Props) {
  return (
    <Screen
      title={t.waitingTitle}
      icon={<span className="spinner" aria-hidden="true" />}
      actions={
        <button type="button" className="button button--secondary button--full" onClick={onCancel}>
          {t.cancelRequest}
        </button>
      }
    >
      <p className="screen-text" role="status">
        {t.waitingDescription}
      </p>
    </Screen>
  );
}
