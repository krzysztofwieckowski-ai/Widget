import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import { AccessibilityIcon } from '../components/icons';

type Props = { t: Translation; onRequest: () => void };

export default function WelcomeScreen({ t, onRequest }: Props) {
  return (
    <Screen
      title={t.welcomeTitle}
      icon={<AccessibilityIcon />}
      actions={
        <button type="button" className="button button--primary button--full" onClick={onRequest}>
          {t.welcomeButton}
        </button>
      }
    >
      <p className="screen-text">{t.welcomeDescription}</p>
      <p className="screen-note">{t.noSignIn}</p>
    </Screen>
  );
}
