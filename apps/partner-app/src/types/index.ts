export type Language = 'en' | 'ar';

/** The partner switches between AVAILABLE and OFFLINE; BUSY is set automatically during a call. */
export type PartnerStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

/** Language the PWD user communicates in. */
export type CallLanguage = 'Arabic' | 'English';

/** Screens shown after login. There is no router: the current page is plain React state. */
export type Page = 'dashboard' | 'call' | 'history' | 'profile';

/** Admin panel screens. */
export type AdminPage = 'companies' | 'company' | 'statistics';

/** A partner company (e.g. a bank). Its key links the company's PWD widget to it. */
export interface Company {
  id: string;
  name: string;
  /** Mock-only: Arabic name for seeded companies; companies added by the admin have one name. */
  nameAr?: string;
  key: string;
  createdAt: string;
}

/** A person assigned by the admin to a partner company; signs in to the Partner Portal. */
export interface Consultant {
  id: string;
  name: string;
  /** Mock-only: the same name written in Arabic, shown when the app is in Arabic. */
  nameAr?: string;
  email: string;
  companyId: string;
}

/** The consultant signed in to the Partner Portal, with their live availability. */
export interface Partner extends Consultant {
  status: PartnerStatus;
}

/** A call request coming from a company's PWD widget (simulated). */
export interface IncomingCall {
  callId: string;
  companyId: string;
  language: CallLanguage;
}

export interface Translator {
  id: string;
  name: string;
  nameAr: string;
  languages: CallLanguage[];
  status: 'AVAILABLE' | 'BUSY';
}

/**
 * searching → connecting → connected. Starts automatically when the partner joins:
 * "searching" = looking for a free translator, "connecting" = found, joining the call.
 */
export type TranslatorState = 'searching' | 'connecting' | 'connected';

export type CallOutcome = 'COMPLETED' | 'CANCELLED' | 'DECLINED';

export interface CallRecord {
  callId: string;
  /** ISO date-time of when the call ended. */
  endedAt: string;
  companyId: string;
  consultantId: string;
  durationSeconds: number;
  /**
   * COMPLETED = all three roles joined (a call never runs without a translator).
   * CANCELLED = the partner left the lobby before everyone joined.
   * DECLINED  = the partner declined the incoming call.
   */
  outcome: CallOutcome;
}
