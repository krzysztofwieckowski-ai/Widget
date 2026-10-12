import type { Translation } from '../i18n';
import type { CallRecord, Language } from '../types';
import { TranslatorIcon } from '../components/icons';
import { localName, mockTranslator } from '../mock/translator';

type ProfilePageProps = {
  t: Translation;
  language: Language;
  records: CallRecord[];
  available: boolean;
  onAvailableChange: (value: boolean) => void;
  onLanguageChange: (language: Language) => void;
};

export default function ProfilePage({
  t,
  language,
  records,
  available,
  onAvailableChange,
  onLanguageChange,
}: ProfilePageProps) {
  const completed = records.filter((record) => record.outcome === 'COMPLETED');
  const minutes = Math.round(completed.reduce((sum, record) => sum + record.durationSeconds, 0) / 60);

  return (
    <section className="page" aria-labelledby="profile-title">
      <h1 id="profile-title" className="page-title">
        {t.profileTitle}
      </h1>

      <div className="profile-head">
        <span className="profile-photo" aria-hidden="true">
          <TranslatorIcon />
        </span>
        <div>
          <p className="profile-name">{localName(mockTranslator, language)}</p>
          <p className="profile-meta">
            {t.languagesLabel}: {t.languagesValue}
          </p>
        </div>
      </div>

      <dl className="stats">
        <div className="stat">
          <dt>{t.statCalls}</dt>
          <dd>{completed.length}</dd>
        </div>
        <div className="stat">
          <dt>{t.statMinutes}</dt>
          <dd>{minutes}</dd>
        </div>
      </dl>

      <div className="setting">
        <div className="setting-text">
          <span id="availability-label" className="setting-label">
            {t.availabilityLabel}
          </span>
          <span id="availability-hint" className="setting-hint">
            {available ? t.availabilityOn : t.availabilityOff}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={available}
          aria-labelledby="availability-label"
          aria-describedby="availability-hint"
          className="switch"
          onClick={() => onAvailableChange(!available)}
        >
          <span className="switch-thumb" />
        </button>
      </div>

      <div className="setting setting--column">
        <span id="language-label" className="setting-label">
          {t.languageLabel}
        </span>
        <div className="segmented" role="group" aria-labelledby="language-label">
          <button
            type="button"
            lang="en"
            aria-pressed={language === 'en'}
            onClick={() => onLanguageChange('en')}
          >
            English
          </button>
          <button
            type="button"
            lang="ar"
            aria-pressed={language === 'ar'}
            onClick={() => onLanguageChange('ar')}
          >
            العربية
          </button>
        </div>
      </div>
    </section>
  );
}
