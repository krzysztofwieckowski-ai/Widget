import type { Language } from '../types';
import { en, type Translation } from './en';
import { ar } from './ar';

export type { Translation };

export const translations: Record<Language, Translation> = { en, ar };

export function getDirection(language: Language): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr';
}
