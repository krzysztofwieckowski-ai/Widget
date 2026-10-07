import type { CallRecord, Language } from '../../types';
import type { Translation } from '../../i18n';
import { formatDate, formatDuration } from '../../utils/format';
import OutcomeBadge from '../../components/OutcomeBadge/OutcomeBadge';

type HistoryPageProps = { t: Translation; language: Language; history: CallRecord[] };

/** Local, in-memory call history (newest first). */
export default function HistoryPage({ t, language, history }: HistoryPageProps) {
  return (
    <div className="page">
      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.historyTitle}
      </h1>

      {history.length === 0 ? (
        <p className="card muted">{t.noHistory}</p>
      ) : (
        <ol className="history-list">
          {history.map((call) => (
            <li key={call.callId} className="card history-item">
              <div className="history-item-header">
                <h2 className="history-date">{formatDate(call.endedAt, language)}</h2>
                <OutcomeBadge t={t} outcome={call.outcome} />
              </div>
              <dl className="details-grid">
                <div>
                  <dt>{t.duration}</dt>
                  <dd>
                    <span dir="ltr" className="tabular">
                      {call.outcome === 'COMPLETED' ? formatDuration(call.durationSeconds) : '—'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>{t.callId}</dt>
                  <dd>
                    <span dir="ltr">{call.callId}</span>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
