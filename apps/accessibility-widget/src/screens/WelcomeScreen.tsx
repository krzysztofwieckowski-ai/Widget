import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import { AccessibilityIcon } from '../components/icons';

type Props = { t: Translation; onRequest: () => void };

/**
 * First screen: no sign-in, the only thing we ask for is the user's name.
 * Nothing is sent or stored anywhere in this prototype.
 */
export default function WelcomeScreen({ t, onRequest }: Props) {
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim()) {
      onRequest();
    } else {
      setShowError(true);
    }
  }

  return (
    <Screen
      title={t.welcomeTitle}
      icon={<AccessibilityIcon />}
      actions={
        <button type="submit" form="name-form" className="button button--primary button--full">
          {t.welcomeButton}
        </button>
      }
    >
      <p className="screen-text">{t.welcomeDescription}</p>

      <form id="name-form" className="name-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="user-name">{t.nameLabel}</label>
          <input
            id="user-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={showError && !name.trim()}
            aria-describedby={showError ? 'name-error' : undefined}
          />
        </div>
        {showError && (
          <p id="name-error" className="field-error" role="alert">
            {t.nameError}
          </p>
        )}
      </form>
    </Screen>
  );
}
