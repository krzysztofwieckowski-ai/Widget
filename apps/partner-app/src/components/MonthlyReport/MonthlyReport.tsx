import { useMemo, useState, type FormEvent } from 'react';
import type { CallRecord, Company, Consultant, Language, ReportSettings } from '../../types';
import type { Translation } from '../../i18n';
import { isValidEmail } from '../../mock/partner';
import { buildMonthlyReport, getNextReportSend, getReportMonths } from '../../utils/report';
import { displayName, formatDate, formatDuration, formatLongDuration, formatMonth } from '../../utils/format';
import Notice from '../Notice/Notice';
import OutcomeBadge from '../OutcomeBadge/OutcomeBadge';
import { CheckCircleIcon } from '../icons';

type MonthlyReportProps = {
  t: Translation;
  language: Language;
  company: Company;
  companyName: string;
  consultants: Consultant[];
  calls: CallRecord[];
  /** `undefined` removes the contact. */
  onSave: (settings: ReportSettings | undefined) => void;
  onAnnounce: (message: string) => void;
};

type FieldErrors = { name?: true; email?: true };

/** Moves focus once the next render has put the element in place. */
function focusSoon(id: string) {
  window.requestAnimationFrame(() => document.getElementById(id)?.focus());
}

/**
 * Admin: where the company's monthly call report goes, and a preview of what it contains
 * (who handled the calls, how many, how long). Mock only: the report is never actually e-mailed.
 */
export default function MonthlyReport({
  t,
  language,
  company,
  companyName,
  consultants,
  calls,
  onSave,
  onAnnounce,
}: MonthlyReportProps) {
  const saved = company.reportSettings;
  const [contactName, setContactName] = useState(saved?.contactName ?? '');
  const [contactEmail, setContactEmail] = useState(saved?.contactEmail ?? '');
  const [monthly, setMonthly] = useState(saved?.monthly ?? true);
  const [errors, setErrors] = useState<FieldErrors>({});
  // A saved contact is shown read-only; "Change contact" opens the form.
  const [editing, setEditing] = useState(!saved);
  const [testMessage, setTestMessage] = useState('');

  const months = useMemo(() => getReportMonths(calls, company.id), [calls, company.id]);
  const [chosenMonth, setChosenMonth] = useState('');
  const month = months.includes(chosenMonth) ? chosenMonth : months[0];
  const report = useMemo(
    () => (month ? buildMonthlyReport(calls, consultants, company.id, month) : null),
    [calls, consultants, company.id, month],
  );

  const duration = (seconds: number) =>
    formatLongDuration(seconds, { hoursMinutes: t.durationHoursMinutes, minutesSeconds: t.durationMinutesSeconds });

  function handleSave(event: FormEvent) {
    event.preventDefault();
    const name = contactName.trim();
    const email = contactEmail.trim();
    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = true;
    if (!isValidEmail(email)) nextErrors.email = true;
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email) {
      document.getElementById(nextErrors.name ? 'report-contactName' : 'report-contactEmail')?.focus();
      return;
    }
    onSave({ contactName: name, contactEmail: email, monthly });
    setEditing(false);
    focusSoon('report-change-contact');
    setTestMessage('');
    onAnnounce(t.reportContactSaved(companyName));
  }

  function startEditing() {
    setEditing(true);
    focusSoon('report-contactName');
  }

  function cancelEditing() {
    setContactName(saved?.contactName ?? '');
    setContactEmail(saved?.contactEmail ?? '');
    setMonthly(saved?.monthly ?? true);
    setErrors({});
    setEditing(false);
    focusSoon('report-change-contact');
  }

  function handleTest() {
    if (!saved || !month) return;
    const message = t.testReportSent(formatMonth(month, language), saved.contactEmail);
    setTestMessage(message);
    onAnnounce(message);
  }

  const next = getNextReportSend();
  const schedule = !saved
    ? t.reportNoContact
    : saved.monthly
      ? t.reportNextSend(formatDate(next.sendDate, language), formatMonth(next.coveredMonth, language), saved.contactEmail)
      : t.reportAutoOff;

  return (
    <section className="card" aria-labelledby="report-title">
      <h2 id="report-title" className="card-title">
        {t.reportTitle}
      </h2>
      <p className="muted small-text">{t.reportIntro}</p>

      {editing || !saved ? (
      <form className="report-form" onSubmit={handleSave} noValidate aria-label={t.reportTitle}>
        <div className="field">
          <label htmlFor="report-contactName" className="field-label">
            {t.reportContactName}
          </label>
          <input
            id="report-contactName"
            className="input"
            autoComplete="off"
            value={contactName}
            aria-invalid={errors.name === true}
            aria-describedby={errors.name ? 'report-contactName-error' : undefined}
            onChange={(event) => setContactName(event.target.value)}
          />
          {errors.name && (
            <p id="report-contactName-error" className="field-error">
              {t.reportContactNameRequired}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="report-contactEmail" className="field-label">
            {t.reportContactEmail}
          </label>
          <input
            id="report-contactEmail"
            className="input"
            type="email"
            dir="ltr"
            autoComplete="off"
            value={contactEmail}
            aria-invalid={errors.email === true}
            aria-describedby={errors.email ? 'report-contactEmail-error' : undefined}
            onChange={(event) => setContactEmail(event.target.value)}
          />
          {errors.email && (
            <p id="report-contactEmail-error" className="field-error">
              {t.emailInvalid}
            </p>
          )}
        </div>
        <label className="checkbox-field report-form-wide">
          <input type="checkbox" checked={monthly} onChange={(event) => setMonthly(event.target.checked)} />
          <span>{t.reportAutoSend}</span>
        </label>
        <div className="form-actions report-form-wide">
          {saved && (
            <button type="button" className="button button--ghost" onClick={cancelEditing}>
              {t.cancel}
            </button>
          )}
          <button type="submit" className="button button--primary">
            {t.saveContact}
          </button>
        </div>
      </form>
      ) : (
      <div className="report-contact">
        <dl className="report-contact-list">
          <div>
            <dt>{t.reportContactName}</dt>
            <dd>{saved?.contactName}</dd>
          </div>
          <div>
            <dt>{t.reportContactEmail}</dt>
            <dd dir="ltr">{saved?.contactEmail}</dd>
          </div>
        </dl>
        <button id="report-change-contact" type="button" className="button button--ghost" onClick={startEditing}>
          {t.changeContact}
        </button>
      </div>
      )}

      <p className="report-schedule" role="status">
        {saved && saved.monthly && <CheckCircleIcon />}
        {schedule}
      </p>

      <div className="card-section">
        <div className="report-preview-heading">
          <div>
            <h3 className="form-title">{t.reportPreview}</h3>
            <p className="muted small-text">{t.reportPreviewHint}</p>
          </div>
          {report && (
            <div className="report-period">
              <label htmlFor="report-period" className="field-label">
                {t.reportPeriod}
              </label>
              <select
                id="report-period"
                className="input"
                value={month}
                onChange={(event) => {
                  setChosenMonth(event.target.value);
                  setTestMessage('');
                }}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {formatMonth(m, language)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!report ? (
          <p className="muted">{t.reportNoCalls}</p>
        ) : (
          <>
            <div className="table-scroll">
              <table className="table table--stats">
                <caption className="visually-hidden">{t.reportTitle}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t.reportConsultant}</th>
                    <th scope="col" className="num">{t.completed}</th>
                    <th scope="col" className="num">{t.cancelled}</th>
                    <th scope="col" className="num">{t.declined}</th>
                    <th scope="col" className="num">{t.reportTotalTime}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row) => (
                    <tr key={row.consultantId}>
                      <th scope="row">{row.consultant ? displayName(row.consultant, language) : t.formerConsultant}</th>
                      <td className="num">{row.completedCalls}</td>
                      <td className="num">{row.cancelled}</td>
                      <td className="num">{row.declined}</td>
                      <td className="num">{duration(row.totalSeconds)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">{t.reportTotal}</th>
                    <td className="num">{report.totals.completedCalls}</td>
                    <td className="num">{report.totals.cancelled}</td>
                    <td className="num">{report.totals.declined}</td>
                    <td className="num">{duration(report.totals.totalSeconds)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <h3 className="form-title">{t.reportAllCalls}</h3>
            <div className="table-scroll">
              <table className="table table--stats">
                <caption className="visually-hidden">{t.reportAllCalls}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t.reportDate}</th>
                    <th scope="col">{t.reportCall}</th>
                    <th scope="col">{t.reportConsultant}</th>
                    <th scope="col">{t.reportResult}</th>
                    <th scope="col" className="num">{t.reportDuration}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.calls.map((call) => {
                    const consultant = consultants.find((c) => c.id === call.consultantId);
                    return (
                      <tr key={call.callId}>
                        <td>{formatDate(call.endedAt, language)}</td>
                        <td dir="ltr">{call.callId}</td>
                        <td>{consultant ? displayName(consultant, language) : t.formerConsultant}</td>
                        <td>
                          <OutcomeBadge t={t} outcome={call.outcome} />
                        </td>
                        <td className="num" dir="ltr">
                          {call.outcome === 'COMPLETED' ? formatDuration(call.durationSeconds) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="form-actions">
              <button type="button" className="button" disabled={!saved} onClick={handleTest}>
                {t.sendTestReport}
              </button>
            </div>
            {testMessage && <Notice tone="success">{testMessage}</Notice>}
          </>
        )}
      </div>
    </section>
  );
}
