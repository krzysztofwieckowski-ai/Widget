import type { CSSProperties } from 'react';
import { CheckCircleIcon, ClockIcon, MicOffIcon, VideoOffIcon } from './icons';

export type ParticipantState = 'connected' | 'searching' | 'connecting';

type ParticipantTileProps = {
  name: string;
  role: string;
  initial: string;
  /** Mock "video": a still photo shown while the participant is connected and their camera is on. */
  photo: string;
  /** False in the lobby: no pictures until all three people are in the room. */
  showVideo: boolean;
  /** main = large tile filling the stage; self / other = small corner tiles. */
  position: 'main' | 'start' | 'end';
  variant: 'user' | 'partner' | 'translator';
  state: ParticipantState;
  stateLabel: string;
  muted?: boolean;
  cameraOff?: boolean;
  mutedLabel: string;
  cameraOffLabel: string;
};

/** A fake video tile: photo (or avatar), connection state chip and name label. */
export default function ParticipantTile({
  name,
  role,
  initial,
  photo,
  showVideo,
  position,
  variant,
  state,
  stateLabel,
  muted = false,
  cameraOff = false,
  mutedLabel,
  cameraOffLabel,
}: ParticipantTileProps) {
  const isPending = state !== 'connected';
  const showPhoto = showVideo && !isPending && !cameraOff;
  const classes = [
    'tile',
    `tile--${variant}`,
    `tile--${position}`,
    isPending && 'tile--pending',
    cameraOff && 'tile--camera-off',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classes} style={showPhoto ? ({ '--tile-photo': `url(${photo})` } as CSSProperties) : undefined}>
      <span className={`tile-state tile-state--${state}`}>
        {state === 'connected' && <CheckCircleIcon />}
        {state === 'searching' && <ClockIcon />}
        {state === 'connecting' && <span className="spinner" aria-hidden="true" />}
        <span className="tile-state-text">{stateLabel}</span>
      </span>

      {cameraOff && (
        <span className="tile-camera-off">
          <VideoOffIcon />
          <span className="tile-state-text">{cameraOffLabel}</span>
        </span>
      )}

      {showPhoto ? (
        <img className="tile-photo" src={photo} alt="" />
      ) : (
        <div className="tile-avatar" aria-hidden="true">
          {initial}
        </div>
      )}

      <span className="tile-name">
        {muted && (
          <span className="tile-muted">
            <MicOffIcon />
            <span className="visually-hidden">{mutedLabel}</span>
          </span>
        )}
        <span className="tile-name-text">
          <span className="tile-person">{name}</span>
          <span className="tile-role">{role}</span>
        </span>
      </span>
    </li>
  );
}
