import type { Translation } from '../../i18n';
import StarRating from '../../components/StarRating/StarRating';
import { CheckCircleIcon } from '../../components/icons';

type CallEndedPageProps = { t: Translation; onClose: () => void };

/** Shown after a call that actually started (same idea as the PWD's "Call ended" screen): rate it, then close. */
export default function CallEndedPage({ t, onClose }: CallEndedPageProps) {
  return (
    <div className="page page--narrow">
      <section className="card call-ended" aria-labelledby="call-ended-title">
        <div className="call-ended-icon">
          <CheckCircleIcon />
        </div>
        <h1 id="call-ended-title" className="call-ended-title" tabIndex={-1} data-page-heading>
          {t.callEndedTitle}
        </h1>
        <p className="call-ended-text">{t.callEndedDescription}</p>
        <StarRating t={t} />
        <button type="button" className="button button--primary call-ended-close" onClick={onClose}>
          {t.closeCallEnded}
        </button>
      </section>
    </div>
  );
}
