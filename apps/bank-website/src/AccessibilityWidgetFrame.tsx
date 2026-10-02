import { useEffect, useState } from 'react';
import { WIDGET_URL } from './config';

// Message sent by the widget app (see apps/accessibility-widget/src/hostBridge.ts).
// The type is duplicated on purpose: the two apps share no code.
type WidgetMessage = {
  source: 'accessibility-widget';
  type: 'widget:state';
  open: boolean;
  expanded: boolean;
};

function isWidgetMessage(data: unknown): data is WidgetMessage {
  const message = data as Partial<WidgetMessage> | null;
  return message?.source === 'accessibility-widget' && message.type === 'widget:state';
}

/**
 * Embeds the accessibility widget (a separate React app) via an iframe.
 * The bank website contains no widget UI. It only sizes the iframe:
 * a small round launcher when closed, a floating panel when open,
 * and almost the whole window when the customer enlarges it.
 */
export default function AccessibilityWidgetFrame() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const widgetOrigin = new URL(WIDGET_URL).origin;

    function handleMessage(event: MessageEvent) {
      if (event.origin !== widgetOrigin || !isWidgetMessage(event.data)) return;
      setIsOpen(event.data.open);
      setIsExpanded(event.data.expanded);
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const stateClass = !isOpen ? 'is-closed' : isExpanded ? 'is-open is-expanded' : 'is-open';

  return (
    <div className={`widget-frame-container ${stateClass}`}>
      <iframe className="widget-frame" src={WIDGET_URL} title="خدمة المساعدة لذوي الإعاقة" />
    </div>
  );
}
