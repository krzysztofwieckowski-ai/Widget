import type { KeyboardEvent, ReactNode, Ref } from 'react';
import type { Language } from '../types';
import type { Translation } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { CloseIcon } from './icons';

type WidgetPanelProps = {
  t: Translation;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onClose: () => void;
  hidden: boolean;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/** Panel frame shared by every step: header with title, language toggle and close button. */
export default function WidgetPanel({
  t,
  language,
  onLanguageChange,
  onClose,
  hidden,
  children,
  ref,
}: WidgetPanelProps) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }

  return (
    <div
      ref={ref}
      className="panel"
      role="dialog"
      aria-labelledby="panel-title"
      hidden={hidden}
      onKeyDown={handleKeyDown}
    >
      <header className="panel-header">
        <h1 id="panel-title" className="panel-title">
          {t.widgetTitle}
        </h1>
        <LanguageSwitcher language={language} onChange={onLanguageChange} tooltip={t.changeLanguage} />
        <button
          type="button"
          className="icon-button"
          aria-label={t.closeWidget}
          title={t.closeWidget}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </header>

      <main className="panel-body">{children}</main>
    </div>
  );
}
