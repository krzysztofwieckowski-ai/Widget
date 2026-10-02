import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import StarRating from '../components/StarRating';
import { CheckCircleIcon } from '../components/icons';

type Props = { t: Translation; onClose: () => void };

export default function CallEndedScreen({ t, onClose }: Props) {
  return (
    <Screen
      title={t.endedTitle}
      icon={<CheckCircleIcon />}
      actions={
        <button type="button" className="button button--primary button--full" onClick={onClose}>
          {t.close}
        </button>
      }
    >
      <p className="screen-text">{t.endedDescription}</p>
      <StarRating t={t} />
    </Screen>
  );
}
