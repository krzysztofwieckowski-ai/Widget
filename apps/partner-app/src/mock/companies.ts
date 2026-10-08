import type { Company, Consultant } from '../types';

/** Fictional partner companies (Al Rawdah Bank is also the mock bank website in apps/bank-website). */
export const initialCompanies: Company[] = [
  {
    id: 'company-001',
    name: 'Al Rawdah Bank',
    nameAr: 'بنك الروضة',
    key: 'twc_live_7f3a9c21e4b0d58a',
    createdAt: '2026-09-01T10:00:00',
  },
  {
    id: 'company-002',
    name: 'Najd Insurance',
    nameAr: 'تأمين نجد',
    key: 'twc_live_c4d81e6b20f93a57',
    createdAt: '2026-09-10T10:00:00',
  },
  {
    id: 'company-003',
    name: 'Sahl Telecom',
    nameAr: 'سهل للاتصالات',
    key: 'twc_live_5b92f0a7d3e1c846',
    createdAt: '2026-10-01T10:00:00',
  },
];

export const initialConsultants: Consultant[] = [
  {
    id: 'consultant-001',
    name: 'Sarah Ahmed',
    nameAr: 'سارة أحمد',
    email: 'sarah@example.com',
    companyId: 'company-001',
  },
  {
    id: 'consultant-002',
    name: 'Omar Haddad',
    nameAr: 'عمر حداد',
    email: 'omar@example.com',
    companyId: 'company-001',
  },
  {
    id: 'consultant-003',
    name: 'Layla Hassan',
    nameAr: 'ليلى حسن',
    email: 'layla@example.com',
    companyId: 'company-002',
  },
];

/**
 * Random hex string. Uses crypto.getRandomValues, which every browser supports, also on
 * non-secure origins (e.g. a LAN IP) — unlike crypto.randomUUID, which is missing there
 * and in older Safari.
 */
function randomHex(bytes: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Random company key, e.g. "twc_live_3f9c…". Mock only: a real key would be issued by the backend. */
export function generateCompanyKey() {
  return `twc_live_${randomHex(8)}`;
}

export function createId(prefix: string) {
  return `${prefix}-${randomHex(4)}`;
}
