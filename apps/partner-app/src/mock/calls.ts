import type { CallLanguage, CallRecord, IncomingCall, Partner } from '../types';

let nextCallNumber = 1;

/** Simulates a call request sent by the partner company's PWD widget (identified by its company key). */
export function createIncomingCall(partner: Partner, language: CallLanguage = 'Arabic'): IncomingCall {
  const callId = `CALL-${String(nextCallNumber).padStart(3, '0')}`;
  nextCallNumber += 1;
  return { callId, companyId: partner.companyId, language };
}

/**
 * Simulated routing: a consultant receives every call of their own company (no branches),
 * and only while they are available. No GPS / IP / location detection.
 */
export function getRoutingResult(call: IncomingCall, partner: Partner) {
  if (call.companyId !== partner.companyId) return 'other-company' as const;
  if (partner.status !== 'AVAILABLE') return 'partner-unavailable' as const;
  return 'routed' as const;
}

const minutes = (m: number, s: number) => m * 60 + s;

/** Calls handled before this session (newest first), across companies, for history and statistics. */
export const initialCallHistory: CallRecord[] = [
  { callId: 'CALL-098', endedAt: '2026-10-06T09:14:00', companyId: 'company-001', consultantId: 'consultant-001', durationSeconds: minutes(8, 32), outcome: 'COMPLETED' },
  { callId: 'CALL-097', endedAt: '2026-10-05T15:40:00', companyId: 'company-001', consultantId: 'consultant-001', durationSeconds: minutes(4, 15), outcome: 'COMPLETED' },
  { callId: 'CALL-096', endedAt: '2026-10-05T11:02:00', companyId: 'company-001', consultantId: 'consultant-002', durationSeconds: minutes(12, 5), outcome: 'COMPLETED' },
  { callId: 'CALL-095', endedAt: '2026-10-04T16:20:00', companyId: 'company-002', consultantId: 'consultant-003', durationSeconds: minutes(15, 20), outcome: 'COMPLETED' },
  { callId: 'CALL-094', endedAt: '2026-10-04T10:41:00', companyId: 'company-002', consultantId: 'consultant-003', durationSeconds: minutes(9, 41), outcome: 'COMPLETED' },
  { callId: 'CALL-093', endedAt: '2026-10-03T14:48:00', companyId: 'company-001', consultantId: 'consultant-002', durationSeconds: minutes(6, 48), outcome: 'COMPLETED' },
  { callId: 'CALL-092', endedAt: '2026-10-03T09:58:00', companyId: 'company-002', consultantId: 'consultant-003', durationSeconds: minutes(3, 58), outcome: 'COMPLETED' },
  { callId: 'CALL-091', endedAt: '2026-10-02T13:10:00', companyId: 'company-001', consultantId: 'consultant-002', durationSeconds: 0, outcome: 'CANCELLED' },
  { callId: 'CALL-090', endedAt: '2026-10-02T08:30:00', companyId: 'company-001', consultantId: 'consultant-001', durationSeconds: 0, outcome: 'DECLINED' },
  { callId: 'CALL-089', endedAt: '2026-10-01T12:12:00', companyId: 'company-002', consultantId: 'consultant-003', durationSeconds: minutes(11, 12), outcome: 'COMPLETED' },
];
