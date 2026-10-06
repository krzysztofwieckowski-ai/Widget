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

export function displayName(person: { name: string; nameAr: string }, language: Language) {
  return language === 'ar' ? person.nameAr : person.name;
}
