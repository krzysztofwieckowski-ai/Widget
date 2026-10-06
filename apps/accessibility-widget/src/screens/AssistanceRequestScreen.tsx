import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import BackButton from '../components/BackButton';
import { VideoIcon } from '../components/icons';

type Props = { t: Translation; onBack: () => void; onStartCall: () => void };

/**
 * Explains the fixed assistance model. Nothing here is selectable:
 * every request connects the user and their client with a sign language translator.
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
      <p className="screen-text">{t.requestCameraNote}</p>

      <div className="info-row">
        <VideoIcon />
        <span>
          {t.communicationMethod}: <strong>{t.videoCall}</strong>
        </span>
      </div>
    </Screen>
  );
}
