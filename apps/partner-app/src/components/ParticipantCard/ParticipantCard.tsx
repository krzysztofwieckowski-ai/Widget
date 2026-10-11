import type { CSSProperties, ReactNode } from 'react';
import { CheckCircleIcon, ClockIcon, MicOffIcon, VideoOffIcon } from '../icons';

export type ParticipantState = 'connected' | 'searching' | 'connecting';

type ParticipantCardProps = {
  name: string;
  role?: string;
  avatar: ReactNode;
  /** Mock "video": a still photo shown while the participant is connected and their camera is on. */
  photo?: string;
  /** False in the lobby: no pictures until all three people are in the room. */
  showVideo?: boolean;
  variant: 'pwd' | 'partner' | 'translator';
  state: ParticipantState;
  stateLabel: string;
  muted?: boolean;
  cameraOff?: boolean;
  mutedLabel: string;
  cameraOffLabel: string;
};

/**
 * A fake video tile, same structure as the PWD widget's ParticipantTile:
 * gradient "video" background, round avatar, name label in the bottom corner.
 * Adds a connection state chip (icon + text) for the partner view.
 */
export default function ParticipantCard({
  name,
  role,
  avatar,
  photo,
  showVideo = true,
  variant,
  state,
  stateLabel,
  muted = false,
  cameraOff = false,
  mutedLabel,
  cameraOffLabel,
}: ParticipantCardProps) {
  const isPending = state !== 'connected';
  const showPhoto = Boolean(photo) && showVideo && !isPending && !cameraOff;
  const classes = [
    'tile',
    `tile--${variant}`,
    isPending && 'tile--pending',
    cameraOff && 'tile--camera-off',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      className={classes}
      style={showPhoto ? ({ '--tile-photo': `url(${photo})` } as CSSProperties) : undefined}
    >
      <span className={`tile-state tile-state--${state}`}>
        {state === 'connected' && <CheckCircleIcon />}
        {state === 'searching' && <ClockIcon />}
        {state === 'connecting' && <span className="spinner spinner--small" aria-hidden="true" />}
        {stateLabel}
      </span>

      {cameraOff && (
        <span className="tile-camera-off">
          <VideoOffIcon />
          {cameraOffLabel}
        </span>
      )}

      {showPhoto ? (
        <img className="tile-photo" src={photo} alt="" />
      ) : (
        <div className="tile-avatar">{avatar}</div>
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
          {role && <span className="tile-role">{role}</span>}
        </span>
      </span>
    </li>
  );
}
