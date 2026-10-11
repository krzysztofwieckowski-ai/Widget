import type { Translation } from '../i18n';
import type { CallRecord, Language } from '../types';
import OutcomeBadge from '../components/OutcomeBadge';
import { localName } from '../mock/translator';
import { formatDateTime, formatDuration } from '../utils';

type HistoryPageProps = {
  t: Translation;
  language: Language;
  records: CallRecord[];
};

export default function HistoryPage({ t, language, records }: HistoryPageProps) {
  return (
    <section className="page" aria-labelledby="history-title">
      <h1 id="history-title" className="page-title">
        {t.historyTitle}
      </h1>

      {records.length === 0 ? (
        <p className="muted-note">{t.historyEmpty}</p>
      ) : (
        <ul className="history-list">
          {records.map((record) => (
            <li key={record.callId} className="history-item">
              <div className="history-main">
                <span className="history-company">{localName(record.call.company, language)}</span>
                <span className="history-meta">
                  {t.historyCallWith}: {localName(record.call.user, language)} · {t.historyPartner}:{' '}
                  {localName(record.call.partner, language)}
                </span>
                <time className="history-meta" dateTime={record.endedAt}>
                  {formatDateTime(record.endedAt, language)}
                  {record.outcome === 'COMPLETED' && ` · ${formatDuration(record.durationSeconds)}`}
                </time>
              </div>
              <OutcomeBadge t={t} outcome={record.outcome} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
