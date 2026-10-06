import { useEffect, useRef, useState } from 'react';
import type { CallRecord, FacilityId, IncomingCall, Language, Page, Partner, PartnerStatus } from './types';
import { getDirection, translations } from './i18n';
import { createIncomingCall, getRoutingResult, initialCallHistory } from './mock/calls';
import Header from './components/Header/Header';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage, { type RoutingMessage } from './pages/Dashboard/DashboardPage';
import CallPage, { type CallResult } from './pages/Call/CallPage';
import HistoryPage from './pages/History/HistoryPage';
import ProfilePage from './pages/Profile/ProfilePage';

const LANGUAGE_STORAGE_KEY = 'partner-app:language';

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
  const [routingMessage, setRoutingMessage] = useState<RoutingMessage>(null);
  const [announcement, setAnnouncement] = useState('');

  const isFirstRender = useRef(true);
  const t = translations[language];

  // Language and text direction apply to the whole document, so the entire layout mirrors in Arabic.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    document.title = `${t.appName} · ${t.portalName}`;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, t]);

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
    setRoutingMessage(null);
  }

  function handleLogin(loggedInPartner: Partner) {
    setPartner(loggedInPartner);
    setPage('dashboard');
  }

  function handleLogout() {
    setPartner(null);
    setIncomingCall(null);
    setEndedCall(null);
    setRoutingMessage(null);
  }

  function handleStatusChange(status: PartnerStatus) {
    setPartner((current) => (current ? { ...current, status } : current));
    announce(t.statusChanged(t.statusLabels[status]));
  }

  function simulateIncomingCall(facilityId: FacilityId) {
    if (!partner) return;
    const call = createIncomingCall(facilityId);
    const result = getRoutingResult(call, partner);

    if (result === 'routed') {
      setRoutingMessage(null);
      setIncomingCall(call);
      announce(t.incomingAnnouncement(t.facilities[call.facilityId], t.callLanguages[call.language]));
    } else if (result === 'other-facility') {
      setRoutingMessage({ type: 'other-facility', facilityId });
    } else {
      setRoutingMessage({ type: 'partner-unavailable' });
    }
  }

  function joinCall() {
    if (!incomingCall) return;
    setActiveCall(incomingCall);
    setIncomingCall(null);
    setEndedCall(null);
    setRoutingMessage(null);
    setPartner((current) => (current ? { ...current, status: 'BUSY' } : current));
    setPage('call');
  }

  function endCall({ started, durationSeconds }: CallResult) {
    if (!activeCall) return;
    const record: CallRecord = {
      callId: activeCall.callId,
      endedAt: new Date().toISOString(),
      facilityId: activeCall.facilityId,
      language: activeCall.language,
      durationSeconds,
      // A call only starts once the translator has joined, so every started call had one.
      withTranslator: started,
      outcome: started ? 'COMPLETED' : 'CANCELLED',
    };
    setHistory((calls) => [record, ...calls]);
    setActiveCall(null);
    setEndedCall(record);
    setPartner((current) => (current ? { ...current, status: 'AVAILABLE' } : current));
    setPage('dashboard');
  }

  function renderPage(currentPartner: Partner) {
    switch (page) {
      case 'call':
        return activeCall ? (
          <CallPage t={t} language={language} partner={currentPartner} call={activeCall} onEndCall={endCall} />
        ) : null;
      case 'history':
        return <HistoryPage t={t} language={language} history={history} />;
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
            onSimulateCall={simulateIncomingCall}
            routingMessage={routingMessage}
            history={history}
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
