import type { IncomingCall, LocalizedName, Translator } from '../types';

export const mockTranslator: Translator = {
  id: 'translator-001',
  name: 'Ahmed Ali',
  nameAr: 'أحمد علي',
};

/**
 * Simulated lobby timeline, in ms after the translator accepts the call. The other two people
 * join one after the other, 4 seconds apart: the user after 4 s, the partner after another 4 s
 * (the call opens at 8 s). "found" = the person is found and starts connecting; "joined" = they are in the room.
 */
export const USER_FOUND_MS = 2500;
export const USER_JOINED_MS = 4000;
export const PARTNER_FOUND_MS = 6500;
export const PARTNER_JOINED_MS = 8000;

const callers: Array<Omit<IncomingCall, 'id'>> = [
  {
    company: { name: 'Al Rawdah Bank', nameAr: 'بنك الروضة' },
    partner: { name: 'Sarah Ahmed', nameAr: 'سارة أحمد' },
    user: { name: 'Khalid', nameAr: 'خالد' },
  },
  {
    company: { name: 'Najd Insurance', nameAr: 'تأمين نجد' },
    partner: { name: 'Omar Haddad', nameAr: 'عمر حداد' },
    user: { name: 'Nora', nameAr: 'نورة' },
  },
  {
    company: { name: 'Sahl Telecom', nameAr: 'سهل للاتصالات' },
    partner: { name: 'Layla Hassan', nameAr: 'ليلى حسن' },
    user: { name: 'Faisal', nameAr: 'فيصل' },
  },
];

/** Builds the next simulated incoming call, cycling through the demo callers. */
export function createIncomingCall(index: number): IncomingCall {
  return { id: `call-${Date.now()}`, ...callers[index % callers.length] };
}

export function localName(item: LocalizedName, language: 'en' | 'ar'): string {
  return language === 'ar' ? item.nameAr : item.name;
}
