import type { Translator } from '../types';

export const mockTranslator: Translator = {
  id: 'translator-001',
  name: 'Ahmed Ali',
  nameAr: 'أحمد علي',
  languages: ['Arabic', 'English'],
  status: 'AVAILABLE',
};

/** Simulated time to find a free translator. */
export const TRANSLATOR_SEARCH_MS = 2000;

/** Simulated time for the found translator to join the call. */
export const TRANSLATOR_CONNECT_MS = 1500;
