import type { CallRecord, Consultant } from '../types';
import { getCallStats, type CallStats } from './stats';

/** "2026-09": the calendar month (local time) a call ended in. */
export function monthKeyOf(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Months that have at least one call of the company, newest first. */
export function getReportMonths(calls: CallRecord[], companyId: string) {
  const months = new Set(calls.filter((call) => call.companyId === companyId).map((call) => monthKeyOf(call.endedAt)));
  return [...months].sort().reverse();
}

export interface ConsultantReportRow extends CallStats {
  consultantId: string;
  /** Undefined when the consultant was removed since: their calls still count. */
  consultant?: Consultant;
  cancelled: number;
  declined: number;
}

export interface MonthlyReport {
  month: string;
  totals: CallStats & { cancelled: number; declined: number; requests: number };
  /** Who handled the calls: one row per consultant, most completed calls first. */
  rows: ConsultantReportRow[];
  /** Every call request of the month, oldest first. */
  calls: CallRecord[];
}

/** The data of one company's report for one calendar month (what would be e-mailed to the contact). */
export function buildMonthlyReport(
  calls: CallRecord[],
  consultants: Consultant[],
  companyId: string,
  month: string,
): MonthlyReport {
  const monthCalls = calls
    .filter((call) => call.companyId === companyId && monthKeyOf(call.endedAt) === month)
    .sort((a, b) => a.endedAt.localeCompare(b.endedAt));

  const consultantIds = [...new Set(monthCalls.map((call) => call.consultantId))];
  const rows = consultantIds
    .map((consultantId) => {
      const own = monthCalls.filter((call) => call.consultantId === consultantId);
      return {
        consultantId,
        consultant: consultants.find((c) => c.id === consultantId),
        ...getCallStats(own),
        cancelled: own.filter((call) => call.outcome === 'CANCELLED').length,
        declined: own.filter((call) => call.outcome === 'DECLINED').length,
      };
    })
    .sort((a, b) => b.completedCalls - a.completedCalls || b.totalSeconds - a.totalSeconds);

  return {
    month,
    totals: {
      ...getCallStats(monthCalls),
      cancelled: monthCalls.filter((call) => call.outcome === 'CANCELLED').length,
      declined: monthCalls.filter((call) => call.outcome === 'DECLINED').length,
      requests: monthCalls.length,
    },
    rows,
    calls: monthCalls,
  };
}

/** The month a report sent today covers (the previous calendar month) and the date of the next send. */
export function getNextReportSend(now = new Date()) {
  const sendDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 8, 0, 0);
  const coveredMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return { sendDate: sendDate.toISOString(), coveredMonth };
}
