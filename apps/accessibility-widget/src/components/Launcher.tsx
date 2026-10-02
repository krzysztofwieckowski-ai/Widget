import type { Ref } from 'react';
import { AccessibilityIcon } from './icons';

type LauncherProps = {
  onOpen: () => void;
  hidden: boolean;
  ref?: Ref<HTMLButtonElement>;
};

// The accessible name is intentionally fixed to "Accessibility assistance" in both languages.
const LAUNCHER_LABEL = 'Accessibility assistance';

export default function Launcher({ onOpen, hidden, ref }: LauncherProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="launcher"
      aria-label={LAUNCHER_LABEL}
      title={LAUNCHER_LABEL}
      onClick={onOpen}
      hidden={hidden}
    >
      <AccessibilityIcon className="launcher-icon" />
    </button>
  );
}
