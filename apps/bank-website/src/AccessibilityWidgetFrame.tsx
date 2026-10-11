import { useEffect, useState } from 'react';
import { WIDGET_URL } from './config';

// Demo only: forward ?scenario=... (e.g. "unavailable") from this page's URL to the widget.
function getWidgetSrc() {
  const src = new URL(WIDGET_URL);
  const scenario = new URLSearchParams(window.location.search).get('scenario');
  if (scenario) src.searchParams.set('scenario', scenario);
  return src.toString();
}

const WIDGET_SRC = getWidgetSrc();

// Message sent by the widget app (see apps/accessibility-widget/src/hostBridge.ts).
// The type is duplicated on purpose: the two apps share no code.
type WidgetMessage = {
  source: 'accessibility-widget';
  type: 'widget:state';
  open: boolean;
};

function isWidgetMessage(data: unknown): data is WidgetMessage {
  const message = data as Partial<WidgetMessage> | null;
  return message?.source === 'accessibility-widget' && message.type === 'widget:state';
}

/**
 * Embeds the accessibility widget (a separate React app) via an iframe.
 * The bank website contains no widget UI. It only sizes the iframe:
 * a small round launcher when closed and a floating panel when open.
 * (The video call itself opens on its own page, served by the widget app.)
 */
export default function AccessibilityWidgetFrame() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const widgetOrigin = new URL(WIDGET_URL).origin;

    function handleMessage(event: MessageEvent) {
      if (event.origin !== widgetOrigin || !isWidgetMessage(event.data)) return;
      setIsOpen(event.data.open);
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const stateClass = isOpen ? 'is-open' : 'is-closed';

  return (
    <div className={`widget-frame-container ${stateClass}`}>
      <iframe className="widget-frame" src={WIDGET_SRC} title="خدمة المساعدة لذوي الإعاقة" />
    </div>
  );
}
