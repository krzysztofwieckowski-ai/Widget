/**
 * Address of the widget loader script that partner companies add to their website.
 * Placeholder (.example is a reserved domain) until the widget is hosted;
 * override with VITE_WIDGET_SCRIPT_URL in apps/partner-app/.env.local.
 */
export const WIDGET_SCRIPT_URL: string =
  import.meta.env.VITE_WIDGET_SCRIPT_URL ?? 'https://widget.3waycall.example/embed.js';
