export type Language = 'en' | 'ar';

/** The partner switches between AVAILABLE and OFFLINE; BUSY is set automatically during a call. */
export type PartnerStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type FacilityId = 'RIYADH_001' | 'JEDDAH_001' | 'DAMMAM_001';

/** Language the PWD user communicates in. */
export type CallLanguage = 'Arabic' | 'English';

/** Screens shown after login. There is no router: the current page is plain React state. */
export type Page = 'dashboard' | 'call' | 'history' | 'profile';

export interface Partner {
  id: string;
  name: string;
  /** Mock-only: the same name written in Arabic, shown when the app is in Arabic. */
  nameAr: string;
  email: string;
  facilityId: FacilityId;
  status: PartnerStatus;
}

/** A call request coming from the PWD widget (simulated). */
export interface IncomingCall {
  callId: string;
  facilityId: FacilityId;
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
  facilityId: FacilityId;
  durationSeconds: number;
  /**
   * COMPLETED = all three roles joined (a call never runs without a translator).
   * CANCELLED = the partner left the lobby before everyone joined.
   * DECLINED  = the partner declined the incoming call.
   */
  outcome: CallOutcome;
}
