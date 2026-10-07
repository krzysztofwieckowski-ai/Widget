import type { CallRecord, Company, Language } from '../../../types';
import type { Translation } from '../../../i18n';
import { getCallStats, getCompanyStats } from '../../../utils/stats';
import { displayName, formatLongDuration } from '../../../utils/format';

type StatisticsPageProps = {
  t: Translation;
  language: Language;
  companies: Company[];
  calls: CallRecord[];
  onOpenCompany: (companyId: string) => void;
};

/** Three headline numbers, then the same numbers per company in a table. */
export default function StatisticsPage({ t, language, companies, calls, onOpenCompany }: StatisticsPageProps) {
  const totals = getCallStats(calls);
  const perCompany = getCompanyStats(companies, calls);
  const duration = (seconds: number, completed: number) =>
    completed
      ? formatLongDuration(seconds, { hoursMinutes: t.durationHoursMinutes, minutesSeconds: t.durationMinutesSeconds })
      : '—';

  return (
    <div className="page page--narrow">
      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.statisticsTitle}
      </h1>

      <dl className="kpi-row">
        <div className="kpi">
          <dt>{t.statsCompletedCalls}</dt>
          <dd>{totals.completedCalls}</dd>
        </div>
        <div className="kpi">
          <dt>{t.statsTotalTime}</dt>
          <dd>{duration(totals.totalSeconds, totals.completedCalls)}</dd>
        </div>
        <div className="kpi">
          <dt>{t.statsAverageTime}</dt>
          <dd>{duration(totals.averageSeconds, totals.completedCalls)}</dd>
        </div>
      </dl>

      <section className="card" aria-labelledby="per-company-title">
        <h2 id="per-company-title" className="card-title">
          {t.statsPerCompany}
        </h2>
        <div className="table-scroll">
          <table className="table table--stats">
            <thead>
              <tr>
                <th scope="col">{t.company}</th>
                <th scope="col" className="num">
                  {t.statsCompletedCalls}
                </th>
                <th scope="col" className="num">
                  {t.statsTotalTime}
                </th>
                <th scope="col" className="num">
                  {t.statsAverageTime}
                </th>
              </tr>
            </thead>
            <tbody>
              {perCompany.map((row) => (
                <tr key={row.company.id}>
                  <th scope="row">
                    <button type="button" className="link-button" onClick={() => onOpenCompany(row.company.id)}>
                      {displayName(row.company, language)}
                    </button>
                  </th>
                  <td className="num">{row.completedCalls}</td>
                  <td className="num">{duration(row.totalSeconds, row.completedCalls)}</td>
                  <td className="num">{duration(row.averageSeconds, row.completedCalls)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small-text">{t.statsNote}</p>
      </section>
    </div>
  );
}
