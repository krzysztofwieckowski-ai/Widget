import type { Translation } from '../i18n';
import Notice from '../components/Notice';
import { PhoneIcon, UsersIcon } from '../components/icons';

type HomePageProps = {
  t: Translation;
  name: string;
  available: boolean;
  /** True after the translator left a call before it started. */
  showCancelledNotice: boolean;
  onDismissNotice: () => void;
  onStartCall: () => void;
};

export default function HomePage({ t, name, available, showCancelledNotice, onDismissNotice, onStartCall }: HomePageProps) {
  return (
    <section className="page" aria-labelledby="home-title">
      <h1 id="home-title" className="page-title">
        {t.welcome} {name}
      </h1>

      {showCancelledNotice && (
        <Notice onDismiss={onDismissNotice} dismissLabel={t.dismiss}>
          {t.callCancelledNotice}
        </Notice>
      )}

      {/* The whole card is the button. */}
      <button type="button" className="action-card" disabled={!available} onClick={onStartCall}>
        <UsersIcon className="action-card-icon" />
        <span className="action-card-label">{t.threeWayCall}</span>
        <span className="action-card-button" aria-hidden="true">
          <PhoneIcon />
        </span>
      </button>

      {!available && <p className="muted-note">{t.unavailableNote}</p>}
    </section>
  );
}
