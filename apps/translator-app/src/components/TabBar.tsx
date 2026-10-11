import type { ReactNode } from 'react';
import type { Translation } from '../i18n';
import type { Tab } from '../types';
import { HistoryIcon, HomeIcon, ProfileIcon } from './icons';

type TabBarProps = {
  t: Translation;
  active: Tab;
  onChange: (tab: Tab) => void;
};

/** Bottom navigation of the phone app (Home / History / Profile). */
export default function TabBar({ t, active, onChange }: TabBarProps) {
  const items: Array<{ id: Tab; label: string; icon: ReactNode }> = [
    { id: 'home', label: t.navHome, icon: <HomeIcon /> },
    { id: 'history', label: t.navHistory, icon: <HistoryIcon /> },
    { id: 'profile', label: t.navProfile, icon: <ProfileIcon /> },
  ];

  return (
    <nav className="tabbar" aria-label={t.navLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="tabbar-item"
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onChange(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
