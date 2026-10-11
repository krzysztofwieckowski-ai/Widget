import { useEffect, useRef, useState } from 'react';
import type { Translation } from '../i18n';
import type { CallResult, IncomingCall, Language } from '../types';
import CallControls from '../components/CallControls';
import ConfirmDialog from '../components/ConfirmDialog';
import ParticipantTile, { type ParticipantState } from '../components/ParticipantTile';
import {
  PARTNER_FOUND_MS,
  PARTNER_JOINED_MS,
  USER_FOUND_MS,
  USER_JOINED_MS,
  localName,
  mockTranslator,
} from '../mock/translator';
import { formatDuration } from '../utils';

type CallPageProps = {
  t: Translation;
  language: Language;
  call: IncomingCall;
  onEnd: (result: CallResult) => void;
};

const STARTED_BANNER_MS = 2500;

/**
 * Translator's view of the 3-way call, same pattern as the partner view:
 * the translator is in the room right after accepting, the user joins after ~4 s and the partner
 * after another 4 s. No video until all three are in; then the call starts and the timer runs.
 */
export default function CallPage({ t, language, call, onEnd }: CallPageProps) {
  const [userState, setUserState] = useState<ParticipantState>('searching');
  const [partnerState, setPartnerState] = useState<ParticipantState>('searching');
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showStartedBanner, setShowStartedBanner] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  const isStarted = userState === 'connected' && partnerState === 'connected';

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setUserState('connecting'), USER_FOUND_MS),
      window.setTimeout(() => setUserState('connected'), USER_JOINED_MS),
      window.setTimeout(() => setPartnerState('connecting'), PARTNER_FOUND_MS),
      window.setTimeout(() => setPartnerState('connected'), PARTNER_JOINED_MS),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (!isStarted) return;
    startedAtRef.current = Date.now();
    setShowStartedBanner(true);
    const bannerTimer = window.setTimeout(() => setShowStartedBanner(false), STARTED_BANNER_MS);
    const interval = window.setInterval(() => {
      if (startedAtRef.current) setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 500);
    return () => {
      window.clearTimeout(bannerTimer);
      window.clearInterval(interval);
    };
  }, [isStarted]);

  const stateLabel = (state: ParticipantState) =>
    state === 'connected' ? t.stateConnected : state === 'connecting' ? t.stateConnecting : t.stateSearching;

  const waitingText = userState !== 'connected' ? t.waitingForUser : t.waitingForPartner;
  const statusText = isStarted ? t.callStarted : waitingText;

  const userName = localName(call.user, language);
  const partnerName = localName(call.partner, language);
  const youName = localName(mockTranslator, language);

  const finish = () => {
    setConfirmOpen(false);
    const elapsed = startedAtRef.current ? Math.floor((Date.now() - startedAtRef.current) / 1000) : 0;
    onEnd({ started: isStarted, durationSeconds: elapsed });
  };

  return (
    <section className="call" aria-labelledby="call-title">
      <header className="call-header">
        <div className="call-header-text">
          <h1 id="call-title" className="call-title">
            {t.callTitle}
          </h1>
          <p className="call-subtitle">{localName(call.company, language)}</p>
        </div>
        <span
          className={isStarted ? 'call-pill call-pill--live' : 'call-pill'}
          role={isStarted ? 'timer' : undefined}
          aria-label={isStarted ? t.callDuration : undefined}
        >
          {isStarted ? formatDuration(seconds) : t.notStarted}
        </span>
      </header>

      <p className="visually-hidden" role="status" aria-live="polite">
        {statusText}
      </p>

      <div className="stage">
        <ul className="tiles">
          <ParticipantTile
            position="main"
            variant="user"
            name={userName}
            role={t.roleUser}
            initial={userName.charAt(0)}
            photo="/images/pwd.jpg"
            showVideo={isStarted}
            state={userState}
            stateLabel={stateLabel(userState)}
            mutedLabel={t.mutedLabel}
            cameraOffLabel={t.cameraOff}
          />
          <ParticipantTile
            position="start"
            variant="translator"
            name={t.you}
            role={t.roleYou}
            initial={youName.charAt(0)}
            photo="/images/translator.jpg"
            showVideo={isStarted}
            state="connected"
            stateLabel={t.stateConnected}
            muted={muted}
            cameraOff={cameraOff}
            mutedLabel={t.mutedLabel}
            cameraOffLabel={t.cameraOff}
          />
          <ParticipantTile
            position="end"
            variant="partner"
            name={partnerName}
            role={t.rolePartner}
            initial={partnerName.charAt(0)}
            photo="/images/partner.jpg"
            showVideo={isStarted}
            state={partnerState}
            stateLabel={stateLabel(partnerState)}
            mutedLabel={t.mutedLabel}
            cameraOffLabel={t.cameraOff}
          />
        </ul>

        {!isStarted && (
          <div className="call-overlay-card">
            <span className="spinner spinner--large" aria-hidden="true" />
            <h2 className="call-overlay-title">{t.lobbyTitle}</h2>
            <p className="call-overlay-text">{t.lobbyNote}</p>
            <p className="call-overlay-text call-overlay-text--hint">{t.signNote}</p>
          </div>
        )}

        {showStartedBanner && <p className="call-banner">{t.callStarted}</p>}
      </div>

      <CallControls
        t={t}
        muted={muted}
        cameraOff={cameraOff}
        endLabel={isStarted ? t.endCall : t.leaveCall}
        onToggleMute={() => setMuted((value) => !value)}
        onToggleCamera={() => setCameraOff((value) => !value)}
        onEndCall={() => setConfirmOpen(true)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={isStarted ? t.endCallTitle : t.leaveCallTitle}
        description={isStarted ? t.endCallDescription : t.leaveCallDescription}
        cancelLabel={t.cancel}
        confirmLabel={isStarted ? t.endCall : t.leaveCall}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={finish}
      />
    </section>
  );
}
