import type { Partner } from '../types';

export const DEMO_CREDENTIALS = {
  email: 'sarah@example.com',
  password: 'Password123!',
};

export const mockPartner: Partner = {
  id: 'partner-001',
  name: 'Sarah Ahmed',
  nameAr: 'سارة أحمد',
  email: 'sarah@example.com',
  facilityId: 'RIYADH_001',
  status: 'AVAILABLE',
};

/** Mock login: no real authentication, just a comparison with the demo credentials. */
export function authenticate(email: string, password: string): Partner | null {
  const matches =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
  return matches ? { ...mockPartner } : null;
}
