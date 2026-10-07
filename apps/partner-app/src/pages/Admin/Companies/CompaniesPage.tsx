import { useState, type FormEvent } from 'react';
import type { CallRecord, Company, Consultant, Language } from '../../../types';
import type { Translation } from '../../../i18n';
import { getCallStats } from '../../../utils/stats';
import { displayName } from '../../../utils/format';
import { ChevronForwardIcon, PlusIcon } from '../../../components/icons';

type CompaniesPageProps = {
  t: Translation;
  language: Language;
  companies: Company[];
  consultants: Consultant[];
  calls: CallRecord[];
  onCreateCompany: (name: string) => void;
  onOpenCompany: (companyId: string) => void;
};

/** Partner companies as one simple table, with a one-line "add company" form under it. */
export default function CompaniesPage({
  t,
  language,
  companies,
  consultants,
  calls,
  onCreateCompany,
  onOpenCompany,
}: CompaniesPageProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError(t.companyNameRequired);
    const taken = companies.some((c) =>
      [c.name, c.nameAr].some((existing) => existing?.toLowerCase() === trimmed.toLowerCase()),
    );
    if (taken) return setError(t.companyNameTaken);
    onCreateCompany(trimmed);
  }

  return (
    <div className="page page--narrow">
      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.companiesTitle}
      </h1>

      <section className="card" aria-labelledby="companies-table-title">
        <h2 id="companies-table-title" className="visually-hidden">
          {t.companiesTitle}
        </h2>
        {companies.length === 0 ? (
          <p className="muted">{t.noCompanies}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{t.company}</th>
                <th scope="col" className="num">
                  {t.consultants}
                </th>
                <th scope="col" className="num">
                  {t.statsCompletedCalls}
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <th scope="row">
                    <button type="button" className="link-button" onClick={() => onOpenCompany(company.id)}>
                      {displayName(company, language)}
                      <ChevronForwardIcon />
                    </button>
                  </th>
                  <td className="num">{consultants.filter((c) => c.companyId === company.id).length}</td>
                  <td className="num">
                    {getCallStats(calls.filter((call) => call.companyId === company.id)).completedCalls}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form className="inline-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="company-name" className="field-label">
              {t.companyName}
            </label>
            <input
              id="company-name"
              className="input"
              value={name}
              aria-invalid={error !== null}
              aria-describedby={error ? 'company-name-error' : undefined}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
            />
          </div>
          <button type="submit" className="button button--primary">
            <PlusIcon />
            {t.addCompany}
          </button>
          {error && (
            <p id="company-name-error" className="field-error inline-form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
