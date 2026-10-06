import type { Partner } from '../types';

export const mockPartner: Partner = {
  id: 'partner-001',
  name: 'Sarah Ahmed',
  nameAr: 'سارة أحمد',
  email: 'sarah@example.com',
  facilityId: 'RIYADH_001',
  status: 'AVAILABLE',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mock login: any well-formed email with any non-empty password is accepted.
 * There is no real authentication; the partner profile is always the mock partner,
 * with the email that was typed in.
 */
export function authenticate(email: string, password: string): Partner | null {
  const trimmedEmail = email.trim();
  if (!EMAIL_PATTERN.test(trimmedEmail) || password.length === 0) return null;
  return { ...mockPartner, email: trimmedEmail };
}
