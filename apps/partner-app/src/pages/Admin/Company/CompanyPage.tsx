import { useState, type FormEvent } from 'react';
import type { CallRecord, Company, Consultant, Language } from '../../../types';
import type { Translation } from '../../../i18n';
import { isValidEmail } from '../../../mock/partner';
import { getCallStats } from '../../../utils/stats';
import { displayName, formatLongDuration } from '../../../utils/format';
import CompanyKey from '../../../components/CompanyKey/CompanyKey';
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

type FieldErrors = { name?: string; email?: string };

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
  const [name, setName] = useState('');
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
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const nextErrors: FieldErrors = {};
    if (!trimmedName) nextErrors.name = t.consultantNameRequired;
    if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = t.emailInvalid;
    } else {
      const owner = consultants.find((c) => c.email.toLowerCase() === trimmedEmail.toLowerCase());
      const ownerCompany = owner && companies.find((c) => c.id === owner.companyId);
      if (ownerCompany) nextErrors.email = t.emailTaken(displayName(ownerCompany, language));
    }
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email) {
      document.getElementById(nextErrors.name ? 'consultant-name' : 'consultant-email')?.focus();
      return;
    }

    onAssignConsultant({ name: trimmedName, email: trimmedEmail, companyId: company.id });
    onAnnounce(t.consultantAssigned(trimmedName));
    setName('');
    setEmail('');
  }

  function confirmRemove() {
    if (!toRemove) return;
    onRemoveConsultant(toRemove.id);
    onAnnounce(t.consultantRemoved(displayName(toRemove, language)));
    setToRemove(null);
  }

  return (
    <div className="page page--narrow">
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

      <section className="card" aria-labelledby="company-key-title">
        <h2 id="company-key-title" className="card-title">
          {t.companyKey}
        </h2>
        <CompanyKey t={t} companyName={companyName} companyKey={company.key} onAnnounce={onAnnounce} />
        <p className="muted small-text">{t.companyKeyHint}</p>
      </section>

      <section className="card" aria-labelledby="consultants-title">
        <h2 id="consultants-title" className="card-title">
          {t.consultants}
        </h2>

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

        <form className="inline-form" onSubmit={handleAssign} noValidate aria-label={t.assignConsultant}>
          <div className="field">
            <label htmlFor="consultant-name" className="field-label">
              {t.consultantName}
            </label>
            <input
              id="consultant-name"
              className="input"
              value={name}
              aria-invalid={errors.name !== undefined}
              aria-describedby={errors.name ? 'consultant-name-error' : undefined}
              onChange={(event) => setName(event.target.value)}
            />
            {errors.name && (
              <p id="consultant-name-error" className="field-error">
                {errors.name}
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
                {errors.email}
              </p>
            )}
          </div>
          <button type="submit" className="button button--primary">
            <PlusIcon />
            {t.assignConsultant}
          </button>
        </form>
      </section>

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
