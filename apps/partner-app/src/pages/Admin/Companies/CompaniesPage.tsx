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
  onAddCompany: () => void;
  onOpenCompany: (companyId: string) => void;
};

/** Partner companies as one simple table; "Add company" opens a separate page. */
export default function CompaniesPage({
  t,
  language,
  companies,
  consultants,
  calls,
  onAddCompany,
  onOpenCompany,
}: CompaniesPageProps) {
  return (
    <div className="page page--narrow">
      <div className="page-header">
        <h1 className="page-title" tabIndex={-1} data-page-heading>
          {t.companiesTitle}
        </h1>
        <button type="button" className="button button--primary" onClick={onAddCompany}>
          <PlusIcon />
          {t.addCompany}
        </button>
      </div>

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
      </section>
    </div>
  );
}
