import type { ReactNode } from 'react';
import { CheckCircleIcon, ClockIcon, MicOffIcon, VideoOffIcon } from './icons';

export type ParticipantState = 'connected' | 'searching' | 'connecting';

type ParticipantTileProps = {
  name: string;
  /** Role icon shown in the tile. */
  icon: ReactNode;
  /** Caption under the icon: USER / PARTNER / TRANSLATOR. */
  roleLabel: string;
  /** main = large tile filling the stage; start / end = small corner tiles. */
  position: 'main' | 'start' | 'end';
  variant: 'user' | 'partner' | 'translator';
  state: ParticipantState;
  stateLabel: string;
  muted?: boolean;
  cameraOff?: boolean;
  mutedLabel: string;
  cameraOffLabel: string;
};

/** A mock video tile: role icon with a caption (no photos), connection state chip and name label. */
export default function ParticipantTile({
  name,
  icon,
  roleLabel,
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
    <li className={classes}>
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

      <div className="tile-identity">
        <div className="tile-avatar" aria-hidden="true">
          {icon}
        </div>
        <span className="tile-role-caption">{roleLabel}</span>
      </div>

      <span className="tile-name">
        {muted && (
          <span className="tile-muted">
            <MicOffIcon />
            <span className="visually-hidden">{mutedLabel}</span>
          </span>
        )}
        <span className="tile-person">{name}</span>
      </span>
    </li>
  );
}
