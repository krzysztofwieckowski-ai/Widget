import type { Translation } from '../i18n';
import { MicIcon, MicOffIcon, PhoneEndIcon, VideoIcon, VideoOffIcon } from './icons';

type CallControlsProps = {
  t: Translation;
  muted: boolean;
  cameraOff: boolean;
  /** "End call" once the call runs, "Leave" while still waiting for everyone to join. */
  endLabel: string;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
};

/** Same controls as the partner view. Mute and Camera are visual-only toggles (aria-pressed). */
export default function CallControls({
  t,
  muted,
  cameraOff,
  endLabel,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="call-controls" role="group" aria-label={t.callControls}>
      <button type="button" className="control-button" aria-pressed={muted} onClick={onToggleMute}>
        {muted ? <MicOffIcon /> : <MicIcon />}
        <span className="control-label">{t.mute}</span>
      </button>

      <button type="button" className="control-button" aria-pressed={cameraOff} onClick={onToggleCamera}>
        {cameraOff ? <VideoOffIcon /> : <VideoIcon />}
        <span className="control-label">{t.camera}</span>
      </button>

      <button type="button" className="control-button control-button--end" onClick={onEndCall}>
        <PhoneEndIcon />
        <span className="control-label">{endLabel}</span>
      </button>
    </div>
  );
}
