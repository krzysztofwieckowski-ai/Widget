/**
 * Incoming-call ringtone generated with the Web Audio API (no audio file needed).
 *
 * Browsers only allow audio after the user has interacted with the page, so `unlockAudio()`
 * is called from a click (login, "Simulate incoming call"). After that the ringtone can play
 * even when the call arrives later and this tab is in the background.
 *
 * All chimes are scheduled up front on the audio clock, so they keep ringing in a background
 * tab where JavaScript timers are throttled. Ringing stops after RINGTONE_MAX_MS
 * (WCAG 1.4.2: sound that plays automatically must not go on indefinitely) or when stopped.
 */

export const RINGTONE_MAX_MS = 30_000;
const RING_INTERVAL_S = 2;

let audioContext: AudioContext | null = null;
let activeOutput: GainNode | null = null;

/** No ringtone (but no crash either) in browsers without the Web Audio API. */
export function unlockAudio() {
  if (typeof AudioContext === 'undefined') return;
  audioContext ??= new AudioContext();
  if (audioContext.state === 'suspended') void audioContext.resume();
}

/** One short two-note chime (rising), starting at `time`. */
function scheduleChime(context: AudioContext, output: GainNode, time: number) {
  [
    { frequency: 659.25, offset: 0 }, // E5
    { frequency: 987.77, offset: 0.18 }, // B5
  ].forEach(({ frequency, offset }) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    const start = time + offset;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(0.35, start + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    oscillator.connect(envelope).connect(output);
    oscillator.start(start);
    oscillator.stop(start + 0.55);
  });
}

export function startRingtone() {
  unlockAudio();
  stopRingtone();
  const context = audioContext;
  if (!context) return;
  const output = context.createGain();
  output.connect(context.destination);
  activeOutput = output;

  const rings = Math.floor(RINGTONE_MAX_MS / 1000 / RING_INTERVAL_S);
  const startTime = context.currentTime + 0.05;
  for (let i = 0; i < rings; i++) {
    scheduleChime(context, output, startTime + i * RING_INTERVAL_S);
  }
}

export function stopRingtone() {
  // Disconnecting the shared output silences every chime that is still scheduled.
  activeOutput?.disconnect();
  activeOutput = null;
}
