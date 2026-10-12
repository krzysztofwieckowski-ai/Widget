import { useEffect, useRef, useState } from 'react';
import type { Translation } from '../i18n';
import ParticipantTile, { type ParticipantState } from '../components/ParticipantTile';
import CallControls from '../components/CallControls';
import ConfirmDialog from '../components/ConfirmDialog';
import { AccessibilityIcon, CheckCircleIcon, HeadsetIcon, TranslatorIcon } from '../components/icons';

type Props = {
  t: Translation;
  /** Demo scenario: false = nobody can be found, so the lobby ends in the "unavailable" screen. */
  available: boolean;
  onEndCall: () => void;
  /** The customer leaves before everyone joined: no call is started. */
  onLeave: () => void;
  onUnavailable: () => void;
};

/**
 * Simulated lobby timeline (ms from opening the page). Mock only. People join one after the other, 4 seconds
 * apart: the translator after 4 s, the partner after another 4 s (the call opens at 8 s).
 */
const TRANSLATOR_FOUND_MS = 2500;
const TRANSLATOR_JOINED_MS = 4000;
const PARTNER_FOUND_MS = 6500;
const PARTNER_JOINED_MS = 8000;
/** In the "unavailable" scenario the search ends without finding anyone. */
const SEARCH_FAILED_MS = 4000;

/** How long the "call has started" confirmation stays over the cameras. */
const STARTED_BANNER_MS = 2500;

const TOTAL_PARTICIPANTS = 3;

function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/**
 * One shared mock call with three participants: the translator (main, large view),
 * the partner and you (two smaller views in the bottom corners).
 *
 * Lobby → call, like on the partner's side: the translator and the partner join one after the other
 * (searching → connecting → connected). The call only starts — timer running, "Connected" — once all three
 * are present.
 */
export default function VideoCallScreen({ t, available, onEndCall, onLeave, onUnavailable }: Props) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [translatorState, setTranslatorState] = useState<ParticipantState>('searching');
  const [partnerState, setPartnerState] = useState<ParticipantState>('searching');
  const [showStartedBanner, setShowStartedBanner] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onUnavailableRef = useRef(onUnavailable);
  onUnavailableRef.current = onUnavailable;

  const isStarted = translatorState === 'connected' && partnerState === 'connected';

  // Simulated joining of the translator and the partner.
  useEffect(() => {
    if (!available) {
      const id = window.setTimeout(() => onUnavailableRef.current(), SEARCH_FAILED_MS);
      return () => window.clearTimeout(id);
    }
    const ids = [
      window.setTimeout(() => setTranslatorState('connecting'), TRANSLATOR_FOUND_MS),
      window.setTimeout(() => setTranslatorState('connected'), TRANSLATOR_JOINED_MS),
      window.setTimeout(() => setPartnerState('connecting'), PARTNER_FOUND_MS),
      window.setTimeout(() => setPartnerState('connected'), PARTNER_JOINED_MS),
    ];
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [available]);

  // Briefly confirm over the cameras that everyone joined, then get out of the way.
  useEffect(() => {
    if (!isStarted) return;
    setShowStartedBanner(true);
    const id = window.setTimeout(() => setShowStartedBanner(false), STARTED_BANNER_MS);
    return () => window.clearTimeout(id);
  }, [isStarted]);

  // The call timer only runs once the call has started.
  useEffect(() => {
    if (!isStarted) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [isStarted]);

  const stateLabels: Record<ParticipantState, string> = {
    connected: t.stateJoined,
    searching: t.stateSearching,
    connecting: t.stateConnecting,
  };
  const joinedCount = 1 + (translatorState === 'connected' ? 1 : 0) + (partnerState === 'connected' ? 1 : 0);
  const partnerFound = partnerState !== 'searching';

  const statusText = isStarted
    ? t.callSharedNote
    : translatorState === 'searching'
      ? t.lobbySearching
      : translatorState === 'connecting'
        ? t.lobbyTranslatorConnecting
        : partnerState === 'searching'
          ? t.lobbyPartnerSearching
          : t.lobbyPartnerConnecting;

  return (
    <section className={`call${isStarted ? '' : ' call--lobby'}`} aria-labelledby="screen-title">
      <div className="call-header">
        <div className="call-heading">
          <div className="call-title-row">
            <h2 id="screen-title" className="call-title" tabIndex={-1} data-screen-heading>
              {t.callTitle}
            </h2>
            <p className="call-shared-note">{t.callSharedNote}</p>
          </div>
          <p className="call-meta">
            {isStarted ? (
              <>
                <span className="call-status">
                  <span className="call-status-dot" aria-hidden="true" />
                  {t.callConnected}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.callParticipants}</span>
              </>
            ) : (
              <>
                <span className="call-status">
                  <span className="call-status-dot call-status-dot--waiting" aria-hidden="true" />
                  {t.waitingForParticipants}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.joinedCount(joinedCount, TOTAL_PARTICIPANTS)}</span>
              </>
            )}
          </p>
        </div>
        {isStarted ? (
          <time className="call-timer" dir="ltr">
            <span className="visually-hidden">{t.callDuration}: </span>
            {formatDuration(seconds)}
          </time>
        ) : (
          <p className="call-timer call-timer--waiting">{t.callNotStarted}</p>
        )}
      </div>

      <div className="call-stage">
        {/* Lobby status in the middle of the cameras, where the customer is looking.
            Visual only: the same text is announced by the live region below. */}
        {(!isStarted || showStartedBanner) && (
          <div className="call-overlay" aria-hidden="true">
            <div className={`call-overlay-card${isStarted ? ' call-overlay-card--started' : ''}`}>
              {isStarted ? <CheckCircleIcon className="call-overlay-icon" /> : <span className="spinner" />}
              <p className="call-overlay-title">{isStarted ? t.callStarted : statusText}</p>
              <p className="call-overlay-text">
                {isStarted
                  ? t.callSharedNote
                  : `${t.joinedCount(joinedCount, TOTAL_PARTICIPANTS)} · ${t.lobbyNote}`}
              </p>
            </div>
          </div>
        )}

        <ul className="call-tiles" aria-label={t.callParticipants}>
          <ParticipantTile
            variant="translator"
            name={t.translator}
            avatar={<TranslatorIcon />}
            roleLabel={t.translator}
            state={translatorState}
            stateLabel={stateLabels[translatorState]}
            isStarted={isStarted}
            cameraOffLabel={t.cameraOff}
            mutedLabel={t.micOff}
          />
          <ParticipantTile
            variant="partner"
            name={partnerFound ? `${t.partner}: ${t.partnerName}` : t.partner}
            avatar={<HeadsetIcon />}
            roleLabel={t.partner}
            state={partnerState}
            stateLabel={stateLabels[partnerState]}
            isStarted={isStarted}
            cameraOffLabel={t.cameraOff}
            mutedLabel={t.micOff}
          />
          <ParticipantTile
            variant="self"
            name={t.you}
            avatar={<AccessibilityIcon />}
            roleLabel={t.user}
            stateLabel={stateLabels.connected}
            isStarted={isStarted}
            muted={muted}
            cameraOff={cameraOff}
            cameraOffLabel={t.cameraOff}
            mutedLabel={t.micOff}
          />
        </ul>
      </div>

      <p className="visually-hidden" role="status">
        {isStarted ? t.callStarted : statusText}
      </p>

      <CallControls
        t={t}
        muted={muted}
        cameraOff={cameraOff}
        endLabel={isStarted ? t.endCall : t.leaveCall}
        onToggleMute={() => setMuted((m) => !m)}
        onToggleCamera={() => setCameraOff((c) => !c)}
        onEndCall={() => setConfirmOpen(true)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={isStarted ? t.endCallTitle : t.leaveCallTitle}
        description={isStarted ? t.endCallDescription : t.leaveCallDescription}
        cancelLabel={t.cancel}
        confirmLabel={isStarted ? t.endCall : t.leaveCall}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          if (isStarted) onEndCall();
          else onLeave();
        }}
      />
    </section>
  );
}
