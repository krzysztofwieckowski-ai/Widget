import type { CallLanguage, CallRecord, FacilityId, IncomingCall, Partner } from '../types';

let nextCallNumber = 1;

/** Simulates a call request sent by the PWD widget from the given facility. */
export function createIncomingCall(facilityId: FacilityId, language: CallLanguage = 'Arabic'): IncomingCall {
  const callId = `CALL-${String(nextCallNumber).padStart(3, '0')}`;
  nextCallNumber += 1;
  return { callId, facilityId, language };
}

/**
 * Simulated routing: a partner only receives calls from their own facility,
 * and only while they are available. No GPS / IP / location detection.
 */
export function getRoutingResult(call: IncomingCall, partner: Partner) {
  if (call.facilityId !== partner.facilityId) return 'other-facility' as const;
  if (partner.status !== 'AVAILABLE') return 'partner-unavailable' as const;
  return 'routed' as const;
}

/** Calls the partner already handled before this session (newest first). */
export const initialCallHistory: CallRecord[] = [
  {
    callId: 'CALL-098',
    endedAt: '2026-10-06T09:14:00',
    facilityId: 'RIYADH_001',
    language: 'Arabic',
    durationSeconds: 8 * 60 + 32,
    withTranslator: true,
    outcome: 'COMPLETED',
  },
  {
    callId: 'CALL-097',
    endedAt: '2026-10-05T15:40:00',
    facilityId: 'RIYADH_001',
    language: 'English',
    durationSeconds: 4 * 60 + 15,
    withTranslator: false,
    outcome: 'COMPLETED',
  },
];
