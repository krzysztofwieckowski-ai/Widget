import { useEffect, useRef, useState } from 'react';
import type { AdminPage, CallRecord, Company, Consultant, Language } from '../../types';
import type { Translation } from '../../i18n';
import Header from '../../components/Header/Header';
import { BuildingIcon, ChartIcon } from '../../components/icons';
import CompaniesPage from './Companies/CompaniesPage';
import CompanyPage from './Company/CompanyPage';
import NewCompanyPage from './NewCompany/NewCompanyPage';
import StatisticsPage from './Statistics/StatisticsPage';

type AdminAppProps = {
  t: Translation;
  language: Language;
  onLanguageChange: (language: Language) => void;
  companies: Company[];
  consultants: Consultant[];
  calls: CallRecord[];
  /** Returns the new company so the admin can be taken straight to it. */
  onCreateCompany: (name: string) => Company;
  onAssignConsultant: (consultant: Omit<Consultant, 'id'>) => void;
  onRemoveConsultant: (consultantId: string) => void;
  onLogout: () => void;
  onAnnounce: (message: string) => void;
};

/** Admin panel: partner companies (with their consultants and widget key) and call statistics. */
export default function AdminApp({
  t,
  language,
  onLanguageChange,
  companies,
  consultants,
  calls,
  onCreateCompany,
  onAssignConsultant,
  onRemoveConsultant,
  onLogout,
  onAnnounce,
}: AdminAppProps) {
  const [page, setPage] = useState<AdminPage>('companies');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  // Move focus to the new page heading on every page change (not on the first render after login,
  // which App already handles).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.querySelector<HTMLElement>('[data-page-heading]')?.focus();
  }, [page, companyId]);

  function navigate(next: 'companies' | 'statistics') {
    setPage(next);
    setCompanyId(null);
    setCreatedCompanyId(null);
  }

  function openCompany(id: string) {
    setCompanyId(id);
    setPage('company');
    setCreatedCompanyId(null);
  }

  function createCompany(name: string) {
    const company = onCreateCompany(name);
    openCompany(company.id);
    setCreatedCompanyId(company.id);
  }

  const company = companies.find((c) => c.id === companyId);

  function renderPage() {
    if (page === 'new-company') {
      return (
        <NewCompanyPage t={t} companies={companies} onCreate={createCompany} onCancel={() => navigate('companies')} />
      );
    }
    if (page === 'company' && company) {
      return (
        <CompanyPage
          t={t}
          language={language}
          company={company}
          companies={companies}
          consultants={consultants}
          calls={calls}
          justCreated={createdCompanyId === company.id}
          onBack={() => navigate('companies')}
          onAssignConsultant={onAssignConsultant}
          onRemoveConsultant={onRemoveConsultant}
          onAnnounce={onAnnounce}
        />
      );
    }
    if (page === 'statistics') {
      return (
        <StatisticsPage
          t={t}
          language={language}
          companies={companies}
          calls={calls}
          onOpenCompany={openCompany}
        />
      );
    }
    return (
      <CompaniesPage
        t={t}
        language={language}
        companies={companies}
        consultants={consultants}
        calls={calls}
        onAddCompany={() => setPage('new-company')}
        onOpenCompany={openCompany}
      />
    );
  }

  return (
    <div className="app">
      <Header
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        subtitle={t.adminPanel}
        navItems={[
          { key: 'companies' as const, label: t.navCompanies, icon: <BuildingIcon /> },
          { key: 'statistics' as const, label: t.navStatistics, icon: <ChartIcon /> },
        ]}
        // The company detail page belongs to "Companies".
        currentKey={page === 'statistics' ? 'statistics' : 'companies'}
        onNavigate={navigate}
        onLogout={onLogout}
      />
      <main className="app-main">{renderPage()}</main>
    </div>
  );
}
