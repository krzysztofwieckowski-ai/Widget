import type { CallRecord, IncomingCall } from '../types';

const al: IncomingCall = {
  id: 'h1',
  company: { name: 'Al Rawdah Bank', nameAr: 'بنك الروضة' },
  partner: { name: 'Sarah Ahmed', nameAr: 'سارة أحمد' },
  user: { name: 'Khalid', nameAr: 'خالد' },
};
const najd: IncomingCall = {
  id: 'h2',
  company: { name: 'Najd Insurance', nameAr: 'تأمين نجد' },
  partner: { name: 'Omar Haddad', nameAr: 'عمر حداد' },
  user: { name: 'Nora', nameAr: 'نورة' },
};
const sahl: IncomingCall = {
  id: 'h3',
  company: { name: 'Sahl Telecom', nameAr: 'سهل للاتصالات' },
  partner: { name: 'Layla Hassan', nameAr: 'ليلى حسن' },
  user: { name: 'Faisal', nameAr: 'فيصل' },
};

export const initialHistory: CallRecord[] = [
  { callId: 'c-105', endedAt: '2026-10-08T13:42:00', call: sahl, durationSeconds: 512, outcome: 'COMPLETED' },
  { callId: 'c-104', endedAt: '2026-10-07T09:15:00', call: najd, durationSeconds: 0, outcome: 'DECLINED' },
  { callId: 'c-103', endedAt: '2026-10-05T16:03:00', call: al, durationSeconds: 1084, outcome: 'COMPLETED' },
  { callId: 'c-102', endedAt: '2026-10-02T11:27:00', call: sahl, durationSeconds: 0, outcome: 'CANCELLED' },
  { callId: 'c-101', endedAt: '2026-09-29T14:50:00', call: najd, durationSeconds: 389, outcome: 'COMPLETED' },
];
