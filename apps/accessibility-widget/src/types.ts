export type Language = 'ar' | 'en';

/** The steps of the assistance flow, in order. "Closed" is tracked separately (isOpen). */
export type Step = 'welcome' | 'request' | 'waiting' | 'call' | 'ended';
