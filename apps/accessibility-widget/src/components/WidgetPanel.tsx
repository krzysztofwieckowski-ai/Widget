import type { KeyboardEvent, ReactNode, Ref } from 'react';
import type { Language } from '../types';
import type { Translation } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { AccessibilityIcon, CloseIcon, CollapseIcon, ExpandIcon } from './icons';

type WidgetPanelProps = {
  t: Translation;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onClose: () => void;
  isExpanded: boolean;
  /** Omitted on phones, where the panel is already full screen. */
  onToggleExpand?: () => void;
  hidden: boolean;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/** Panel frame shared by every step: header, language switcher, enlarge and close buttons. */
export default function WidgetPanel({
  t,
  language,
  onLanguageChange,
  onClose,
  isExpanded,
  onToggleExpand,
  hidden,
  children,
  ref,
}: WidgetPanelProps) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }

  const expandLabel = isExpanded ? t.restoreWidget : t.expandWidget;

  return (
    <div
      ref={ref}
      className={`panel${isExpanded ? ' panel--expanded' : ''}`}
      role="dialog"
      aria-labelledby="panel-title"
      hidden={hidden}
      onKeyDown={handleKeyDown}
    >
      <header className="panel-header">
        <span className="panel-header-icon">
          <AccessibilityIcon />
        </span>
        <h1 id="panel-title" className="panel-title">
          {t.widgetTitle}
        </h1>
        {onToggleExpand && (
          <button
            type="button"
            className="icon-button"
            aria-label={expandLabel}
            title={expandLabel}
            onClick={onToggleExpand}
          >
            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        )}
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

      <div className="panel-toolbar">
        <LanguageSwitcher language={language} onChange={onLanguageChange} groupLabel={t.languageGroup} />
      </div>

      <main className="panel-body">{children}</main>
    </div>
  );
}
