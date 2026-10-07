# accessibility-assistance-poc

Proof of concept of a **universal** accessibility assistance widget that any website needing support can embed
(here demonstrated on a mock bank website). A person with a disability can request **one** video call with a
**support agent and a translator together**. The widget contains no site-specific wording, so it is not tied to banking.
There is no login, no backend and no real video. Everything is simulated in the frontend.

The repository contains three **independent** React + TypeScript (Vite) apps:

| App | Location | URL |
| --- | --- | --- |
| Mock bank website in Arabic, RTL ("بنك الروضة", fictional) | `apps/bank-website` | http://localhost:3000 |
| Accessibility assistance widget | `apps/accessibility-widget` | http://localhost:3001 |
| Partner App: the consultant's side of the call, plus an Admin Panel (EN / Arabic RTL) | `apps/partner-app` | http://localhost:3002 |

The bank website loads the widget in an `<iframe>` from `http://localhost:3001`. The Partner App is standalone and simulates incoming calls itself (see [apps/partner-app/README.md](apps/partner-app/README.md)). The apps share no code.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm 9+

## Getting started

```bash
npm install     # installs dependencies for both apps (npm workspaces)
npm run dev     # starts all three apps together
```

Open http://localhost:3000. The round green accessibility button is in the bottom-right corner.

## Scripts (run from the repository root)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start all three apps at the same time |
| `npm run dev:bank` | Start only the bank website (port 3000) |
| `npm run dev:widget` | Start only the widget (port 3001) |
| `npm run dev:partner` | Start only the Partner App (port 3002) |
| `npm run build` | Type-check and build all apps |
| `npm run typecheck` | Type-check all apps |

Both ports are fixed (`strictPort`). If a port is busy, Vite stops with an error instead of picking another port.

## Customer journey

```
closed → welcome → request → waiting (~2 s) → video call → call ended → closed
                                       ↘ unavailable → closed
```

1. Click the accessibility launcher. The panel opens in **Arabic (RTL)** by default.
2. **Welcome**: "هل تحتاج إلى مساعدة؟" → *طلب المساعدة*.
3. **Assistance request**: explains that the support agent **and** the translator join together. There is nothing to choose. The button *بدء مكالمة الفيديو* (Start video call) starts the call right away.
4. **Waiting**: spinner for about 2 seconds, then the call opens automatically. *Cancel request* goes back to the previous screen.
5. **Video call**: one shared call with three tiles (support agent, translator, you). Mute and Stop video are visual toggles. **End call** ends the whole call.
6. **Call ended**: the customer can rate the call with 1–5 stars (click, or use the arrow keys). The rating is only kept in the widget state and not sent anywhere. *إغلاق* closes the panel and returns to the launcher. The next time it opens, it starts at the welcome screen.

The small language button in the green header shows the other language ("English" or "العربية"). Switching at any point changes the language and direction without restarting the flow.
Closing the panel mid-flow (the × button or `Esc`) keeps your place, so reopening continues where you left off.
On desktop and tablet, the **Enlarge window** button in the header (next to ×) makes the widget fill almost the whole browser window. In the call this gives much bigger video tiles. Pressing it again restores the compact size. Resizing never interrupts the flow. On phones the panel is already full screen, so the button is hidden.

### Scenario: no support agent or translator available

Open **http://localhost:3000/?scenario=unavailable** (or http://localhost:3001/?scenario=unavailable for the widget alone).
The bank page passes the parameter on to the iframe. After the same ~2 s wait, instead of the call the widget shows
*"Assistance is not available right now"* / *"المساعدة غير متاحة حالياً"* with the note that no call was started.

- **Try again** starts the waiting again. In this scenario it fails again, to keep the demo predictable.
- **Close** returns to the launcher. The next time the widget opens, it starts at the welcome screen.
- Following the one-call rule, there is no partial call: if either person is missing, nobody is connected.
- Without the parameter, help is always available. This is a frontend simulation only, not a real availability check.

## How the iframe integration works

```
Bank website (localhost:3000)
  └── <iframe src="http://localhost:3001">   ← AccessibilityWidgetFrame.tsx
        └── Widget app: launcher + panel + whole flow
```

- The launcher **and** the panel live inside the widget app. The bank website contains no widget UI.
- An iframe cannot resize itself, so the widget sends the host one message whenever it opens, closes or is enlarged:

  ```ts
  { source: 'accessibility-widget', type: 'widget:state', open: boolean, expanded: boolean }
  ```

  - Sent from `apps/accessibility-widget/src/hostBridge.ts`, only to the host origin (`http://localhost:3000`).
  - Received in `apps/bank-website/src/AccessibilityWidgetFrame.tsx`, which ignores any message that doesn't come from the widget origin.
  - The bank page then switches the iframe between a 60 px round launcher, a 380 × 560 px panel and an enlarged panel (up to 1100 px wide, full height). On phones the open panel is always full screen.
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
    └── accessibility-widget/       # embedded widget (port 3001)
        └── src/
            ├── App.tsx             # flow state (open/step/language) + focus management
            ├── types.ts            # Language, Step
            ├── i18n.ts             # Arabic + English texts, text direction
            ├── hostBridge.ts       # postMessage to the host page
            ├── index.css           # all widget styles, grouped by section
            ├── components/         # Launcher, WidgetPanel, LanguageSwitcher, Screen,
            │                       # ParticipantTile, CallControls, buttons, icons
            └── screens/            # one component per flow step
    └── partner-app/                # Partner / employee portal (port 3002), see its README
```

## Accessibility notes

- Semantic HTML (dialog, headings, lists, `dl`), and every control is a real `<button>`.
- Focus moves to the new screen heading on every step and returns to the launcher on close. `Esc` closes the panel.
- Visible focus rings, at least 44 px touch targets, and a contrast ratio of at least 4.5:1 for text.
- Selected or pressed states are never shown by colour alone: Mute/Stop video use a slashed icon + inverted style + `aria-pressed`.
- `prefers-reduced-motion` turns off the panel animation and the spinning indicator.
- The launcher's accessible name is always "Accessibility assistance".
- This is an assistance service, not an accessibility toolbar. There are deliberately no font, contrast or similar controls.
