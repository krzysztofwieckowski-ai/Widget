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
  loginError: 'Incorrect email or password. Please try again.',
  demoCredentials: 'Demo credentials',
  fillDemoCredentials: 'Fill in demo credentials',

  // Status
  status: 'Status',
  statusLabels: {
    AVAILABLE: 'Available',
    BUSY: 'Busy',
    AWAY: 'Away',
    OFFLINE: 'Offline',
  } satisfies Record<PartnerStatus, string>,
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
  incomingAnnouncement: (facility: string, language: string) =>
    `New accessibility call from ${facility}. Language: ${language}.`,
  demoTools: 'Demo tools',
  demoToolsNote: 'For testing only. Simulates a call request sent from the PWD widget.',
  simulateIncomingCall: 'Simulate incoming call',
  simulateOtherFacility: (facility: string) => `Simulate call for ${facility}`,
  callRoutedElsewhere: (facility: string) =>
    `A call for ${facility} was not routed to you. You only receive calls from your own branch.`,
  callNotRoutedUnavailable: 'The call was not routed to you because your status is not Available.',
  recentCalls: 'Recent calls',
  date: 'Date',
  duration: 'Duration',
  viewCallHistory: 'View call history',
  noCallsYet: 'No calls yet.',
  callEndedNotice: (duration: string) => `Call ended (${duration}). It was added to your call history.`,
  callCancelledNotice: 'You left before the call started. It was added to your call history as cancelled.',
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
  translatorFound: (name: string, languages: string) =>
    `Translator found: ${name} (${languages}). Connecting...`,
  translatorJoined: (name: string, languages: string) => `${name} (${languages}) joined the call as translator.`,
  endCall: 'End call',
  endCallTitle: 'End this call?',
  endCallDescription: 'The call will end for everyone: the PWD user, you and the translator.',
  leaveCall: 'Leave',
  leaveCallTitle: 'Leave before the call starts?',
  leaveCallDescription: 'The call has not started yet. If you leave, it will be cancelled for the PWD user.',
  cancel: 'Cancel',

  // History
  historyTitle: 'Call history',
  translatorUsed: 'Translator',
  yes: 'Yes',
  no: 'No',
  outcome: 'Result',
  completed: 'Completed',
  cancelled: 'Cancelled',
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
