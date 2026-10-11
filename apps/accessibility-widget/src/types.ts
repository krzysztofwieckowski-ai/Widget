export type Language = 'ar' | 'en';

/**
 * The steps inside the widget, in order. "Closed" is tracked separately (isOpen).
 * The call itself (waiting, video call, ended, unavailable) happens on the separate call page.
 */
export type Step = 'welcome' | 'request';
