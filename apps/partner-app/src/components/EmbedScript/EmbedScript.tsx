import type { Company } from '../../types';
import type { Translation } from '../../i18n';
import { buildEmbedScript } from '../../utils/embedScript';
import CopyButton from '../CopyButton/CopyButton';

type EmbedScriptProps = {
  t: Translation;
  company: Company;
  companyName: string;
  onAnnounce: (message: string) => void;
};

/** Read-only code block with the widget snippet for this company, plus "Copy script". */
export default function EmbedScript({ t, company, companyName, onAnnounce }: EmbedScriptProps) {
  const script = buildEmbedScript(company);

  return (
    <div className="embed-script">
      {/* Focusable so keyboard users can scroll it horizontally on narrow screens. */}
      <pre className="embed-script-code" dir="ltr" tabIndex={0} aria-label={t.embedScript}>
        <code>{script}</code>
      </pre>
      <CopyButton
        text={script}
        label={t.copyScript}
        accessibleLabel={t.copyScriptLabel(companyName)}
        copiedLabel={t.copied}
        copiedMessage={t.scriptCopied}
        failedMessage={t.copyFailed}
        onAnnounce={onAnnounce}
      />
    </div>
  );
}
