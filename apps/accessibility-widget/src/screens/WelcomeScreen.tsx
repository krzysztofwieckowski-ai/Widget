import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Translation } from '../i18n';
import Screen from '../components/Screen';
import { AccessibilityIcon } from '../components/icons';

type Props = { t: Translation; onRequest: () => void };

/**
 * Mock sign-in: any non-empty username and password are accepted.
 * Nothing is sent or stored anywhere - it only exists so the flow starts with a login step.
 */
export default function WelcomeScreen({ t, onRequest }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (username.trim() && password) {
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
        <button type="submit" form="login-form" className="button button--primary button--full">
          {t.signInButton}
        </button>
      }
    >
      <p className="screen-text">{t.welcomeDescription}</p>

      <form id="login-form" className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-username">{t.usernameLabel}</label>
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={showError && !username.trim()}
            aria-describedby={showError ? 'login-error' : undefined}
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">{t.passwordLabel}</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={showError && !password}
            aria-describedby={showError ? 'login-error' : undefined}
          />
        </div>
        {showError && (
          <p id="login-error" className="field-error" role="alert">
            {t.signInError}
          </p>
        )}
      </form>
    </Screen>
  );
}
