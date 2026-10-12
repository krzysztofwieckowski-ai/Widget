# Translator app (mobile)

Phone app for the **sign-language translator** who takes part in the 3-way call together with the user (person with a disability, on the widget) and the partner (company consultant, on the Partner App). Standalone proof of concept: no backend, everything is mocked in React state. English and Arabic (RTL).

Open http://localhost:3003. On a desktop browser the app is shown inside a phone-sized frame; on a phone (or a narrow window) it fills the screen.

```bash
npm run dev -w translator-app      # or: npm run dev:translator (from the repo root)
```

## Screens

| Screen | What it does |
| --- | --- |
| **Home** | "Welcome <name>" and the **3-ways call** card (navy card, green phone button; the whole card is the button). Tapping it puts the translator straight into a 3-way call. In a real system the call would be pushed from the platform when a partner starts it; here it is simulated. Disabled when availability is off (Profile). |
| **Call** | Same pattern as the Partner's call. The translator is in the room right away; the **user joins after about 4 s and the partner after another 4 s** (*Searching…* → *Connecting…* → *Connected*). Until all three are in there is no video, the pill says *Not started* and the red button says *Leave*. Then the call starts: user = large main view, partner and you = small corner tiles, timer runs, red button says *End call*. Mute and Camera are visual toggles. **Leave / End call** works as in the Partner App and the widget: a confirmation dialog (Cancel / Leave or End call), then back to Home. No "call ended" screen; only a call left before it started shows a dismissible message on Home and is stored in History as *Not started*. |
| **History** | Past calls with company, user, partner, date, duration and outcome (*Completed* / *Not started*). New calls are added at the top (kept in memory only). |
| **Profile** | Icon, languages, call statistics, **availability** switch and the English / Arabic switch. |

The bottom green tab bar (Home / History / Profile) is hidden during the call.

## Structure

```
src/
├── App.tsx               # screen + tab state, call history
├── types/                # CallRecord, CallResult…
├── mock/                 # translator, demo callers, lobby timeline (ms), seed history
├── i18n/                 # en.ts, ar.ts (ar mirrors the keys of en), direction
├── components/           # TabBar, ParticipantTile, CallControls, ConfirmDialog, Notice, OutcomeBadge, icons
├── pages/                # Home, Call, History, Profile
└── index.css             # all styles (light UI, dark call screen)
```

The lobby timeline lives in `src/mock/translator.ts` (`USER_FOUND_MS`, `USER_JOINED_MS`, `PARTNER_FOUND_MS`, `PARTNER_JOINED_MS`). Each tile shows a role icon with a caption (**USER**, **PARTNER**, **TRANSLATOR**) instead of a photo; `public/images/` is no longer used.
