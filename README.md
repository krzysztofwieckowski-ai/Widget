# accessibility-assistance-poc

Proof of concept of a **universal** accessibility assistance widget that any website needing support can embed
(here demonstrated on a mock bank website). A person with a disability can request **one** video call with a
**partner and a sign language translator together**. The widget contains no site-specific wording, so it is not tied to banking.
There is no login, no backend and no real video. Everything is simulated in the frontend.

The repository contains four **independent** React + TypeScript (Vite) apps:

| App | Location | URL |
| --- | --- | --- |
| Mock bank website in Arabic, RTL ("بنك الروضة", fictional) | `apps/bank-website` | http://localhost:3000 |
| Accessibility assistance widget | `apps/accessibility-widget` | http://localhost:3001 |
| Partner App: the consultant's side of the call, plus an Admin Panel (EN / Arabic RTL) | `apps/partner-app` | http://localhost:3002 |
| Translator mobile app: the sign-language translator receives and joins the 3-way call on a phone (EN / Arabic RTL) | `apps/translator-app` | http://localhost:3003 |

The bank website loads the widget in an `<iframe>` from `http://localhost:3001`. The Partner App is standalone and simulates incoming calls itself (see [apps/partner-app/README.md](apps/partner-app/README.md)), and so is the Translator app, which simulates an incoming 3-way call (see [apps/translator-app/README.md](apps/translator-app/README.md)). The apps share no code.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm 9+

## Getting started

```bash
npm install     # installs dependencies for both apps (npm workspaces)
npm run dev     # starts all three apps together
```

Open http://localhost:3000. The round accessibility button (violet-to-cyan gradient) is in the bottom-right corner.

## Scripts (run from the repository root)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start all four apps at the same time |
| `npm run dev:bank` | Start only the bank website (port 3000) |
| `npm run dev:widget` | Start only the widget (port 3001) |
| `npm run dev:partner` | Start only the Partner App (port 3002) |
| `npm run dev:translator` | Start only the Translator app (port 3003) |
| `npm run build` | Type-check and build all apps |
| `npm run typecheck` | Type-check all apps |

Both ports are fixed (`strictPort`). If a port is busy, Vite stops with an error instead of picking another port.

## Customer journey

```
widget:     closed → welcome (your name) → request → "Start video call"
call page:                                              → call lobby (~8 s) → video call → call ended → back to the site
                                                                    ↘ unavailable → try again / back to the site
```

1. Click the accessibility launcher. The panel opens in **Arabic (RTL)** by default.
2. **Welcome**: "هل تحتاج إلى مساعدة؟". There is no sign-in; the only field is **Your name** (*اسمك*), then *طلب المساعدة*.
3. **Assistance request**: explains that the partner **and** the translator join together. There is nothing to choose. The button *بدء مكالمة الفيديو* (Start video call) takes the customer to the call page.
4. **Call page** (`/call`, served by the widget app, see below). **Lobby** (same idea as the partner's side): the call screen opens straight away with three seats. You are already there; the translator and the partner join one after the other (*Searching…* → *Connecting…* → joined), while a status card in the middle says what is happening and how many of the 3 have joined. Until all three are in the room nobody's picture is shown: people who have joined appear as avatars marked *Joined*, and the video only appears when the call starts. The timer shows *Not started* and the red button says *Leave*. The translator joins after about 4 seconds and the partner after another 4 (about 8 seconds in total); then "Everyone joined. The call has started." appears briefly and the timer starts.
5. **Video call**: one shared call with three participants. The **translator** is the large main view; the **partner** (name shown, e.g. "Partner: Khalid Al-Harbi") is bottom left and **you** bottom right. The faces are photos in `apps/accessibility-widget/public/images/` (`translator.jpg`, `partner.jpg`, `you.jpg`). Mute and Stop video are visual toggles. **End call** ends the whole call.
6. **Call ended**: the customer can rate the call with 1–5 stars (click, or use the arrow keys). The rating is only kept in the page state and not sent anywhere. A large *إغلاق* (Close) button takes the customer back to the site they came from.

The small language button in the header (widget and call page) shows the other language ("English" or "العربية"). Switching at any point changes the language and direction without restarting the flow.
Closing the widget mid-flow (the × button or `Esc`) keeps your place, so reopening continues where you left off.

### The call page

The call does not happen inside the widget: *Start video call* navigates the whole browser tab (not only the iframe) to `http://localhost:3001/call`. The page gets three query parameters: `lang` (`ar` / `en`), `returnUrl` (where to go when the call is cancelled or finished; only `http(s)` URLs are accepted) and `scenario` (the demo switch below, forwarded as is). The call page can also be opened directly: http://localhost:3001/call?lang=en

### Scenario: no partner or translator available

Open **http://localhost:3000/?scenario=unavailable** (or http://localhost:3001/?scenario=unavailable for the widget alone).
The bank page passes the parameter on to the iframe, and the widget forwards it to the call page. After the same lobby (about 4 s of searching, nobody is found), instead of the call the call page shows
*"Assistance is not available right now"* / *"المساعدة غير متاحة حالياً"* with the note that no call was started.

- **Try again** starts the search again. In this scenario it fails again, to keep the demo predictable.
- **Close** returns to the site the customer came from.
- Following the one-call rule, there is no partial call: if either person is missing, nobody is connected.
- Without the parameter, help is always available. This is a frontend simulation only, not a real availability check.

## How the iframe integration works

```
Bank website (localhost:3000)
  └── <iframe src="http://localhost:3001">   ← AccessibilityWidgetFrame.tsx
        └── Widget app: launcher + panel + whole flow
```

- The launcher **and** the panel live inside the widget app. The bank website contains no widget UI.
- An iframe cannot resize itself, so the widget sends the host one message whenever it opens or closes:

  ```ts
  { source: 'accessibility-widget', type: 'widget:state', open: boolean }
  ```

  - Sent from `apps/accessibility-widget/src/hostBridge.ts`, only to the host origin (`http://localhost:3000`).
  - Received in `apps/bank-website/src/AccessibilityWidgetFrame.tsx`, which ignores any message that doesn't come from the widget origin.
  - The bank page then switches the iframe between a 60 px round launcher, a 380 × 560 px panel. On phones the open panel is always full screen.
- Without this message, the iframe would always need to be panel-sized, and its transparent area would block clicks on the bank page.

Configuration (optional, via `.env.local` in each app):

| App | Variable | Default |
| --- | --- | --- |
| bank-website | `VITE_WIDGET_URL` | `http://localhost:3001` |
| accessibility-widget | `VITE_HOST_ORIGIN` | `http://localhost:3000` |

If you open http://localhost:3001 directly, the widget runs standalone and positions itself in the bottom-right corner.

## Project structure

```
accessibility-assistance-poc/
├── package.json                    # npm workspaces + root scripts
├── README.md
└── apps/
    ├── bank-website/               # host page (port 3000)
    │   └── src/
    │       ├── App.tsx             # mock bank homepage
    │       ├── AccessibilityWidgetFrame.tsx  # iframe + resize on widget message
    │       ├── config.ts           # widget URL
    │       └── index.css
    └── accessibility-widget/       # embedded widget + call page `/call` (port 3001)
        └── src/
            ├── App.tsx             # widget flow state (open/step/language) + focus management
            ├── CallPage.tsx        # separate call page: call (lobby → started) → ended / unavailable
            ├── callNavigation.ts   # link from the widget to /call (lang, returnUrl, scenario)
            ├── types.ts            # Language, Step
            ├── i18n.ts             # Arabic + English texts, text direction
            ├── hostBridge.ts       # postMessage to the host page
            ├── index.css           # all widget styles, grouped by section
            ├── components/         # Launcher, WidgetPanel, LanguageSwitcher, Screen,
            │                       # ParticipantTile, CallControls, buttons, icons
            └── screens/            # one component per flow step
    ├── partner-app/                # Partner / employee portal (port 3002), see its README
    └── translator-app/             # Translator mobile app (port 3003), see its README
```

## Visual design

The widget and the Partner App share one dark theme, inspired by [Takamol Holding](https://takamolholding.com/en):

- a navy background with violet and cyan glows
- dark cards
- the violet brand colour `#5a5cff`
- a violet → indigo → cyan gradient (launcher, icons, header line)
- pill buttons and a cyan focus ring

The call uses the same role colours on both sides: partner/consultant violet, translator cyan-blue, PWD user indigo-slate.
The widget document itself stays transparent (`color-scheme: light` on the page, `dark` only on the panel), so the round launcher has no square corners on the light host page.

## Accessibility notes

- Semantic HTML (dialog, headings, lists, `dl`), and every control is a real `<button>`.
- Focus moves to the new screen heading on every step and returns to the launcher on close. `Esc` closes the panel.
- Visible focus rings, at least 44 px touch targets, and a contrast ratio of at least 4.5:1 for text.
- Selected or pressed states are never shown by colour alone: Mute/Stop video use a slashed icon + inverted style + `aria-pressed`.
- `prefers-reduced-motion` turns off the panel animation and the spinning indicator.
- The launcher's accessible name is always "Accessibility assistance".
- This is an assistance service, not an accessibility toolbar. There are deliberately no font, contrast or similar controls.
