import { useEffect, useState } from 'react';
import type { IncomingCall, Language, Partner, TranslatorState } from '../../types';
import type { Translation } from '../../i18n';
import { mockTranslator, TRANSLATOR_CONNECT_MS, TRANSLATOR_SEARCH_MS } from '../../mock/translator';
import { displayName, formatDuration } from '../../utils/format';
import ParticipantCard from '../../components/ParticipantCard/ParticipantCard';
import CallControls from '../../components/CallControls/CallControls';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { AccessibilityIcon, HeadsetIcon, TranslatorIcon } from '../../components/icons';

/** `started: false` = the partner left the lobby before every role joined. */
export type CallResult = { started: boolean; durationSeconds: number };

type CallPageProps = {
  t: Translation;
  language: Language;
  partner: Partner;
  call: IncomingCall;
  onEndCall: (result: CallResult) => void;
};

const TOTAL_PARTICIPANTS = 3;

/**
 * The partner's side of the shared call. Mock only: no audio, video or WebRTC.
 *
 * Lobby → call: when the partner joins, the PWD user is already there and a translator is matched
 * automatically (searching → connecting → connected). The call only starts — timer running,
 * "Connected" — once all three roles are present, matching the widget's one-call rule.
 */
export default function CallPage({ t, language, partner, call, onEndCall }: CallPageProps) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [translatorState, setTranslatorState] = useState<TranslatorState>('searching');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isStarted = translatorState === 'connected';

  // Simulated translator matching: searching → found & connecting → connected.
  useEffect(() => {
    if (translatorState === 'connected') return;
    const [next, delay] =
      translatorState === 'searching'
        ? (['connecting', TRANSLATOR_SEARCH_MS] as const)
        : (['connected', TRANSLATOR_CONNECT_MS] as const);
    const id = window.setTimeout(() => setTranslatorState(next), delay);
    return () => window.clearTimeout(id);
  }, [translatorState]);

  // The call timer only runs once the call has started.
  useEffect(() => {
    if (!isStarted) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [isStarted]);

  const translatorName = displayName(mockTranslator, language);
  const translatorLanguages = mockTranslator.languages.map((l) => t.callLanguages[l]).join(' / ');
  const translatorFound = translatorState !== 'searching';
  const joinedCount = isStarted ? 3 : 2;

  const statusText = {
    searching: t.searchingTranslator,
    connecting: t.translatorFound(translatorName, translatorLanguages),
    connected: `${t.translatorJoined(translatorName, translatorLanguages)} ${t.callStarted}`,
  }[translatorState];

  return (
    <section className={`call${isStarted ? '' : ' call--lobby'}`} aria-labelledby="call-title">
      <div className="call-inner">
        <div className="call-header">
          <div className="call-heading">
            <h1 id="call-title" className="call-title" tabIndex={-1} data-page-heading>
              {t.callTitle}
            </h1>
            <p className="call-facility">{t.facilities[call.facilityId]}</p>
            <p className="call-meta">
              {isStarted ? (
                <>
                  <span className="call-status">
                    <span className="call-status-dot" aria-hidden="true" />
                    {t.callConnected}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.participantsCount(TOTAL_PARTICIPANTS)}</span>
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
              <span aria-hidden="true">·</span>
              <span>{t.callLanguages[call.language]}</span>
              <span aria-hidden="true">·</span>
              <span dir="ltr">{call.callId}</span>
            </p>
          </div>
          {isStarted ? (
            <p className="call-timer">
              <span className="visually-hidden">{t.callDuration}: </span>
              <time dir="ltr">{formatDuration(seconds)}</time>
            </p>
          ) : (
            <p className="call-timer call-timer--waiting">{t.callNotStarted}</p>
          )}
        </div>

        <div className="call-stage">
          <ul className="call-tiles" aria-label={t.participants}>
            <ParticipantCard
              variant="pwd"
              name={t.pwdUser}
              avatar={<AccessibilityIcon />}
              state="connected"
              stateLabel={t.stateConnected}
              mutedLabel={t.micOff}
              cameraOffLabel={t.cameraOff}
            />
            <ParticipantCard
              variant="partner"
              name={displayName(partner, language)}
              role={`${t.partnerRole} · ${t.you}`}
              avatar={<HeadsetIcon />}
              state="connected"
              stateLabel={t.stateConnected}
              muted={muted}
              cameraOff={cameraOff}
              mutedLabel={t.micOff}
              cameraOffLabel={t.cameraOff}
            />
            <ParticipantCard
              variant="translator"
              name={translatorFound ? translatorName : t.translator}
              role={translatorFound ? `${t.translator} · ${translatorLanguages}` : undefined}
              avatar={<TranslatorIcon />}
              state={translatorState}
              stateLabel={
                {
                  searching: t.stateSearching,
                  connecting: t.stateConnecting,
                  connected: t.stateConnected,
                }[translatorState]
              }
              mutedLabel={t.micOff}
              cameraOffLabel={t.cameraOff}
            />
          </ul>
        </div>

        <div className="call-progress">
          <p className={`call-translator-status call-translator-status--${translatorState}`} role="status">
            {!isStarted && <span className="spinner spinner--small" aria-hidden="true" />}
            {statusText}
          </p>
          {!isStarted && <p className="call-lobby-note">{t.lobbyNote}</p>}
        </div>

        {/* State changes of the visual-only toggles, for screen-reader users. */}
        <p className="visually-hidden" role="status">
          {muted ? t.micOff : t.micOn}. {cameraOff ? t.cameraOff : t.cameraOn}.
        </p>

        <CallControls
          t={t}
          muted={muted}
          cameraOff={cameraOff}
          endLabel={isStarted ? t.endCall : t.leaveCall}
          onToggleMute={() => setMuted((m) => !m)}
          onToggleCamera={() => setCameraOff((c) => !c)}
          onEndCall={() => setIsConfirmOpen(true)}
        />
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title={isStarted ? t.endCallTitle : t.leaveCallTitle}
        description={isStarted ? t.endCallDescription : t.leaveCallDescription}
        cancelLabel={t.cancel}
        confirmLabel={isStarted ? t.endCall : t.leaveCall}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => onEndCall({ started: isStarted, durationSeconds: seconds })}
      />
    </section>
  );
}
