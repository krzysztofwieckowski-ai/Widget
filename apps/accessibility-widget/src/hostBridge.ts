/**
 * The only link between the widget and the host page (e.g. the bank website).
 *
 * The widget runs inside an iframe, so it cannot resize itself. It tells the
 * host page whether it is open (and enlarged), and the host resizes the iframe:
 * small for the launcher button, panel-sized when open, almost full-window when expanded.
 */

// Origin of the page allowed to receive our messages (the website embedding the widget).
const HOST_ORIGIN: string = import.meta.env.VITE_HOST_ORIGIN ?? 'http://localhost:3000';

/** True when the widget is loaded inside an iframe, false when opened directly. */
export const isEmbedded = window.parent !== window;

export type WidgetMessage = {
  source: 'accessibility-widget';
  type: 'widget:state';
  open: boolean;
  expanded: boolean;
};

export function notifyHost(open: boolean, expanded: boolean) {
  if (!isEmbedded) return;
  const message: WidgetMessage = { source: 'accessibility-widget', type: 'widget:state', open, expanded };
  window.parent.postMessage(message, HOST_ORIGIN);
}
