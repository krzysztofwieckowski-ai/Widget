import { useEffect, useRef, useState } from 'react';
import type { CallRecord, IncomingCall, Language, Page, Partner, PartnerStatus } from './types';
import { getDirection, translations } from './i18n';
import { createIncomingCall, getRoutingResult, initialCallHistory } from './mock/calls';
import { RINGTONE_MAX_MS, startRingtone, stopRingtone, unlockAudio } from './utils/ringtone';
import {
  isNotificationBlocked,
  requestNotificationPermission,
  showIncomingCallNotification,
} from './utils/systemNotification';
import Header from './components/Header/Header';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CallPage, { type CallResult } from './pages/Call/CallPage';
import HistoryPage from './pages/History/HistoryPage';
import ProfilePage from './pages/Profile/ProfilePage';

const LANGUAGE_STORAGE_KEY = 'partner-app:language';

/** Delay of the "Simulate in 5 s" demo button, so testers can switch to another tab first. */
const SIMULATE_DELAY_S = 5;

function getInitialLanguage(): Language {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'ar' ? 'ar' : 'en';
}

/**
 * Flow: login → dashboard → (simulate) incoming call → join → lobby (translator joins automatically)
 *       → call starts with all 3 roles → end → dashboard → history
 *
 * Everything is local React state; there is no backend and no router.
 * Language is separate state (persisted in localStorage), so switching it never resets the flow.
 */
export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [activeCall, setActiveCall] = useState<IncomingCall | null>(null);
  const [history, setHistory] = useState<CallRecord[]>(initialCallHistory);
  const [endedCall, setEndedCall] = useState<CallRecord | null>(null);
  const [callNotRouted, setCallNotRouted] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [isRinging, setIsRinging] = useState(false);
  const [isCallPending, setIsCallPending] = useState(false);

  const isFirstRender = useRef(true);
  const pendingCallTimeout = useRef<number | null>(null);
  const callNotification = useRef<Notification | null>(null);
  const t = translations[language];

  // A delayed simulated call must use the partner status and language at delivery time, not at click time.
  const latest = useRef({ partner, t });
  latest.current = { partner, t };

  // Language and text direction apply to the whole document, so the entire layout mirrors in Arabic.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  // The tab title shows a waiting call, so it is visible in the tab bar from another tab.
  useEffect(() => {
    const baseTitle = `${t.appName} · ${t.portalName}`;
    document.title = incomingCall ? `(1) ${t.tabTitleIncoming} · ${baseTitle}` : baseTitle;
  }, [t, incomingCall]);

  // Ringtone while a call is waiting; stops on join, on "Silence ringtone" or after RINGTONE_MAX_MS.
  useEffect(() => {
    if (!isRinging) return;
    startRingtone();
    const timeoutId = window.setTimeout(() => setIsRinging(false), RINGTONE_MAX_MS);
    return () => {
      window.clearTimeout(timeoutId);
      stopRingtone();
    };
  }, [isRinging]);

  // Focus management: move focus to the new page heading (not on the very first load).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.querySelector<HTMLElement>('[data-page-heading]')?.focus();
  }, [page, partner === null]);

  /** Polite screen-reader announcement for things that happen without a focus change. */
  function announce(message: string) {
    setAnnouncement('');
    window.setTimeout(() => setAnnouncement(message), 50);
  }

  function navigate(nextPage: Page) {
    setPage(nextPage);
    setEndedCall(null);
    setCallNotRouted(false);
  }

  function handleLogin(loggedInPartner: Partner) {
    // The login click is a user gesture: unlock audio so later calls can ring even in a background tab.
    unlockAudio();
    setPartner(loggedInPartner);
    setPage('dashboard');
  }

  function handleLogout() {
    stopAlerting();
    if (pendingCallTimeout.current !== null) window.clearTimeout(pendingCallTimeout.current);
    pendingCallTimeout.current = null;
    setIsCallPending(false);
    setPartner(null);
    setIncomingCall(null);
    setEndedCall(null);
    setCallNotRouted(false);
  }

  function handleStatusChange(status: PartnerStatus) {
    setPartner((current) => (current ? { ...current, status } : current));
    announce(t.statusChanged(t.statusLabels[status]));
  }

  /**
   * Delivers a simulated PWD widget call from the partner's own facility (the only calls a partner
   * ever sees): card + nav badge, ringtone, screen-reader announcement, tab title and — if this tab
   * is in the background — a system notification.
   */
  function deliverIncomingCall() {
    const { partner: currentPartner, t: currentT } = latest.current;
    if (!currentPartner) return;
    const call = createIncomingCall(currentPartner.facilityId);
    const isRouted = getRoutingResult(call, currentPartner) === 'routed';
    setCallNotRouted(!isRouted);
    if (!isRouted) return;

    const message = currentT.incomingAnnouncement(currentT.facilities[call.facilityId]);
    setIncomingCall(call);
    setIsRinging(true);
    announce(message);
    callNotification.current = showIncomingCallNotification(currentT.newAccessibilityCall, message, call.callId);
  }

  function simulateIncomingCall() {
    unlockAudio();
    deliverIncomingCall();
  }

  function simulateDelayedCall() {
    unlockAudio();
    requestNotificationPermission();
    setIsCallPending(true);
    pendingCallTimeout.current = window.setTimeout(() => {
      pendingCallTimeout.current = null;
      setIsCallPending(false);
      deliverIncomingCall();
    }, SIMULATE_DELAY_S * 1000);
  }

  function stopAlerting() {
    setIsRinging(false);
    callNotification.current?.close();
    callNotification.current = null;
  }

  function joinCall() {
    if (!incomingCall) return;
    stopAlerting();
    setActiveCall(incomingCall);
    setIncomingCall(null);
    setEndedCall(null);
    setCallNotRouted(false);
    setPartner((current) => (current ? { ...current, status: 'BUSY' } : current));
    setPage('call');
  }

  /** Declining stops the alerts and logs the call in the history; the partner stays on the dashboard. */
  function declineCall() {
    if (!incomingCall) return;
    stopAlerting();
    const record: CallRecord = {
      callId: incomingCall.callId,
      endedAt: new Date().toISOString(),
      facilityId: incomingCall.facilityId,
      durationSeconds: 0,
      outcome: 'DECLINED',
    };
    setHistory((calls) => [record, ...calls]);
    setIncomingCall(null);
    // No banner; screen-reader users still hear what happened, and focus leaves the removed card.
    announce(t.callDeclinedNotice);
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-page-heading]')?.focus());
  }

  function endCall({ started, durationSeconds }: CallResult) {
    if (!activeCall) return;
    const record: CallRecord = {
      callId: activeCall.callId,
      endedAt: new Date().toISOString(),
      facilityId: activeCall.facilityId,
      durationSeconds,
      outcome: started ? 'COMPLETED' : 'CANCELLED',
    };
    setHistory((calls) => [record, ...calls]);
    setActiveCall(null);
    // A normally finished call needs no message; only a call cancelled from the lobby is explained.
    setEndedCall(started ? null : record);
    setPartner((current) => (current ? { ...current, status: 'AVAILABLE' } : current));
    setPage('dashboard');
  }

  function renderPage(currentPartner: Partner) {
    // A partner only ever sees calls from their own facility.
    const ownFacilityHistory = history.filter((call) => call.facilityId === currentPartner.facilityId);

    switch (page) {
      case 'call':
        return activeCall ? (
          <CallPage t={t} language={language} partner={currentPartner} call={activeCall} onEndCall={endCall} />
        ) : null;
      case 'history':
        return <HistoryPage t={t} language={language} history={ownFacilityHistory} />;
      case 'profile':
        return <ProfilePage t={t} language={language} partner={currentPartner} />;
      case 'dashboard':
        return (
          <DashboardPage
            t={t}
            language={language}
            partner={currentPartner}
            onStatusChange={handleStatusChange}
            incomingCall={incomingCall}
            onJoinCall={joinCall}
            onDeclineCall={declineCall}
            onSimulateCall={simulateIncomingCall}
            onSimulateDelayedCall={simulateDelayedCall}
            simulateDelaySeconds={SIMULATE_DELAY_S}
            isCallPending={isCallPending}
            isRinging={isRinging}
            onSilenceRingtone={() => setIsRinging(false)}
            notificationsBlocked={isNotificationBlocked()}
            callNotRouted={callNotRouted}
            history={ownFacilityHistory}
            endedCall={endedCall}
            onDismissEndedCall={() => setEndedCall(null)}
            onNavigate={navigate}
          />
        );
    }
  }

  return (
    <>
      {partner ? (
        <div className="app">
          <Header
            t={t}
            language={language}
            onLanguageChange={setLanguage}
            page={page}
            onNavigate={navigate}
            onLogout={handleLogout}
            hasIncomingCall={incomingCall !== null}
          />
          <main className={`app-main${page === 'call' ? ' app-main--call' : ''}`}>{renderPage(partner)}</main>
        </div>
      ) : (
        <LoginPage t={t} language={language} onLanguageChange={setLanguage} onLogin={handleLogin} />
      )}

      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
    </>
  );
}
