import type { CallLanguage, FacilityId, PartnerStatus } from '../types';

export const en = {
  appName: '3-Way Call',
  portalName: 'Partner Portal',
  languageSwitcher: 'Language',

  // Navigation
  mainNavigation: 'Main navigation',
  navDashboard: 'Dashboard',
  navHistory: 'History',
  navProfile: 'Profile',
  logout: 'Logout',
  incomingCallBadge: '1 incoming call',
  inCall: 'In a call',

  // Login
  loginTitle: 'Sign in',
  loginDescription: 'Sign in to receive accessibility calls from your branch.',
  email: 'Email',
  password: 'Password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  loginButton: 'Login',
  loginError: 'Enter a valid email address and a password.',

  // Status
  status: 'Status',
  statusLabels: {
    AVAILABLE: 'Available',
    BUSY: 'Busy',
    OFFLINE: 'Offline',
  } satisfies Record<PartnerStatus, string>,
  availabilitySwitchHint: 'Turn off to stop receiving calls.',
  statusChanged: (status: string) => `Status changed to ${status}.`,

  // Dashboard
  dashboardTitle: 'Dashboard',
  welcome: (name: string) => `Welcome, ${name}`,
  facility: 'Facility',
  incomingCalls: 'Incoming calls',
  noIncomingCalls: 'No incoming calls right now.',
  noIncomingCallsHint: 'New accessibility calls from your branch will appear here.',
  notAvailableHint: 'You will not receive calls until your status is Available.',
  newAccessibilityCall: 'New accessibility call',
  language: 'Language',
  callId: 'Call ID',
  joinCall: 'Join call',
  declineCall: 'Decline',
  incomingAnnouncement: (facility: string) => `New accessibility call from ${facility}.`,
  demoTools: 'Demo tools',
  demoToolsNote:
    'For testing only. Simulates a call request sent from the PWD widget. Incoming calls ring and, when this tab is in the background, show a system notification.',
  simulateIncomingCall: 'Simulate incoming call',
  simulateDelayed: (seconds: number) => `Simulate in ${seconds} s (switch tabs to test)`,
  simulatePending: (seconds: number) => `Call arriving in ${seconds} s…`,
  silenceRingtone: 'Silence ringtone',
  ringtoneOff: 'Ringtone off',
  tabTitleIncoming: 'Incoming call',
  notificationsBlocked: 'System notifications are blocked in this browser. You will still hear the ringtone.',
  callNotRoutedUnavailable: 'The call was not routed to you because your status is not Available.',
  recentCalls: 'Recent calls',
  date: 'Date',
  duration: 'Duration',
  viewCallHistory: 'View call history',
  noCallsYet: 'No calls yet.',
  callCancelledNotice: 'You left before the call started. It was added to your call history as cancelled.',
  callDeclinedNotice: 'You declined the call. It was added to your call history as declined.',
  dismiss: 'Dismiss',

  // Call
  callTitle: '3-Way Call',
  callConnected: 'Connected',
  callNotStarted: 'Not started',
  waitingForParticipants: 'Waiting for all participants',
  joinedCount: (joined: number, total: number) => `${joined} of ${total} joined`,
  lobbyNote: 'The call starts automatically when the PWD user, you and the translator have all joined.',
  callStarted: 'All participants joined. The call has started.',
  participantsCount: (count: number) => `${count} participants`,
  participants: 'Participants',
  callDuration: 'Call duration',
  pwdUser: 'PWD User',
  partnerRole: 'Partner',
  you: 'You',
  translator: 'Translator',
  stateConnected: 'Connected',
  stateSearching: 'Searching...',
  stateConnecting: 'Connecting...',
  micOn: 'Microphone on',
  micOff: 'Microphone off',
  cameraOn: 'Camera on',
  cameraOff: 'Camera off',
  callControls: 'Call controls',
  mute: 'Mute',
  camera: 'Camera',
  searchingTranslator: 'Looking for an available translator...',
  translatorFound: (name: string) => `Translator found: ${name}. Connecting...`,
  translatorJoined: (name: string) => `${name} joined the call as translator.`,
  endCall: 'End call',
  endCallTitle: 'End this call?',
  endCallDescription: 'The call will end for everyone: the PWD user, you and the translator.',
  leaveCall: 'Leave',
  leaveCallTitle: 'Leave before the call starts?',
  leaveCallDescription: 'The call has not started yet. If you leave, it will be cancelled for the PWD user.',
  cancel: 'Cancel',

  // History
  historyTitle: 'Call history',

  outcomeLabel: 'Result',
  completed: 'Completed',
  cancelled: 'Cancelled',
  declined: 'Declined',
  noHistory: 'You have no calls yet. Completed calls will appear here.',

  // Profile
  profileTitle: 'Profile',
  partnerId: 'Partner ID',

  facilities: {
    RIYADH_001: 'Riyadh Branch',
    JEDDAH_001: 'Jeddah Branch',
    DAMMAM_001: 'Dammam Branch',
  } satisfies Record<FacilityId, string>,
  facilityShort: {
    RIYADH_001: 'Riyadh',
    JEDDAH_001: 'Jeddah',
    DAMMAM_001: 'Dammam',
  } satisfies Record<FacilityId, string>,
  callLanguages: {
    Arabic: 'Arabic',
    English: 'English',
  } satisfies Record<CallLanguage, string>,
};

export type Translation = typeof en;
