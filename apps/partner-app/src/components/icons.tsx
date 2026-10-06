import type { ReactNode } from 'react';

// Same icon set and stroke style as the PWD widget (apps/accessibility-widget), plus partner-only icons at the end.

type IconProps = { className?: string };

/** Decorative SVG wrapper. Icons are hidden from screen readers; buttons carry the text. */
function Icon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={['icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Person with arms outstretched — the international accessibility symbol. */
export function AccessibilityIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M4.5 8.5c2.5.7 5 1 7.5 1s5-.3 7.5-1" />
      <path d="M12 9.5v4.5M12 14l-3.2 6.5M12 14l3.2 6.5" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5zM20 14h-3v5h1.5a1.5 1.5 0 0 0 1.5-1.5z" />
      <path d="M18 19c0 1.5-1.5 2.5-4 2.5h-1.5" />
    </Icon>
  );
}

export function TranslatorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5h9M8.5 3v2M6 5c1 3.5 3.5 6 6.5 7.5M11 5c-1 3.5-3.5 6.5-7 8" />
      <path d="M13 21l4-9 4 9M14.5 17.5h5" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </Icon>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5l5-3v9l-5-3z" />
    </Icon>
  );
}

export function VideoOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 13.5l5 3v-9l-5 3M10 6h4a2 2 0 0 1 2 2v4M16 16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2" />
      <path d="M3 3l18 18" />
    </Icon>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </Icon>
  );
}

export function MicOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 10V6a3 3 0 0 0-5.7-1.3M9 9v2a3 3 0 0 0 4.6 2.5M19 11a7 7 0 0 1-1.2 3.9M5 11a7 7 0 0 0 10.6 6M12 18v3" />
      <path d="M3 3l18 18" />
    </Icon>
  );
}

export function PhoneEndIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 14.5c5-4.6 13-4.6 18 0l-2.2 2.4-3.6-1.4v-2.7c-2.7-.9-5.7-.9-8.4 0v2.7l-3.6 1.4z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.5l2.7 2.7L16 10" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

/** Points "backwards" in LTR; flipped automatically in RTL via CSS (.icon-directional). */
export function ChevronBackIcon(props: IconProps) {
  return (
    <Icon className={['icon-directional', props.className].filter(Boolean).join(' ')}>
      <path d="M15 5l-7 7 7 7" />
    </Icon>
  );
}

export function ChevronForwardIcon(props: IconProps) {
  return (
    <Icon className={['icon-directional', props.className].filter(Boolean).join(' ')}>
      <path d="M9 5l7 7-7 7" />
    </Icon>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
    </Icon>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7" />
    </Icon>
  );
}

/** Filled vs. outlined shape shows the state, not colour alone. */
export function StarIcon({ filled, ...props }: IconProps & { filled: boolean }) {
  return (
    <Icon {...props}>
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

/* ---------- Partner app only ---------- */

export function BuildingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </Icon>
  );
}

export function PhoneIncomingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 7 7l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      <path d="M15 3v6h6M21 3l-6 6" />
    </Icon>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Icon>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5" />
      <path d="M3.5 4v4.5H8M12 7.5V12l3 2" />
    </Icon>
  );
}

/** Door with an arrow pointing out; flipped automatically in RTL. */
export function LogoutIcon(props: IconProps) {
  return (
    <Icon className={['icon-directional', props.className].filter(Boolean).join(' ')}>
      <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M15 8l4 4-4 4M19 12H9" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v5M12 7.5v.5" />
    </Icon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 5.7A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.5 6.9C3.9 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.8 0 3.3-.5 4.6-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </Icon>
  );
}
