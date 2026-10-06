import type { ReactNode } from 'react';
import { MicOffIcon, VideoOffIcon } from './icons';

type ParticipantTileProps = {
  name: string;
  avatar: ReactNode;
  /** Mock "video": a still photo shown while the camera is on. */
  photo?: string;
  variant: 'translator' | 'self';
  cameraOff?: boolean;
  muted?: boolean;
  cameraOffLabel: string;
  mutedLabel: string;
};

/** A fake video tile: gradient "video" background, avatar and name label. */
export default function ParticipantTile({
  name,
  avatar,
  photo,
  variant,
  cameraOff = false,
  muted = false,
  cameraOffLabel,
  mutedLabel,
}: ParticipantTileProps) {
  return (
    <li className={`tile tile--${variant}${cameraOff ? ' tile--camera-off' : ''}`}>
      {photo && !cameraOff ? (
        <img className="tile-photo" src={photo} alt="" />
      ) : (
        <div className="tile-avatar">{avatar}</div>
      )}

      {cameraOff && (
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
