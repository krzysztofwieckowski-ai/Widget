import type { ReactNode } from 'react';
import { CheckCircleIcon, CloseIcon, InfoIcon } from '../icons';

type NoticeProps = {
  tone?: 'success' | 'info';
  children: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
};

/** Inline message with an icon matching its tone. Announced politely to screen readers. */
export default function Notice({ tone = 'info', children, onDismiss, dismissLabel }: NoticeProps) {
  return (
    <div className={`notice notice--${tone}`} role="status">
      {tone === 'success' ? <CheckCircleIcon /> : <InfoIcon />}
      <p className="notice-text">{children}</p>
      {onDismiss && (
        <button
          type="button"
          className="icon-button icon-button--small"
          aria-label={dismissLabel}
          title={dismissLabel}
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
