import { useEffect, useRef, useState } from 'react';
import { getDirection, translations } from './i18n';
import type { CallRecord, CallResult, IncomingCall, Language, Screen, Tab } from './types';
import { initialHistory } from './mock/history';
import { createIncomingCall, localName, mockTranslator } from './mock/translator';
import TabBar from './components/TabBar';
import CallPage from './pages/CallPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

/**
 * Translator mobile app (PoC): the "3-ways call" button puts the translator into a 3-way call with the
 * user (person with a disability) and the partner. Everything is mocked.
 */
export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>('tabs');
  const [available, setAvailable] = useState(true);
  const [records, setRecords] = useState<CallRecord[]>(initialHistory);
  const [activeCall, setActiveCall] = useState<IncomingCall | null>(null);
  const [showCancelledNotice, setShowCancelledNotice] = useState(false);
  const callCounter = useRef(0);

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    document.title = t.appTitle;
  }, [language, t.appTitle]);

  const startCall = () => {
    setShowCancelledNotice(false);
    setActiveCall(createIncomingCall(callCounter.current++));
    setScreen('call');
  };

  // Same as the partner's app: no "call ended" screen. Back to Home; only a call left before it
  // started gets a (dismissible) message.
  const endCall = ({ started, durationSeconds }: CallResult) => {
    if (activeCall) {
      setRecords((current) => [
        {
          callId: activeCall.id,
          endedAt: new Date().toISOString(),
          call: activeCall,
          durationSeconds,
          outcome: started ? 'COMPLETED' : 'CANCELLED',
        },
        ...current,
      ]);
    }
    setActiveCall(null);
    setShowCancelledNotice(!started);
    setTab('home');
    setScreen('tabs');
  };

  return (
    <div className="phone-stage">
      <div className="phone">
        <main className="phone-main">
          {screen === 'call' && activeCall && (
            <CallPage key={activeCall.id} t={t} language={language} call={activeCall} onEnd={endCall} />
          )}

          {screen === 'tabs' && tab === 'home' && (
            <HomePage
              t={t}
              name={localName(mockTranslator, language)}
              available={available}
              showCancelledNotice={showCancelledNotice}
              onDismissNotice={() => setShowCancelledNotice(false)}
              onStartCall={startCall}
            />
          )}
          {screen === 'tabs' && tab === 'history' && (
            <HistoryPage t={t} language={language} records={records} />
          )}
          {screen === 'tabs' && tab === 'profile' && (
            <ProfilePage
              t={t}
              language={language}
              records={records}
              available={available}
              onAvailableChange={setAvailable}
              onLanguageChange={setLanguage}
            />
          )}
        </main>

        {screen === 'tabs' && <TabBar t={t} active={tab} onChange={setTab} />}
      </div>
    </div>
  );
}
