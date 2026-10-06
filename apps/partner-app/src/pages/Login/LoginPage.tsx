import { useState, type FormEvent } from 'react';
import type { Language, Partner } from '../../types';
import type { Translation } from '../../i18n';
import { authenticate, DEMO_CREDENTIALS } from '../../mock/partner';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { AccessibilityIcon, EyeIcon, EyeOffIcon, InfoIcon } from '../../components/icons';

type LoginPageProps = {
  t: Translation;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogin: (partner: Partner) => void;
};

/** Mock login. Only the demo credentials are accepted; nothing is sent anywhere. */
export default function LoginPage({ t, language, onLanguageChange, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const partner = authenticate(email, password);
    if (partner) {
      onLogin(partner);
    } else {
      setHasError(true);
    }
  }

  function fillDemoCredentials() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setHasError(false);
  }

  const passwordToggleLabel = showPassword ? t.hidePassword : t.showPassword;

  return (
    <main className="login">
      <div className="login-card">
        <header className="login-header">
          <span className="brand-mark" aria-hidden="true">
            <AccessibilityIcon />
          </span>
          <span className="brand-text">
            <span className="brand-title">{t.appName}</span>
            <span className="brand-subtitle">{t.portalName}</span>
          </span>
          <LanguageSwitcher language={language} onChange={onLanguageChange} groupLabel={t.languageSwitcher} />
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div>
            <h1 className="login-title" tabIndex={-1} data-page-heading>
              {t.loginTitle}
            </h1>
            <p className="muted">{t.loginDescription}</p>
          </div>

          {hasError && (
            <p id="login-error" className="form-error" role="alert">
              {t.loginError}
            </p>
          )}

          <div className="field">
            <label htmlFor="email" className="field-label">
              {t.email}
            </label>
            <input
              id="email"
              className="input"
              type="email"
              dir="ltr"
              autoComplete="username"
              value={email}
              aria-invalid={hasError}
              aria-describedby={hasError ? 'login-error' : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="field-label">
              {t.password}
            </label>
            <div className="input-with-button">
              <input
                id="password"
                className="input"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                autoComplete="current-password"
                value={password}
                aria-invalid={hasError}
                aria-describedby={hasError ? 'login-error' : undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="input-button"
                aria-label={passwordToggleLabel}
                title={passwordToggleLabel}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((shown) => !shown)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="button button--primary button--full">
            {t.loginButton}
          </button>

          <aside className="demo-box" aria-labelledby="demo-credentials-title">
            <p id="demo-credentials-title" className="demo-box-title">
              <InfoIcon />
              {t.demoCredentials}
            </p>
            <p className="demo-credentials">
              <span dir="ltr">{DEMO_CREDENTIALS.email}</span>
              <br />
              <span dir="ltr">{DEMO_CREDENTIALS.password}</span>
            </p>
            <button type="button" className="button button--secondary button--small" onClick={fillDemoCredentials}>
              {t.fillDemoCredentials}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}
