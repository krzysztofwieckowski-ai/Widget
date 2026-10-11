import { useEffect } from 'react';

const BLINK_MS = 1000;

/** Brand-gradient circle with a phone; `withDot` adds a green "ringing" dot in the corner. */
function callFavicon(withDot: boolean) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a082fb"/><stop offset=".5" stop-color="#5a5cff"/><stop offset="1" stop-color="#15d3ff"/></linearGradient></defs>
<circle cx="16" cy="16" r="15" fill="url(#g)"/>
<path d="M11 9h3l1.5 4-2 1.5a9 9 0 0 0 4 4l1.5-2 4 1.5v3a2 2 0 0 1-2 2A13 13 0 0 1 9 11a2 2 0 0 1 2-2z" fill="#fff"/>
${withDot ? '<circle cx="25" cy="7" r="6" fill="#20d400" stroke="#070713" stroke-width="2"/>' : ''}
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const CALL_ICON_WITH_DOT = callFavicon(true);
const CALL_ICON_PLAIN = callFavicon(false);

function getFaviconLink() {
  return document.querySelector<HTMLLinkElement>('link[rel="icon"]');
}

type Texts = {
  /** The normal tab title, e.g. "3-Way Call · Partner Portal". */
  baseTitle: string;
  /** Short label for a waiting call, e.g. "Incoming call". */
  incomingLabel: string;
};

/**
 * Shows a waiting call in the browser tab itself, so it is noticeable from another tab:
 * - favicon: phone icon with a pulsing green dot (also visible on narrow and pinned tabs);
 * - title: "(1) Incoming call · …" while the tab is active; in a background tab it blinks every
 *   second between "📞 Incoming call" and the normal title.
 * Everything is restored as soon as there is no waiting call any more (answered or declined).
 */
export function useTabCallIndicator(hasIncomingCall: boolean, { baseTitle, incomingLabel }: Texts) {
  useEffect(() => {
    if (!hasIncomingCall) {
      document.title = baseTitle;
      return;
    }

    const link = getFaviconLink();
    const originalFavicon = link?.href ?? null;
    let blinkOn = true;

    function render() {
      if (document.hidden) {
        document.title = blinkOn ? `📞 ${incomingLabel}` : baseTitle;
      } else {
        document.title = `(1) ${incomingLabel} · ${baseTitle}`;
      }
      if (link) link.href = blinkOn ? CALL_ICON_WITH_DOT : CALL_ICON_PLAIN;
    }

    render();
    const intervalId = window.setInterval(() => {
      blinkOn = !blinkOn;
      render();
    }, BLINK_MS);
    // Switching back to the tab shows the steady title right away.
    document.addEventListener('visibilitychange', render);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', render);
      document.title = baseTitle;
      if (link && originalFavicon !== null) link.href = originalFavicon;
    };
  }, [hasIncomingCall, baseTitle, incomingLabel]);
}
