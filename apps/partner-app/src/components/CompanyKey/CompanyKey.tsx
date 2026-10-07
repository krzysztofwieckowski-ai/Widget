import { useEffect, useState } from 'react';
import type { Translation } from '../../i18n';
import { CheckCircleIcon, CopyIcon } from '../icons';

type CompanyKeyProps = {
  t: Translation;
  companyName: string;
  companyKey: string;
  onAnnounce: (message: string) => void;
  size?: 'small' | 'large';
};

const COPIED_FEEDBACK_MS = 2000;

/** The company's widget key in monospace (always LTR), with a copy-to-clipboard button. */
export default function CompanyKey({ t, companyName, companyKey, onAnnounce, size = 'small' }: CompanyKeyProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const id = window.setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(id);
  }, [isCopied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(companyKey);
      setIsCopied(true);
      onAnnounce(t.keyCopied);
    } catch {
      onAnnounce(t.copyFailed);
    }
  }

  return (
    <div className={`company-key company-key--${size}`}>
      <code className="company-key-value" dir="ltr">
        {companyKey}
      </code>
      <button
        type="button"
        className="button button--ghost button--small company-key-copy"
        aria-label={t.copyKeyLabel(companyName)}
        onClick={copy}
      >
        {isCopied ? <CheckCircleIcon /> : <CopyIcon />}
        <span aria-hidden="true">{isCopied ? t.copied : t.copyKey}</span>
      </button>
    </div>
  );
}
