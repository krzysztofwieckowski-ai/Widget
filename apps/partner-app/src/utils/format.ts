import type { Language } from '../types';

export function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Gregorian calendar and Latin digits in both languages, so dates match the call timer.
const LOCALES: Record<Language, string> = {
  en: 'en-GB',
  ar: 'ar-SA-u-ca-gregory-nu-latn',
};

export function formatDate(isoDate: string, language: Language, withYear = true) {
  return new Intl.DateTimeFormat(LOCALES[language], {
    day: '2-digit',
    month: 'short',
    ...(withYear && { year: 'numeric' }),
  }).format(new Date(isoDate));
}

/** Arabic name when the app is in Arabic and one exists (seeded mock data); otherwise the single name. */
export function displayName(entity: { name: string; nameAr?: string }, language: Language) {
  return language === 'ar' && entity.nameAr ? entity.nameAr : entity.name;
}

/** Long durations for statistics, e.g. "2 h 14 min" or "8 min 32 s" (unit words come from i18n). */
export function formatLongDuration(
  totalSeconds: number,
  units: { hoursMinutes: (h: number, m: number) => string; minutesSeconds: (m: number, s: number) => string },
) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0 ? units.hoursMinutes(hours, minutes) : units.minutesSeconds(minutes, seconds);
}

/** "2026-09" → "September 2026" (month and year only, for the monthly report). */
export function formatMonth(monthKey: string, language: Language) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat(LOCALES[language], { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
}
