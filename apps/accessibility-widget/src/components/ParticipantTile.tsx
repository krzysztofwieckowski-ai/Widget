import type { CSSProperties, ReactNode } from 'react';
import { CheckCircleIcon, ClockIcon, MicOffIcon, VideoOffIcon } from './icons';

export type ParticipantState = 'connected' | 'searching' | 'connecting';

type ParticipantTileProps = {
  name: string;
  avatar: ReactNode;
  /** Mock "video": a still photo shown while the camera is on. */
  photo?: string;
  variant: 'translator' | 'partner' | 'self';
  cameraOff?: boolean;
  muted?: boolean;
  /** Lobby: a participant who has not joined yet is shown as an empty seat with a state chip. */
  state?: ParticipantState;
  stateLabel?: string;
  /** False in the lobby: nobody's picture is shown until all three people are in the room. */
  showVideo?: boolean;
  cameraOffLabel: string;
  mutedLabel: string;
};

/** A fake video tile: gradient "video" background, face photo (or avatar when the camera is off) and name label. */
export default function ParticipantTile({
  name,
  avatar,
  photo,
  variant,
  cameraOff = false,
  muted = false,
  state = 'connected',
  stateLabel,
  showVideo = true,
  cameraOffLabel,
  mutedLabel,
}: ParticipantTileProps) {
  const isPending = state !== 'connected';
  const showPhoto = Boolean(photo) && showVideo && !cameraOff && !isPending;

  return (
    <li
      className={`tile tile--${variant}${cameraOff ? ' tile--camera-off' : ''}${isPending ? ' tile--pending' : ''}`}
      style={showPhoto ? ({ '--tile-photo': `url(${photo})` } as CSSProperties) : undefined}
    >
      {stateLabel && (isPending || !showVideo) && (
        <span className={`tile-state tile-state--${state}`}>
          {state === 'searching' && <ClockIcon />}
          {state === 'connecting' && <span className="spinner spinner--small" aria-hidden="true" />}
          {state === 'connected' && <CheckCircleIcon />}
          {stateLabel}
        </span>
      )}

      {showPhoto ? (
        <img className="tile-photo" src={photo} alt="" />
      ) : (
        <div className="tile-avatar">{avatar}</div>
      )}

      {cameraOff && !isPending && (
        <span className="tile-status">
          <VideoOffIcon />
          {cameraOffLabel}
        </span>
      )}

      <span className="tile-name">
        {muted && (
          <span className="tile-muted">
            <MicOffIcon />
            <span className="visually-hidden">{mutedLabel}</span>
          </span>
        )}
        {name}
      </span>
    </li>
  );
}
