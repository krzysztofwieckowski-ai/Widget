import type { CallRecord, Company } from '../types';

export interface CallStats {
  /** Calls where the PWD user, the consultant and the translator all joined. */
  completedCalls: number;
  totalSeconds: number;
  averageSeconds: number;
}

export interface CompanyStats extends CallStats {
  company: Company;
}

export function getCallStats(calls: CallRecord[]): CallStats {
  const completed = calls.filter((call) => call.outcome === 'COMPLETED');
  const totalSeconds = completed.reduce((sum, call) => sum + call.durationSeconds, 0);
  return {
    completedCalls: completed.length,
    totalSeconds,
    averageSeconds: completed.length ? Math.round(totalSeconds / completed.length) : 0,
  };
}

/** Per-company statistics, most completed calls first. */
export function getCompanyStats(companies: Company[], calls: CallRecord[]): CompanyStats[] {
  return companies
    .map((company) => ({ company, ...getCallStats(calls.filter((call) => call.companyId === company.id)) }))
    .sort((a, b) => b.completedCalls - a.completedCalls || b.totalSeconds - a.totalSeconds);
}
