import type { Consultant, Partner } from '../types';
import { initialConsultants } from './companies';

/** Signed in when the email does not belong to any consultant (keeps "any email works" for demos). */
const fallbackConsultant = initialConsultants[0];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Demo shortcuts: these login names work instead of an email. */
const ADMIN_LOGIN = 'admin';
const PARTNER_LOGIN = 'partner';

export type LoginResult = { role: 'admin' } | { role: 'partner'; partner: Partner } | null;

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * Mock login, no real authentication:
 * - "admin" + any password → admin panel
 * - "partner" + any password → Partner Portal, as the demo consultant
 * - any other valid email + any password → Partner Portal, as the consultant with that email,
 *   or as the demo consultant (with the typed email) when no consultant has it.
 */
export function authenticate(login: string, password: string, consultants: Consultant[]): LoginResult {
  const trimmed = login.trim();
  if (password.length === 0) return null;
  if (trimmed.toLowerCase() === ADMIN_LOGIN) return { role: 'admin' };
  if (trimmed.toLowerCase() === PARTNER_LOGIN) {
    return { role: 'partner', partner: { ...fallbackConsultant, status: 'AVAILABLE' } };
  }
  if (!isValidEmail(trimmed)) return null;

  const consultant = consultants.find((c) => c.email.toLowerCase() === trimmed.toLowerCase());
  const base = consultant ?? { ...fallbackConsultant, email: trimmed };
  return { role: 'partner', partner: { ...base, status: 'AVAILABLE' } };
}
