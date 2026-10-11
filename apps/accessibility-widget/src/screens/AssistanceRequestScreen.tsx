import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import { HeadsetIcon, TranslatorIcon, PlusIcon, VideoIcon } from '../components/icons';

type Props = { t: Translation; onBack: () => void; onStartCall: () => void };

/**
 * Explains the fixed assistance model. Nothing here is selectable:
 * the partner and the translator always come together. "Start video call" takes the customer to the call page.
 */
export default function AssistanceRequestScreen({ t, onBack, onStartCall }: Props) {
  return (
    <Screen
      title={t.requestTitle}
      actions={
        <>
          <BackButton label={t.back} onClick={onBack} />
          <button type="button" className="button button--primary" onClick={onStartCall}>
            <VideoIcon />
            {t.startCall}
          </button>
        </>
      }
    >
      <p className="screen-text">{t.requestDescription}</p>

      <ul className="people-list">
        <li className="person-card">
          <span className="person-icon person-icon--partner">
            <HeadsetIcon />
          </span>
          <span>
            <strong className="person-name">{t.partner}</strong>
            <span className="person-description">{t.partnerDescription}</span>
          </span>
        </li>
        <li className="people-plus" aria-hidden="true">
          <PlusIcon />
        </li>
        <li className="person-card">
          <span className="person-icon person-icon--translator">
            <TranslatorIcon />
          </span>
          <span>
            <strong className="person-name">{t.translator}</strong>
            <span className="person-description">{t.translatorDescription}</span>
          </span>
        </li>
      </ul>

      <div className="info-row">
        <VideoIcon />
        <span>
          {t.communicationMethod}: <strong>{t.videoCall}</strong>
        </span>
      </div>
    </Screen>
  );
}
