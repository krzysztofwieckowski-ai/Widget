import type { Translator } from '../types';

export const mockTranslator: Translator = {
  id: 'translator-001',
  name: 'Ahmed Ali',
  nameAr: 'أحمد علي',
  languages: ['Arabic', 'English'],
  status: 'AVAILABLE',
};

/**
 * Simulated lobby timeline, in ms after the partner joins. The other people join one after the other,
 * 4 seconds apart: the user after 4 s, the translator after another 4 s (the call opens at 8 s).
 * "found" = the person is found and starts connecting; "joined" = they are in the room.
 */
export const USER_FOUND_MS = 2500;
export const USER_JOINED_MS = 4000;
export const TRANSLATOR_FOUND_MS = 6500;
export const TRANSLATOR_JOINED_MS = 8000;
