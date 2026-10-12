export type Language = 'en' | 'ar';

export type Tab = 'home' | 'history' | 'profile';

/** Full-screen flow shown instead of the tab views. */
export type Screen = 'tabs' | 'call';

export type LocalizedName = { name: string; nameAr: string };

/** The people in a 3-way call (mocked). */
export type IncomingCall = {
  id: string;
  company: LocalizedName;
  /** The partner (company consultant) who started the call. */
  partner: LocalizedName;
  /** The person with a disability the translator signs for. */
  user: LocalizedName;
};

export type CallOutcome = 'COMPLETED' | 'CANCELLED' | 'DECLINED';

export type CallRecord = {
  callId: string;
  endedAt: string; // ISO timestamp
  call: IncomingCall;
  durationSeconds: number;
  /** COMPLETED = everyone joined and the call ran; CANCELLED = left before it started. DECLINED is kept for older records. */
  outcome: CallOutcome;
};

export type CallResult = {
  /** True once all three people were in the room. */
  started: boolean;
  durationSeconds: number;
};

export type Translator = LocalizedName & {
  id: string;
};
