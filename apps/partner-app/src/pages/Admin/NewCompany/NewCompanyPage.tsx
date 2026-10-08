import { useState, type FormEvent } from 'react';
import type { Company } from '../../../types';
import type { Translation } from '../../../i18n';
import { ChevronBackIcon, PlusIcon } from '../../../components/icons';

type NewCompanyPageProps = {
  t: Translation;
  companies: Company[];
  onCreate: (name: string) => void;
  onCancel: () => void;
};

/** Separate page for adding a partner company; afterwards the admin lands on the new company's page. */
export default function NewCompanyPage({ t, companies, onCreate, onCancel }: NewCompanyPageProps) {
  const [name, setName] = useState('');
  // Error kind, not text, so the message follows a language switch.
  const [error, setError] = useState<'required' | 'taken' | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    const taken = companies.some((c) =>
      [c.name, c.nameAr].some((existing) => existing?.toLowerCase() === trimmed.toLowerCase()),
    );
    const nextError = !trimmed ? 'required' : taken ? 'taken' : null;
    setError(nextError);
    if (nextError) {
      document.getElementById('company-name')?.focus();
      return;
    }
    onCreate(trimmed);
  }

  return (
    <div className="page page--narrow">
      <button type="button" className="link-button" onClick={onCancel}>
        <ChevronBackIcon />
        {t.allCompanies}
      </button>

      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.addCompany}
      </h1>

      <form className="card" onSubmit={handleSubmit} noValidate aria-labelledby="new-company-hint">
        <div className="field">
          <label htmlFor="company-name" className="field-label">
            {t.companyName}
          </label>
          <input
            id="company-name"
            className="input"
            value={name}
            aria-invalid={error !== null}
            aria-describedby={`new-company-hint${error ? ' company-name-error' : ''}`}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
          />
          {error && (
            <p id="company-name-error" className="field-error">
              {error === 'required' ? t.companyNameRequired : t.companyNameTaken}
            </p>
          )}
        </div>
        <p id="new-company-hint" className="muted small-text">
          {t.newCompanyHint}
        </p>
        <div className="form-actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            {t.cancel}
          </button>
          <button type="submit" className="button button--primary">
            <PlusIcon />
            {t.createCompany}
          </button>
        </div>
      </form>
    </div>
  );
}
