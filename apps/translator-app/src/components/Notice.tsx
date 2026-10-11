import type { ReactNode } from 'react';
import { CloseIcon, InfoIcon } from './icons';

type NoticeProps = {
  children: ReactNode;
  onDismiss: () => void;
  dismissLabel: string;
};

/** Inline, dismissible message. Announced politely to screen readers. */
export default function Notice({ children, onDismiss, dismissLabel }: NoticeProps) {
  return (
    <div className="notice" role="status">
      <InfoIcon />
      <p className="notice-text">{children}</p>
      <button type="button" className="notice-close" aria-label={dismissLabel} title={dismissLabel} onClick={onDismiss}>
        <CloseIcon />
      </button>
    </div>
  );
}
