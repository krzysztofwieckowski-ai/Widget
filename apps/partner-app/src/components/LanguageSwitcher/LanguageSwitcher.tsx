import type { Language } from '../../types';

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
  groupLabel: string;
};

// Each language is written in that language, so it is recognisable whatever the current UI language.
const OPTIONS: { value: Language; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'ar', label: 'العربية', name: 'العربية' },
];

/** "EN | العربية" toggle. The current language is marked with aria-pressed and a filled style. */
export default function LanguageSwitcher({ language, onChange, groupLabel }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" role="group" aria-label={groupLabel}>
      {OPTIONS.map((option, index) => (
        <span key={option.value} className="language-switcher-item">
          {index > 0 && (
            <span className="language-switcher-separator" aria-hidden="true">
              |
            </span>
          )}
          <button
            type="button"
            className="language-switcher-button"
            lang={option.value}
            aria-label={option.name}
            aria-pressed={language === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  );
}
