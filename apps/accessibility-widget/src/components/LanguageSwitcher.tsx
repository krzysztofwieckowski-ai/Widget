import type { Language } from '../types';

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
  groupLabel: string;
};

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
];

export default function LanguageSwitcher({ language, onChange, groupLabel }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" role="group" aria-label={groupLabel}>
      {OPTIONS.map((option) => {
        const isActive = option.value === language;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            className="language-option"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
