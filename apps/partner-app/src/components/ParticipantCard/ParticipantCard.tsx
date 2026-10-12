import type { ReactNode } from 'react';
import { CheckCircleIcon, ClockIcon, MicOffIcon, VideoOffIcon } from '../icons';

export type ParticipantState = 'connected' | 'searching' | 'connecting';

type ParticipantCardProps = {
  name: string;
  role?: string;
  avatar: ReactNode;
  /** Caption under the icon: USER / PARTNER / TRANSLATOR. */
  roleLabel: string;
  variant: 'pwd' | 'partner' | 'translator';
  state: ParticipantState;
  stateLabel: string;
  muted?: boolean;
  cameraOff?: boolean;
  mutedLabel: string;
  cameraOffLabel: string;
};

/**
 * A mock video tile, same structure as the PWD widget's ParticipantTile:
 * gradient background, round role icon with a caption (USER / PARTNER / TRANSLATOR), name label in the bottom corner.
 * Adds a connection state chip (icon + text) for the partner view.
 */
export default function ParticipantCard({
  name,
  role,
  avatar,
  roleLabel,
  variant,
  state,
  stateLabel,
  muted = false,
  cameraOff = false,
  mutedLabel,
  cameraOffLabel,
}: ParticipantCardProps) {
  const isPending = state !== 'connected';
  const classes = [
    'tile',
    `tile--${variant}`,
    isPending && 'tile--pending',
    cameraOff && 'tile--camera-off',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classes}>
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

      <div className="tile-identity">
        <div className="tile-avatar">{avatar}</div>
        <span className="tile-role-caption">{roleLabel}</span>
      </div>

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
