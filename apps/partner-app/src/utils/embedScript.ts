import type { Company } from '../types';
import { WIDGET_SCRIPT_URL } from '../config';

/**
 * The snippet the admin sends to a partner company. The company key identifies the company,
 * so every call started from that website is attributed to it (call source for routing and statistics).
 */
export function buildEmbedScript(company: Company) {
  return [
    '<!-- 3-Way Call accessibility widget -->',
    '<script',
    `  src="${WIDGET_SCRIPT_URL}"`,
    `  data-company-key="${company.key}"`,
    '  async',
    '></script>',
  ].join('\n');
}
