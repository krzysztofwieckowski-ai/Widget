import type { ReactNode } from 'react';
import type { Language } from '../../types';
import type { Translation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { AccessibilityIcon, LogoutIcon } from '../icons';

export type NavItem<K extends string> = {
  key: K;
  label: string;
  icon: ReactNode;
  /** Small count badge; `badgeLabel` is what screen readers hear instead of the number. */
  badge?: { count: number; badgeLabel: string };
};

type HeaderProps<K extends string> = {
  t: Translation;
  language: Language;
  onLanguageChange: (language: Language) => void;
  /** "Partner Portal" or "Admin Panel". */
  subtitle: string;
  navItems: NavItem<K>[];
  currentKey: K | null;
  onNavigate: (key: K) => void;
  onLogout: () => void;
  /** During a call navigation and logout are hidden so the consultant cannot leave the call by accident. */
  inCall?: boolean;
};

/** Floating glass navigation bar shared by the Partner Portal and the Admin Panel. */
export default function Header<K extends string>({
  t,
  language,
  onLanguageChange,
  subtitle,
  navItems,
  currentKey,
  onNavigate,
  onLogout,
  inCall = false,
}: HeaderProps<K>) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <AccessibilityIcon />
          </span>
          <span className="brand-text">
            <span className="brand-title">{t.appName}</span>
            <span className="brand-subtitle">{subtitle}</span>
          </span>
        </div>

        {inCall ? (
          <p className="header-in-call">
            <span className="header-in-call-dot" aria-hidden="true" />
            {t.inCall}
          </p>
        ) : (
          <nav className="main-nav" aria-label={t.mainNavigation}>
            <ul className="main-nav-list">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="main-nav-link"
                    aria-current={currentKey === item.key ? 'page' : undefined}
                    onClick={() => onNavigate(item.key)}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && item.badge.count > 0 && (
                      <span className="nav-badge">
                        <span aria-hidden="true">{item.badge.count}</span>
                        <span className="visually-hidden">{item.badge.badgeLabel}</span>
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="header-actions">
          <LanguageSwitcher language={language} onChange={onLanguageChange} groupLabel={t.languageSwitcher} />
          {!inCall && (
            <button type="button" className="header-button" title={t.logout} onClick={onLogout}>
              <LogoutIcon />
              <span className="header-button-label">{t.logout}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
