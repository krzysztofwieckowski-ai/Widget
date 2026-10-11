import type { ReactNode } from 'react';

type ScreenProps = {
  title: string;
  icon?: ReactNode;
  iconTone?: 'default' | 'warning';
  children?: ReactNode;
  actions?: ReactNode;
  /** Optional modifier class for a screen with its own layout. */
  className?: string;
};

/**
 * Standard layout for a flow step: icon, heading, content, and actions at the bottom.
 * The heading is marked with data-screen-heading so App can move focus to it
 * whenever the step changes (screen-reader and keyboard users land on the new screen).
 */
export default function Screen({ title, icon, iconTone = 'default', children, actions, className }: ScreenProps) {
  return (
    <section className={className ? `screen ${className}` : 'screen'} aria-labelledby="screen-title">
      <div className="screen-content">
        {icon && <div className={`screen-icon screen-icon--${iconTone}`}>{icon}</div>}
        <h2 id="screen-title" className="screen-title" tabIndex={-1} data-screen-heading>
          {title}
        </h2>
        {children}
      </div>
      {actions && <div className="screen-actions">{actions}</div>}
    </section>
  );
}
