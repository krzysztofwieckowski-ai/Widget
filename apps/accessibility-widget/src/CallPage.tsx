import { useEffect, useRef, useState } from 'react';
import type { Language } from './types';
import { getDirection, translations } from './i18n';
import { parseReturnUrl } from './callNavigation';
import { isAssistanceAvailable } from './demoScenario';
import LanguageSwitcher from './components/LanguageSwitcher';
import VideoCallScreen from './screens/VideoCallScreen';
import CallEndedScreen from './screens/CallEndedScreen';
import UnavailableScreen from './screens/UnavailableScreen';

type CallStep = 'call' | 'ended' | 'unavailable';

function readLanguage(): Language {
  return new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'ar';
}

/**
 * Separate page for the video call (opened from the widget's "Start video call").
 *
 * Flow: call (the translator and the partner join one by one, like on the partner's side; the call starts
 *       once everyone is in) → ended → back to the page the customer came from.
 *       ↘ unavailable (demo scenario: nobody found) → try again or back to that page
 */
export default function CallPage() {
  const [step, setStep] = useState<CallStep>('call');
  const [language, setLanguage] = useState<Language>(readLanguage);
  const pageRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const returnUrl = parseReturnUrl(new URLSearchParams(window.location.search).get('returnUrl'));

  function leave() {
    window.location.assign(returnUrl);
  }

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    document.title = `${t.callTitle} – ${t.widgetTitle}`;
  }, [language, t]);

  // Focus management: move focus to the new screen heading on every step change.
  useEffect(() => {
    pageRef.current?.querySelector<HTMLElement>('[data-screen-heading]')?.focus();
  }, [step]);

  function renderStep() {
    switch (step) {
      case 'call':
        return (
          <VideoCallScreen
            t={t}
            available={isAssistanceAvailable}
            onEndCall={() => setStep('ended')}
            onLeave={leave}
            onUnavailable={() => setStep('unavailable')}
          />
        );
      case 'ended':
        return <CallEndedScreen t={t} onClose={leave} />;
      case 'unavailable':
        return <UnavailableScreen t={t} onTryAgain={() => setStep('call')} onClose={leave} />;
    }
  }

  return (
    <div ref={pageRef} className="panel call-page">
      <header className="panel-header">
        <h1 className="panel-title">{t.widgetTitle}</h1>
        <LanguageSwitcher language={language} onChange={setLanguage} tooltip={t.changeLanguage} />
      </header>

      <main className="panel-body">{renderStep()}</main>
    </div>
  );
}
