# Partner App — Frontend POC

The partner's (employee's) side of the 3-Way Call product: log in, receive an accessibility call,
join it, bring in a translator, end the call and see it in the history.

**Frontend only.** No backend, API, database, real authentication, Agora/WebRTC, audio or video.
All data is mocked, and every state change lives in React state.
The PWD widget is a separate app (`apps/accessibility-widget`). This app does not embed it or talk to it.
Incoming calls are simulated with a demo button instead.

## Run

```bash
npm install            # from the repository root
npm run dev:partner    # http://localhost:3002
```

Login: **any valid email address and any password** work. It is a mock login, and you are always signed in as the mock partner Sarah Ahmed, with the email you typed.

## Demo flow

1. **Login.** An empty field or an invalid email shows an error.
2. **Dashboard.** Shows the partner (Sarah Ahmed, Riyadh Branch), an **Offline ⟷ Available** switch (*Busy* is set automatically during a call), incoming calls and recent calls.
3. **Demo tools → Simulate incoming call.** A *New accessibility call* card appears (CALL-001, Riyadh Branch). The partner is alerted in several ways:
   - a **ringtone**, generated with Web Audio, with no audio file. It stops when the partner joins, clicks *Silence ringtone*, or after 30 s.
   - a badge on *Dashboard* in the navigation
   - the tab title changes to *(1) Incoming call · …*
   - a screen-reader announcement
   - when the tab is in the background, a **system notification**. Clicking it brings the partner back to the app.
   - **Simulate in 5 s** gives you time to switch to another tab or app, so you can hear the ringtone and see the system notification. The first click asks for notification permission.
   - A partner only ever sees calls from their **own facility**. The simulated call always comes from Sarah's branch, and the dashboard and history only list calls from that branch.
   - If the status is not *Available*, the call is not routed to Sarah.
   - **Decline** rejects the call. It stops the ringtone and the notification, and logs the call in the history as *Declined*. No banner is shown; a screen reader announces the decline.
4. **Join call.** Opens the call screen in a **lobby**. A status panel in the **middle of the camera view** shows what is happening. At the start: PWD User and Sarah (you) are connected, and the call is **not started yet** (*Not started*, *Waiting for all participants · 2 of 3 joined*, dashed stage). The partner status becomes *Busy*, and the navigation is hidden.
5. **Translator joins automatically.** There is no button to press. The status goes from *Looking for an available translator…* (~2 s) to *Translator found: Ahmed Ali. Connecting…* (~1.5 s).
   **The call only starts once all three roles are present:** the panel briefly confirms *All participants joined. The call has started.*, the timer starts, the status becomes *Connected · 3 participants*, and the start is announced to screen readers. This matches the widget's one-call rule.
6. **Mute / Camera.** These are visual-only toggles, available in the lobby and during the call.
7. **End call.** A confirmation dialog opens (*End this call?* with Cancel / End call). After you confirm, you go back to the Dashboard with an *Available* status. No "call ended" message is shown, and the call appears in *Recent calls* and *History*.
   In the lobby, the red button is **Leave** (*Leave before the call starts?*). Leaving cancels the call, and it is saved in the history as *Cancelled*.
8. **History.** Each call shows date, facility, duration, call ID and its result: *Completed*, *Cancelled* or *Declined*. There is no translator yes/no field, because a call only runs with a translator. The call language is not stored in the history.

Switch **EN | العربية** at any point, including during a call. The whole layout switches to RTL, and the current screen and call state are kept. The language choice is saved in `localStorage`.

## Incoming call alerts: what works when

| Situation | What the partner gets |
| --- | --- |
| Partner App open and visible | Card, ringtone, nav badge, screen-reader announcement |
| Partner App open in a **background tab** or minimised | Ringtone (audio was unlocked by the earlier login click), system notification (if permission was granted), `(1)` in the tab title |
| Partner App **closed** | Nothing. This would need Web Push (service worker + a push server) or a desktop/mobile app. That is out of scope for this frontend-only POC. |

Browsers only allow sound after the user has interacted with the page. The login click unlocks audio for the whole session.

## Visual design

The look is inspired by [Takamol Holding](https://takamolholding.com/en). It is a dark theme with:

- a near-black navy background (`#070713`) with soft violet and cyan glows
- dark cards (`#14141a`, `#313131` border, 24 px radius)
- the violet brand colour `#5a5cff` and a violet → indigo → cyan gradient
- a floating glass navigation bar
- pill-shaped buttons and large bold headings

The login screen uses the gradient "hero" with a glass card.
The call screen colours each role from the same palette: PWD user indigo-slate, partner violet, translator cyan-blue.

Contrast is kept at 4.5:1 or higher for all text. Violet text and links use the lighter `#9d9eff`. The saturated `#5a5cff` is only used for fills and borders.
The focus ring is cyan (`#15d3ff`).

The PWD widget (`apps/accessibility-widget`) keeps its own green theme. The structure of the call screen is still the same on both sides: participant tiles, the shared stage and the round control buttons.

## Structure

```
src/
├── App.tsx                 # flow state: session, page, incoming/active call, history, language
├── components/             # Header, LanguageSwitcher, StatusSwitch, StatusBadge, OutcomeBadge, IncomingCall,
│                           # ParticipantCard, CallControls, ConfirmDialog, Notice, icons
├── pages/                  # Login, Dashboard, Call, History, Profile
├── mock/                   # partner (+ mock login), calls (+ routing), translator (+ delays), facilities
├── i18n/                   # en.ts, ar.ts — all UI text, no hardcoded strings in components
├── types/                  # shared TypeScript types
├── utils/format.ts         # durations, dates (Gregorian, Latin digits), localized names
└── index.css               # all styles, grouped by section, logical (RTL-safe) properties
```

## Accessibility

- Semantic HTML: `header` / `nav` / `main`, headings, a `fieldset` of native radios for the status, `table`, `dl`, and a native modal `<dialog>`.
- Focus moves to the page heading on each screen change. In the end-call dialog, focus starts on *Cancel*, focus is trapped, and `Esc` cancels.
- Visible focus rings, targets of at least 44 px, and text contrast of at least 4.5:1.
- Status is never shown by colour alone: dots always come with text, and selected states also change shape or border. Pressed toggles use `aria-pressed` and a slashed icon.
- Live announcements cover incoming calls, status changes, translator progress, the call start and mic/camera changes.
- RTL uses `dir="rtl"` on `<html>` and CSS logical properties. Directional icons are mirrored. LTR values (emails, IDs, durations) are isolated with `dir="ltr"`.
- `prefers-reduced-motion` turns off the ringing pulse and the spinners' animation.
