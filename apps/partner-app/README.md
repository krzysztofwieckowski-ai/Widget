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

Demo login: **sarah@example.com** / **Password123!**. The login screen also has a *Fill in demo credentials* button.

## Demo flow

1. **Login.** Wrong credentials show an error.
2. **Dashboard.** Shows the partner (Sarah Ahmed, Riyadh Branch), the status selector (Available / Busy / Away / Offline), incoming calls and recent calls.
3. **Demo tools → Simulate incoming call.** A *New accessibility call* card appears (CALL-001, Riyadh Branch, Arabic). The Dashboard nav item gets a badge, and the call is announced to screen readers.
   - *Simulate call for Jeddah Branch* shows that calls from other facilities are **not** routed to Sarah.
   - If the status is not *Available*, the call is not routed either.
4. **Join call.** Opens the call screen in a **lobby**: PWD User and Sarah (you) are connected, and the call is **not started yet** (*Not started*, *Waiting for all participants · 2 of 3 joined*, dashed stage). The partner status becomes *Busy*, and the navigation is hidden.
5. **Translator joins automatically.** There is no button to press. The status goes from *Looking for an available translator…* (~2 s) to *Translator found: Ahmed Ali (Arabic / English). Connecting…* (~1.5 s).
   **The call only starts once all three roles are present:** the timer starts, the status becomes *Connected · 3 participants*, and the start is announced to screen readers. This matches the widget's one-call rule.
6. **Mute / Camera.** These are visual-only toggles, available in the lobby and during the call.
7. **End call.** A confirmation dialog opens (*End this call?* with Cancel / End call). After you confirm, you go back to the Dashboard with an *Available* status and a *Call ended* notice.
   In the lobby, the red button is **Leave** (*Leave before the call starts?*). Leaving cancels the call, and it is saved in the history as *Cancelled*.
8. **History.** The call is listed with date, facility, language, duration, translator yes/no and *Completed* or *Cancelled*.

Switch **EN | العربية** at any point, including during a call. The whole layout switches to RTL, and the current screen and call state are kept. The language choice is saved in `localStorage`.

## Visual consistency with the PWD widget

The partner app reuses the widget's design language:

- the same colour tokens, radii and font stack
- the same icon set (copied from the widget, plus a few partner-only icons)
- the green header with an orange bottom border
- the same buttons
- the same dark call screen: gradient participant tiles, a shared "room" frame, name labels in the corner, round control buttons and a red *End call* button

Colour roles match the widget: the support side (partner) is green, the translator is orange, and the customer (PWD user) is slate.

## Structure

```
src/
├── App.tsx                 # flow state: session, page, incoming/active call, history, language
├── components/             # Header, LanguageSwitcher, StatusSelector, StatusBadge, IncomingCall,
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
