import type { Language, Page } from '../../types';
import type { Translation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { AccessibilityIcon, DashboardIcon, HistoryIcon, LogoutIcon, UserIcon } from '../icons';

type HeaderProps = {
  t: Translation;
  language: Language;
  onLanguageChange: (language: Language) => void;
  page: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  hasIncomingCall: boolean;
};

/**
 * Green header with the orange bottom border, like the PWD widget header.
 * During a call the navigation and logout are hidden so the partner cannot leave the call by accident;
 * the language switcher always stays available.
 */
export default function Header({
  t,
  language,
  onLanguageChange,
  page,
  onNavigate,
  onLogout,
  hasIncomingCall,
}: HeaderProps) {
  const inCall = page === 'call';

  const navItems = [
    { page: 'dashboard' as const, label: t.navDashboard, icon: <DashboardIcon /> },
    { page: 'history' as const, label: t.navHistory, icon: <HistoryIcon /> },
    { page: 'profile' as const, label: t.navProfile, icon: <UserIcon /> },
  ];

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <AccessibilityIcon />
          </span>
          <span className="brand-text">
            <span className="brand-title">{t.appName}</span>
            <span className="brand-subtitle">{t.portalName}</span>
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
                <li key={item.page}>
                  <button
                    type="button"
                    className="main-nav-link"
                    aria-current={page === item.page ? 'page' : undefined}
                    onClick={() => onNavigate(item.page)}
                  >
                    {item.icon}
                    {item.label}
                    {item.page === 'dashboard' && hasIncomingCall && (
                      <span className="nav-badge">
                        <span aria-hidden="true">1</span>
                        <span className="visually-hidden">{t.incomingCallBadge}</span>
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
