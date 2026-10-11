import type { Translation } from '../../i18n';
import CopyButton from '../CopyButton/CopyButton';

type CompanyKeyProps = {
  t: Translation;
  companyName: string;
  companyKey: string;
  onAnnounce: (message: string) => void;
};

/** The company's widget key in monospace (always LTR), with a copy-to-clipboard button. */
export default function CompanyKey({ t, companyName, companyKey, onAnnounce }: CompanyKeyProps) {
  return (
    <div className="company-key">
      <code className="company-key-value" dir="ltr">
        {companyKey}
      </code>
      <CopyButton
        text={companyKey}
        label={t.copyKey}
        accessibleLabel={t.copyKeyLabel(companyName)}
        copiedLabel={t.copied}
        copiedMessage={t.keyCopied}
        failedMessage={t.copyFailed}
        onAnnounce={onAnnounce}
      />
    </div>
  );
}
