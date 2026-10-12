import type { ReactNode } from 'react';
import { CheckCircleIcon, ClockIcon, MicOffIcon, VideoOffIcon } from './icons';

export type ParticipantState = 'connected' | 'searching' | 'connecting';

type ParticipantTileProps = {
  name: string;
  /** Role icon shown in the tile. */
  avatar: ReactNode;
  /** Caption under the icon: USER / PARTNER / TRANSLATOR. */
  roleLabel: string;
  variant: 'translator' | 'partner' | 'self';
  cameraOff?: boolean;
  muted?: boolean;
  /** Lobby: a participant who has not joined yet is shown as an empty seat with a state chip. */
  state?: ParticipantState;
  stateLabel?: string;
  /** True once all three people are in the room: the connection chips are then hidden. */
  isStarted?: boolean;
  cameraOffLabel: string;
  mutedLabel: string;
};

/** A mock video tile: gradient background, role icon with a caption, optional state chip and name label. No photos. */
export default function ParticipantTile({
  name,
  avatar,
  roleLabel,
  variant,
  cameraOff = false,
  muted = false,
  state = 'connected',
  stateLabel,
  isStarted = true,
  cameraOffLabel,
  mutedLabel,
}: ParticipantTileProps) {
  const isPending = state !== 'connected';

  return (
    <li className={`tile tile--${variant}${cameraOff ? ' tile--camera-off' : ''}${isPending ? ' tile--pending' : ''}`}>
      {stateLabel && (isPending || !isStarted) && (
        <span className={`tile-state tile-state--${state}`}>
          {state === 'searching' && <ClockIcon />}
          {state === 'connecting' && <span className="spinner spinner--small" aria-hidden="true" />}
          {state === 'connected' && <CheckCircleIcon />}
          {stateLabel}
        </span>
      )}

      <div className="tile-identity">
        <div className="tile-avatar">{avatar}</div>
        <span className="tile-role-caption">{roleLabel}</span>
      </div>

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
