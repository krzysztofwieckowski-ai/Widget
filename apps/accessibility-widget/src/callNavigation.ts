/**
 * Link between the widget and the separate call page (/call).
 *
 * The call does not happen inside the widget. "Start video call" navigates the
 * customer to the call page, which is served by the widget app itself.
 * The page gets these query parameters:
 *   lang       – language chosen in the widget ("ar" | "en")
 *   returnUrl  – where to send the customer when the call is cancelled or finished
 *   scenario   – demo switch forwarded as is (e.g. "unavailable", see demoScenario.ts)
 */
import type { Language } from './types';
import { isEmbedded } from './hostBridge';

export const CALL_PAGE_PATH = '/call';

/** The page that embeds the widget (the iframe's referrer), or this page when opened directly. */
function getReturnUrl(): string {
  if (!isEmbedded) return window.location.origin + '/';
  return document.referrer || window.location.origin + '/';
}

export function buildCallPageUrl(language: Language): string {
  const url = new URL(CALL_PAGE_PATH, window.location.origin);
  url.searchParams.set('lang', language);
  url.searchParams.set('returnUrl', getReturnUrl());
  const scenario = new URLSearchParams(window.location.search).get('scenario');
  if (scenario) url.searchParams.set('scenario', scenario);
  return url.toString();
}

/** Takes the whole browser tab (not only the iframe) to the call page. */
export function goToCallPage(language: Language) {
  const url = buildCallPageUrl(language);
  if (!isEmbedded) {
    window.location.assign(url);
    return;
  }
  try {
    // Allowed for a cross-origin parent as a response to the customer's click.
    window.top!.location.href = url;
  } catch {
    // Some browsers/hosts block top-level navigation from an iframe: fall back to a new tab.
    window.open(url, '_blank', 'noopener');
  }
}

/** Only http(s) URLs are accepted as a return target. */
export function parseReturnUrl(value: string | null): string {
  if (value) {
    try {
      const url = new URL(value, window.location.origin);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
    } catch {
      // fall through to the default
    }
  }
  return window.location.origin + '/';
}
