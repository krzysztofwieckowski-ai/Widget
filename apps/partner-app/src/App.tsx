import { useEffect, useRef, useState } from 'react';
import type { CallRecord, Company, Consultant, IncomingCall, Language, Page, Partner, PartnerStatus } from './types';
import { getDirection, translations } from './i18n';
import { createIncomingCall, getRoutingResult, initialCallHistory } from './mock/calls';
import { createId, generateCompanyKey, initialCompanies, initialConsultants } from './mock/companies';
import { authenticate } from './mock/partner';
import { displayName } from './utils/format';
import { RINGTONE_MAX_MS, startRingtone, stopRingtone, unlockAudio } from './utils/ringtone';
import {
  isNotificationBlocked,
  requestNotificationPermission,
  showIncomingCallNotification,
} from './utils/systemNotification';
import { useTabCallIndicator } from './hooks/useTabCallIndicator';
import Header from './components/Header/Header';
import { DashboardIcon, HistoryIcon, UserIcon } from './components/icons';
import AdminApp from './pages/Admin/AdminApp';
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
 * Two roles share this app and its in-memory data (companies, consultants, call history):
 * - admin ("admin" + any password): manages partner companies, their consultants and sees statistics;
 * - consultant (any other email): the Partner Portal below.
 *
 * Partner Portal flow: login → dashboard → (simulate) incoming call → join → lobby (translator joins automatically)
 *       → call starts with all 3 roles → end → dashboard → history
 *
 * Everything is local React state; there is no backend and no router.
 * Language is separate state (persisted in localStorage), so switching it never resets the flow.
 */
export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
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
  const latest = useRef({ partner, t, companies, language });
  latest.current = { partner, t, companies, language };

  // Language and text direction apply to the whole document, so the entire layout mirrors in Arabic.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  // A waiting call shows in the browser tab itself (title + favicon), so it is noticeable from another tab.
  useTabCallIndicator(incomingCall !== null, {
    baseTitle: `${t.appName} · ${isAdmin ? t.adminPanel : t.portalName}`,
    incomingLabel: t.tabTitleIncoming,
  });

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
  }, [page, partner === null, isAdmin]);

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

  /** Returns false when the login is rejected (empty password or neither "admin" nor an email). */
  function handleLogin(login: string, password: string) {
    const result = authenticate(login, password, consultants);
    if (!result) return false;
    if (result.role === 'admin') {
      setIsAdmin(true);
      return true;
    }
    // The login click is a user gesture: unlock audio so later calls can ring even in a background tab,
    // and ask once for permission to show system notifications for incoming calls.
    unlockAudio();
    requestNotificationPermission();
    setPartner(result.partner);
    setPage('dashboard');
    return true;
  }

  function createCompany(name: string): Company {
    const company: Company = { id: createId('company'), name, key: generateCompanyKey(), createdAt: new Date().toISOString() };
    setCompanies((current) => [...current, company]);
    return company;
  }

  function assignConsultant(consultant: Omit<Consultant, 'id'>) {
    // The id is created here, not inside the state updater, so the updater stays pure.
    const newConsultant: Consultant = { ...consultant, id: createId('consultant') };
    setConsultants((current) => [...current, newConsultant]);
  }

  function removeConsultant(consultantId: string) {
    setConsultants((current) => current.filter((c) => c.id !== consultantId));
  }

  function handleLogout() {
    stopAlerting();
    if (pendingCallTimeout.current !== null) window.clearTimeout(pendingCallTimeout.current);
    pendingCallTimeout.current = null;
    setIsCallPending(false);
    setIsAdmin(false);
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
   * Delivers a simulated PWD widget call for the consultant's own company (the only calls a consultant
   * ever sees): card + nav badge, ringtone, screen-reader announcement, tab title and — if this tab
   * is in the background — a system notification.
   */
  function deliverIncomingCall() {
    const { partner: currentPartner, t: currentT, companies: currentCompanies, language: currentLanguage } = latest.current;
    if (!currentPartner) return;
    const call = createIncomingCall(currentPartner);
    const isRouted = getRoutingResult(call, currentPartner) === 'routed';
    setCallNotRouted(!isRouted);
    if (!isRouted) return;

    const company = currentCompanies.find((c) => c.id === call.companyId);
    const message = currentT.incomingAnnouncement(company ? displayName(company, currentLanguage) : '');
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
      companyId: incomingCall.companyId,
      consultantId: partner?.id ?? '',
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
      companyId: activeCall.companyId,
      consultantId: partner?.id ?? '',
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
    // A consultant only ever sees the calls they handled (all for their own company).
    const ownHistory = history.filter((call) => call.consultantId === currentPartner.id);
    const company = companies.find((c) => c.id === currentPartner.companyId);
    const companyName = company ? displayName(company, language) : '';

    switch (page) {
      case 'call':
        return activeCall ? (
          <CallPage
            t={t}
            language={language}
            partner={currentPartner}
            companyName={companyName}
            call={activeCall}
            onEndCall={endCall}
          />
        ) : null;
      case 'history':
        return <HistoryPage t={t} language={language} history={ownHistory} />;
      case 'profile':
        return <ProfilePage t={t} language={language} partner={currentPartner} companyName={companyName} />;
      case 'dashboard':
        return (
          <DashboardPage
            t={t}
            language={language}
            partner={currentPartner}
            companyName={companyName}
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
            history={ownHistory}
            endedCall={endedCall}
            onDismissEndedCall={() => setEndedCall(null)}
            onNavigate={navigate}
          />
        );
    }
  }

  return (
    <>
      {isAdmin ? (
        <AdminApp
          t={t}
          language={language}
          onLanguageChange={setLanguage}
          companies={companies}
          consultants={consultants}
          calls={history}
          onCreateCompany={createCompany}
          onAssignConsultant={assignConsultant}
          onRemoveConsultant={removeConsultant}
          onLogout={handleLogout}
          onAnnounce={announce}
        />
      ) : partner ? (
        <div className="app">
          <Header
            t={t}
            language={language}
            onLanguageChange={setLanguage}
            subtitle={t.portalName}
            navItems={[
              {
                key: 'dashboard' as const,
                label: t.navDashboard,
                icon: <DashboardIcon />,
                badge: { count: incomingCall ? 1 : 0, badgeLabel: t.incomingCallBadge },
              },
              { key: 'history' as const, label: t.navHistory, icon: <HistoryIcon /> },
              { key: 'profile' as const, label: t.navProfile, icon: <UserIcon /> },
            ]}
            currentKey={page === 'call' ? null : page}
            onNavigate={navigate}
            onLogout={handleLogout}
            inCall={page === 'call'}
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
