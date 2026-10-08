import { useEffect, useState } from 'react';
import { CheckCircleIcon, CopyIcon } from '../icons';

type CopyButtonProps = {
  text: string;
  /** Visible label, e.g. "Copy key". */
  label: string;
  /** Accessible name; must start with the visible label (e.g. "Copy key of Al Rawdah Bank"). */
  accessibleLabel: string;
  copiedLabel: string;
  copiedMessage: string;
  failedMessage: string;
  onAnnounce: (message: string) => void;
};

const COPIED_FEEDBACK_MS = 2000;

/** Copies `text` to the clipboard; shows "Copied" for a moment and announces the result. */
export default function CopyButton({
  text,
  label,
  accessibleLabel,
  copiedLabel,
  copiedMessage,
  failedMessage,
  onAnnounce,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const id = window.setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(id);
  }, [isCopied]);

  async function copy() {
    try {
      // navigator.clipboard is missing on non-secure origins; that lands in catch as well.
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      onAnnounce(copiedMessage);
    } catch {
      onAnnounce(failedMessage);
    }
  }

  return (
    <button type="button" className="button button--ghost button--small copy-button" aria-label={accessibleLabel} onClick={copy}>
      {isCopied ? <CheckCircleIcon /> : <CopyIcon />}
      <span aria-hidden="true">{isCopied ? copiedLabel : label}</span>
    </button>
  );
}
