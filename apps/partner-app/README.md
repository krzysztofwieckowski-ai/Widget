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

The app has two roles. It is a mock login: any non-empty password works.

| Login | Role |
| --- | --- |
| `admin` | **Admin Panel**: partner companies, consultants, statistics |
| an email of a consultant (e.g. `sarah@example.com`, `omar@example.com`, `layla@example.com`, or one the admin added) | **Partner Portal**, as that consultant (of their company) |
| any other valid email | **Partner Portal**, as the demo consultant Sarah Ahmed (Al Rawdah Bank) |

All data (companies, consultants, call history) is shared in memory between the two roles for the whole browser session. It resets when the page is reloaded.

## Demo flow

1. **Login.** An empty field or an invalid email shows an error.
2. **Dashboard.** Shows the consultant (Sarah Ahmed, Al Rawdah Bank), an **Offline ⟷ Available** switch (*Busy* is set automatically during a call), incoming calls and recent calls.
3. **Demo tools → Simulate incoming call.** A *New accessibility call* card appears (CALL-001, Al Rawdah Bank). The partner is alerted in several ways:
   - a **ringtone**, generated with Web Audio, with no audio file. It stops when the partner joins, clicks *Silence ringtone*, or after 30 s.
   - a badge on *Dashboard* in the navigation
   - the tab title changes to *(1) Incoming call · …*
   - a screen-reader announcement
   - when the tab is in the background, a **system notification**. Clicking it brings the partner back to the app.
   - **Simulate in 5 s** gives you time to switch to another tab or app, so you can hear the ringtone and see the system notification. The first click asks for notification permission.
   - A consultant only ever receives calls for their **own company**; there are no branches. The simulated call always comes from the consultant's company widget, and the dashboard and history only list the calls this consultant handled.
   - If the status is not *Available*, the call is not routed to Sarah.
   - **Decline** rejects the call. It stops the ringtone and the notification, and logs the call in the history as *Declined*. No banner is shown; a screen reader announces the decline.
4. **Join call.** Opens the call screen in a **lobby**. A status panel in the **middle of the camera view** shows what is happening. At the start: PWD User and Sarah (you) are connected, and the call is **not started yet** (*Not started*, *Waiting for all participants · 2 of 3 joined*, dashed stage). The partner status becomes *Busy*, and the navigation is hidden.
5. **Translator joins automatically.** There is no button to press. The status goes from *Looking for an available translator…* (~2 s) to *Translator found: Ahmed Ali. Connecting…* (~1.5 s).
   **The call only starts once all three roles are present:** the panel briefly confirms *All participants joined. The call has started.*, the timer starts, the status becomes *Connected · 3 participants*, and the start is announced to screen readers. This matches the widget's one-call rule.
6. **Mute / Camera.** These are visual-only toggles, available in the lobby and during the call.
7. **End call.** A confirmation dialog opens (*End this call?* with Cancel / End call). After you confirm, you go back to the Dashboard with an *Available* status. No "call ended" message is shown, and the call appears in *Recent calls* and *History*.
   In the lobby, the red button is **Leave** (*Leave before the call starts?*). Leaving cancels the call, and it is saved in the history as *Cancelled*.
8. **History.** Each call shows date, duration, call ID and its result: *Completed*, *Cancelled* or *Declined*. There is no translator yes/no field, because a call only runs with a translator. The call language is not stored in the history.

Switch **EN | العربية** at any point, including during a call. The whole layout switches to RTL, and the current screen and call state are kept. The language choice is saved in `localStorage`.

## Admin Panel

Sign in with `admin` and any password.

- **Companies.** One table: company, number of consultants, completed calls. Under it, a one-line form adds a company: type the name and press *Add company*. Its key (`twc_live_…`) is generated automatically; the key is what will later link the company's PWD widget to it. Duplicate names are rejected.
- **A company** (click its name): one summary line (completed calls, total and average call time), the **company key** with *Copy key*, and the **consultants**.
  - **Assign consultant**: full name and email in one line; the company is the one you are on. The consultant can then sign in to the Partner Portal with that email and receives all of this company's calls. An email can belong to only one consultant.
  - **Remove** a consultant (with confirmation). Their past calls stay in the statistics.
- **Statistics.** Three numbers (completed calls, total call time, average call), then the same per company in a table. A completed call is one where the PWD user, the consultant and the translator all joined; only completed calls count towards call time.

Calls made in the Partner Portal appear in the statistics straight away. Example: add a company, assign a consultant, log out, sign in as that consultant, take a call, log out, sign in as `admin` again.

In the Partner Portal, the signed-in person is shown as a **Consultant** of their company (dashboard, profile and call screen), and their history lists only the calls they handled.

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

The PWD widget (`apps/accessibility-widget`) uses the same theme and the same role colours, so both sides of the call look like one product.

## Structure

```
src/
├── App.tsx                 # flow state: session, page, incoming/active call, history, language
├── components/             # Header, LanguageSwitcher, StatusSwitch, StatusBadge, OutcomeBadge, IncomingCall,
│                           # ParticipantCard, CallControls, ConfirmDialog, Notice, icons
├── pages/                  # Login, Dashboard, Call, History, Profile; Admin/ (AdminApp, Companies, Company, Statistics)
├── mock/                   # companies + consultants, partner (mock login), calls (+ routing), translator
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
