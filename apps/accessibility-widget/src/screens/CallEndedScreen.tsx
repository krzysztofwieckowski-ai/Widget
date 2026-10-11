import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import StarRating from '../components/StarRating';
import { CheckCircleIcon } from '../components/icons';

type Props = { t: Translation; onClose: () => void };

/** Call ended + rating. The Close button is large and sits right under the rating instead of at the bottom edge. */
export default function CallEndedScreen({ t, onClose }: Props) {
  return (
    <Screen title={t.endedTitle} icon={<CheckCircleIcon />} className="screen--centered">
      <p className="screen-text">{t.endedDescription}</p>
      <StarRating t={t} />
      <button type="button" className="button button--primary big-button" onClick={onClose}>
        {t.close}
      </button>
    </Screen>
  );
}
