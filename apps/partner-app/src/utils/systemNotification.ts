/**
 * Operating-system notification for an incoming call while the partner is in another tab
 * or application. Uses the browser Notification API (permission is asked once, from a click).
 *
 * This only works while the Partner App is open in some tab. Reaching a partner whose tab
 * is closed would need Web Push (service worker + push server) — out of scope for this POC.
 */

export function isNotificationSupported() {
  return 'Notification' in window;
}

/** Must be called from a user gesture (click), otherwise browsers ignore the request. */
export function requestNotificationPermission() {
  if (isNotificationSupported() && Notification.permission === 'default') {
    void Notification.requestPermission();
  }
}

export function isNotificationBlocked() {
  return isNotificationSupported() && Notification.permission === 'denied';
}

/** Shows a notification only when the tab is hidden; clicking it brings the partner back to the app. */
export function showIncomingCallNotification(title: string, body: string, tag: string): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted' || !document.hidden) return null;
  const notification = new Notification(title, { body, tag, icon: '/favicon.svg', requireInteraction: true });
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
  return notification;
}
