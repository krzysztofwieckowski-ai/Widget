import { useEffect, useRef, useState } from 'react';
import type { Language, Step } from './types';
import { getDirection, translations } from './i18n';
import { isEmbedded, notifyHost } from './hostBridge';
import Launcher from './components/Launcher';
import WidgetPanel from './components/WidgetPanel';
import WelcomeScreen from './screens/WelcomeScreen';
import AssistanceRequestScreen from './screens/AssistanceRequestScreen';
import WaitingScreen from './screens/WaitingScreen';
import VideoCallScreen from './screens/VideoCallScreen';
import CallEndedScreen from './screens/CallEndedScreen';

// Simulated time to "prepare" the support agent and translator. No real availability check.
const WAITING_TIME_MS = 2000;

// On phones the open panel is already full screen, so the enlarge button is not shown.
const CAN_EXPAND = window.screen.width > 480;

/**
 * Flow: closed → welcome → request → waiting → call → ended → closed
 *
 * The panel stays mounted while closed (just hidden), so closing and reopening
 * mid-flow keeps the customer where they were. Language is separate state,
 * so switching it never resets the flow.
 */
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [language, setLanguage] = useState<Language>('ar');
  const [isExpanded, setIsExpanded] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const shouldFocusLauncher = useRef(false);

  const t = translations[language];

  // Apply language and text direction to the whole widget document.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
  }, [language]);

  // Tell the host page to resize the iframe whenever the widget opens, closes or is enlarged.
  useEffect(() => {
    notifyHost(isOpen, isExpanded);
  }, [isOpen, isExpanded]);

  // Focus management: move focus to the current screen heading when the panel opens
  // or the step changes; return focus to the launcher after the customer closes the panel.
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.querySelector<HTMLElement>('[data-screen-heading]')?.focus();
    } else if (shouldFocusLauncher.current) {
      shouldFocusLauncher.current = false;
      launcherRef.current?.focus();
    }
  }, [isOpen, step]);

  // Simulated waiting: after ~2 seconds the shared call opens automatically.
  useEffect(() => {
    if (step !== 'waiting') return;
    const timeoutId = window.setTimeout(() => setStep('call'), WAITING_TIME_MS);
    return () => window.clearTimeout(timeoutId);
  }, [step]);

  function openWidget() {
    setIsOpen(true);
  }

  function closeWidget() {
    shouldFocusLauncher.current = true;
    setIsOpen(false);
    // A finished call starts fresh next time.
    if (step === 'ended') setStep('welcome');
  }

  function renderStep() {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen t={t} onRequest={() => setStep('request')} />;
      case 'request':
        return (
          <AssistanceRequestScreen
            t={t}
            onBack={() => setStep('welcome')}
            onStartCall={() => setStep('waiting')}
          />
        );
      case 'waiting':
        return <WaitingScreen t={t} onCancel={() => setStep('request')} />;
      case 'call':
        return <VideoCallScreen t={t} onEndCall={() => setStep('ended')} />;
      case 'ended':
        return <CallEndedScreen t={t} onClose={closeWidget} />;
    }
  }

  return (
    <div className={`widget ${isEmbedded ? 'widget--embedded' : 'widget--standalone'}`}>
      <Launcher ref={launcherRef} onOpen={openWidget} hidden={isOpen} />
      <WidgetPanel
        ref={panelRef}
        t={t}
        language={language}
        onLanguageChange={setLanguage}
        onClose={closeWidget}
        isExpanded={isExpanded}
        onToggleExpand={CAN_EXPAND ? () => setIsExpanded((expanded) => !expanded) : undefined}
        hidden={!isOpen}
      >
        {renderStep()}
      </WidgetPanel>
    </div>
  );
}
