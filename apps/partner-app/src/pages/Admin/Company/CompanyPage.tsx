import { useState, type FormEvent } from 'react';
import type { CallRecord, Company, Consultant, Language } from '../../../types';
import type { Translation } from '../../../i18n';
import { isValidEmail } from '../../../mock/partner';
import { getCallStats } from '../../../utils/stats';
import { displayName, formatLongDuration } from '../../../utils/format';
import CompanyKey from '../../../components/CompanyKey/CompanyKey';
import EmbedScript from '../../../components/EmbedScript/EmbedScript';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import Notice from '../../../components/Notice/Notice';
import { ChevronBackIcon, PlusIcon } from '../../../components/icons';

type CompanyPageProps = {
  t: Translation;
  language: Language;
  company: Company;
  companies: Company[];
  consultants: Consultant[];
  calls: CallRecord[];
  /** Set right after the admin created this company. */
  justCreated: boolean;
  onBack: () => void;
  onAssignConsultant: (consultant: Omit<Consultant, 'id'>) => void;
  onRemoveConsultant: (consultantId: string) => void;
  onAnnounce: (message: string) => void;
};

/** Error kinds, not texts, so the messages follow a language switch. */
type FieldErrors = {
  firstName?: 'required';
  lastName?: 'required';
  email?: { kind: 'invalid' } | { kind: 'taken'; companyId: string };
};

/** One partner company: a summary line, its widget key and its consultants. */
export default function CompanyPage({
  t,
  language,
  company,
  companies,
  consultants,
  calls,
  justCreated,
  onBack,
  onAssignConsultant,
  onRemoveConsultant,
  onAnnounce,
}: CompanyPageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [toRemove, setToRemove] = useState<Consultant | null>(null);

  const companyName = displayName(company, language);
  const companyConsultants = consultants.filter((c) => c.companyId === company.id);
  const stats = getCallStats(calls.filter((call) => call.companyId === company.id));
  const duration = (seconds: number) =>
    formatLongDuration(seconds, { hoursMinutes: t.durationHoursMinutes, minutesSeconds: t.durationMinutesSeconds });

  function handleAssign(event: FormEvent) {
    event.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();
    const nextErrors: FieldErrors = {};
    if (!trimmedFirst) nextErrors.firstName = 'required';
    if (!trimmedLast) nextErrors.lastName = 'required';
    if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = { kind: 'invalid' };
    } else {
      const owner = consultants.find((c) => c.email.toLowerCase() === trimmedEmail.toLowerCase());
      if (owner) nextErrors.email = { kind: 'taken', companyId: owner.companyId };
    }
    setErrors(nextErrors);
    // Focus the first field with an error.
    const firstInvalid = (['firstName', 'lastName', 'email'] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`consultant-${firstInvalid}`)?.focus();
      return;
    }

    // Shown everywhere as one name ("First Last").
    const fullName = `${trimmedFirst} ${trimmedLast}`;
    onAssignConsultant({ name: fullName, email: trimmedEmail, companyId: company.id });
    onAnnounce(t.consultantAssigned(fullName));
    setFirstName('');
    setLastName('');
    setEmail('');
  }

  function emailErrorText(error: NonNullable<FieldErrors['email']>) {
    if (error.kind === 'invalid') return t.emailInvalid;
    const ownerCompany = companies.find((c) => c.id === error.companyId);
    return t.emailTaken(ownerCompany ? displayName(ownerCompany, language) : '');
  }

  function confirmRemove() {
    if (!toRemove) return;
    onRemoveConsultant(toRemove.id);
    onAnnounce(t.consultantRemoved(displayName(toRemove, language)));
    setToRemove(null);
  }

  return (
    <div className="page">
      <button type="button" className="link-button" onClick={onBack}>
        <ChevronBackIcon />
        {t.allCompanies}
      </button>

      <div className="page-heading-group">
        <h1 className="page-title" tabIndex={-1} data-page-heading>
          {companyName}
        </h1>
        <p className="muted">
          {stats.completedCalls
            ? t.companySummary(stats.completedCalls, duration(stats.totalSeconds), duration(stats.averageSeconds))
            : t.noCompletedCalls}
        </p>
      </div>

      {justCreated && <Notice tone="success">{t.companyCreated(companyName)}</Notice>}

      {/* Two columns on wide screens: consultants (add form first, then the list) | widget installation. */}
      <div className="company-layout">
        <section className="card" aria-labelledby="consultants-title">
          <h2 id="consultants-title" className="card-title">
            {t.consultants}
          </h2>

          <form className="consultant-form" onSubmit={handleAssign} noValidate aria-label={t.assignConsultant}>
            <div className="field">
              <label htmlFor="consultant-firstName" className="field-label">
                {t.firstName}
              </label>
              <input
                id="consultant-firstName"
                className="input"
                autoComplete="off"
                value={firstName}
                aria-invalid={errors.firstName !== undefined}
                aria-describedby={errors.firstName ? 'consultant-firstName-error' : undefined}
                onChange={(event) => setFirstName(event.target.value)}
              />
              {errors.firstName && (
                <p id="consultant-firstName-error" className="field-error">
                  {t.firstNameRequired}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="consultant-lastName" className="field-label">
                {t.lastName}
              </label>
              <input
                id="consultant-lastName"
                className="input"
                autoComplete="off"
                value={lastName}
                aria-invalid={errors.lastName !== undefined}
                aria-describedby={errors.lastName ? 'consultant-lastName-error' : undefined}
                onChange={(event) => setLastName(event.target.value)}
              />
              {errors.lastName && (
                <p id="consultant-lastName-error" className="field-error">
                  {t.lastNameRequired}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="consultant-email" className="field-label">
                {t.email}
              </label>
              <input
                id="consultant-email"
                className="input"
                type="email"
                dir="ltr"
                autoComplete="off"
                value={email}
                aria-invalid={errors.email !== undefined}
                aria-describedby={errors.email ? 'consultant-email-error' : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email && (
                <p id="consultant-email-error" className="field-error">
                  {emailErrorText(errors.email)}
                </p>
              )}
            </div>
            <button type="submit" className="button button--primary" aria-label={t.addConsultant}>
              <PlusIcon />
              {t.add}
            </button>
          </form>
          <div className="consultants-list">
            {companyConsultants.length === 0 ? (
              <p className="muted">{t.noConsultants}</p>
            ) : (
              <ul className="simple-list">
                {companyConsultants.map((consultant) => {
                  const consultantName = displayName(consultant, language);
                  return (
                    <li key={consultant.id} className="simple-list-item">
                      <div className="simple-list-text">
                        <span className="strong">{consultantName}</span>
                        <span className="muted small-text" dir="ltr">
                          {consultant.email}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="button button--ghost button--small"
                        aria-label={t.removeConsultantLabel(consultantName)}
                        onClick={() => setToRemove(consultant)}
                      >
                        {t.remove}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
        <section className="card" aria-labelledby="widget-title">
          <h2 id="widget-title" className="card-title">
            {t.widgetInstallation}
          </h2>

          <div className="card-section">
            <h3 className="form-title">{t.embedScript}</h3>
            <p className="muted small-text">{t.embedScriptHint}</p>
            <EmbedScript t={t} company={company} companyName={companyName} onAnnounce={onAnnounce} />
          </div>

          <div className="card-section">
            <h3 className="form-title">{t.companyKey}</h3>
            <p className="muted small-text">{t.companyKeyHint}</p>
            <CompanyKey t={t} companyName={companyName} companyKey={company.key} onAnnounce={onAnnounce} />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={toRemove !== null}
        title={t.removeConsultantTitle}
        description={toRemove ? t.removeConsultantDescription(displayName(toRemove, language), companyName) : ''}
        cancelLabel={t.cancel}
        confirmLabel={t.remove}
        onCancel={() => setToRemove(null)}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
