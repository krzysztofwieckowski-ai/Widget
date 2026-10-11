/**
 * Demo switch for the simulated availability check (no real API).
 *
 *   http://localhost:3000/?scenario=unavailable   (the bank page forwards it to the iframe)
 *   http://localhost:3001/?scenario=unavailable   (widget opened directly)
 *
 * Without the parameter, a support agent and a translator are always available.
 */
const scenario = new URLSearchParams(window.location.search).get('scenario');

export const isAssistanceAvailable = scenario !== 'unavailable';
