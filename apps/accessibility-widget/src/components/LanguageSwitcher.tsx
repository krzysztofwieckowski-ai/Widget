import type { Language } from '../types';

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
  tooltip: string;
};

// The button always offers the *other* language, written in that language.
const OTHER_LANGUAGE: Record<Language, { value: Language; label: string }> = {
  ar: { value: 'en', label: 'English' },
  en: { value: 'ar', label: 'العربية' },
};

/** Compact header toggle between Arabic and English. */
export default function LanguageSwitcher({ language, onChange, tooltip }: LanguageSwitcherProps) {
  const other = OTHER_LANGUAGE[language];

  return (
    <button
      type="button"
      className="language-toggle"
      lang={other.value}
      title={tooltip}
      onClick={() => onChange(other.value)}
    >
      {other.label}
    </button>
  );
}
