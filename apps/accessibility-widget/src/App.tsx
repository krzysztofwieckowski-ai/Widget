import { useEffect, useRef, useState } from 'react';
import type { Language, Step } from './types';
import { getDirection, translations } from './i18n';
import { isEmbedded, notifyHost } from './hostBridge';
import Launcher from './components/Launcher';
import WidgetPanel from './components/WidgetPanel';
import WelcomeScreen from './screens/WelcomeScreen';
import AssistanceRequestScreen from './screens/AssistanceRequestScreen';
import { goToCallPage } from './callNavigation';

/**
 * Flow in the widget: closed → welcome → request → (call page)
 *
 * "Start video call" takes the customer to the separate call page (/call), where waiting, the call,
 * the rating and the "unavailable" demo scenario happen. The panel stays mounted while closed (just hidden),
 * so closing and reopening keeps the customer where they were. Language is separate state,
 * so switching it never resets the flow.
 */
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [language, setLanguage] = useState<Language>('ar');

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const shouldFocusLauncher = useRef(false);

  const t = translations[language];

  // Apply language and text direction to the whole widget document.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
  }, [language]);

  // Tell the host page to resize the iframe whenever the widget opens or closes.
  useEffect(() => {
    notifyHost(isOpen);
  }, [isOpen]);

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

  function openWidget() {
    setIsOpen(true);
  }

  function closeWidget() {
    shouldFocusLauncher.current = true;
    setIsOpen(false);
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
            onStartCall={() => goToCallPage(language)}
          />
        );
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
        hidden={!isOpen}
      >
        {renderStep()}
      </WidgetPanel>
    </div>
  );
}
