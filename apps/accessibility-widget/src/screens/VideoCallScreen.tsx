import { useEffect, useState } from 'react';
import type { Translation } from '../i18n';
import ParticipantTile from '../components/ParticipantTile';
import CallControls from '../components/CallControls';
import { HeadsetIcon, TranslatorIcon, UserIcon } from '../components/icons';

type Props = { t: Translation; onEndCall: () => void };

function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/** One shared mock call: Customer + Support Agent + Translator. */
export default function VideoCallScreen({ t, onEndCall }: Props) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="call" aria-labelledby="screen-title">
      <div className="call-header">
        <div>
          <h2 id="screen-title" className="call-title" tabIndex={-1} data-screen-heading>
            {t.callTitle}
          </h2>
          <p className="call-meta">
            <span className="call-status">
              <span className="call-status-dot" aria-hidden="true" />
              {t.callConnected}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t.callParticipants}</span>
          </p>
        </div>
        <time className="call-timer" dir="ltr">
          {formatDuration(seconds)}
        </time>
      </div>

      <div className="call-stage">
        <p className="call-shared-note">{t.callSharedNote}</p>
        <ul className="call-tiles" aria-label={t.callParticipants}>
          <ParticipantTile
            variant="agent"
            name={t.agent}
            avatar={<HeadsetIcon />}
            cameraOffLabel={t.cameraOff}
            mutedLabel={t.micOff}
          />
          <ParticipantTile
            variant="translator"
            name={t.translator}
            avatar={<TranslatorIcon />}
            cameraOffLabel={t.cameraOff}
            mutedLabel={t.micOff}
          />
          <ParticipantTile
            variant="self"
            name={t.you}
            avatar={<UserIcon />}
            muted={muted}
            cameraOff={cameraOff}
            cameraOffLabel={t.cameraOff}
            mutedLabel={t.micOff}
          />
        </ul>
      </div>

      <CallControls
        t={t}
        muted={muted}
        cameraOff={cameraOff}
        onToggleMute={() => setMuted((m) => !m)}
        onToggleCamera={() => setCameraOff((c) => !c)}
        onEndCall={onEndCall}
      />
    </section>
  );
}
