import type { CallRecord, IncomingCall as IncomingCallData, Language, Page, Partner, PartnerStatus } from '../../types';
import type { Translation } from '../../i18n';
import { displayName, formatDate, formatDuration } from '../../utils/format';
import StatusSwitch from '../../components/StatusSwitch/StatusSwitch';
import IncomingCall from '../../components/IncomingCall/IncomingCall';
import Notice from '../../components/Notice/Notice';
import OutcomeBadge from '../../components/OutcomeBadge/OutcomeBadge';
import { BuildingIcon, ChevronForwardIcon, PhoneIncomingIcon, UserIcon } from '../../components/icons';

type DashboardPageProps = {
  t: Translation;
  language: Language;
  partner: Partner;
  companyName: string;
  onStatusChange: (status: PartnerStatus) => void;
  incomingCall: IncomingCallData | null;
  onJoinCall: () => void;
  onDeclineCall: () => void;
  onSimulateCall: () => void;
  onSimulateDelayedCall: () => void;
  simulateDelaySeconds: number;
  /** A delayed simulated call is on its way. */
  isCallPending: boolean;
  isRinging: boolean;
  onSilenceRingtone: () => void;
  notificationsBlocked: boolean;
  /** The last simulated call was not routed because the partner is not Available. */
  callNotRouted: boolean;
  history: CallRecord[];
  endedCall: CallRecord | null;
  onDismissEndedCall: () => void;
  onNavigate: (page: Page) => void;
};

const RECENT_CALLS_COUNT = 3;

export default function DashboardPage({
  t,
  language,
  partner,
  companyName,
  onStatusChange,
  incomingCall,
  onJoinCall,
  onDeclineCall,
  onSimulateCall,
  onSimulateDelayedCall,
  simulateDelaySeconds,
  isCallPending,
  isRinging,
  onSilenceRingtone,
  notificationsBlocked,
  callNotRouted,
  history,
  endedCall,
  onDismissEndedCall,
  onNavigate,
}: DashboardPageProps) {
  const isAvailable = partner.status === 'AVAILABLE';
  const canSimulate = incomingCall === null && !isCallPending;
  const recentCalls = history.slice(0, RECENT_CALLS_COUNT);

  return (
    <div className="page">
      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.dashboardTitle}
      </h1>

      {/* Only a call cancelled from the lobby gets a message; finished and declined calls do not. */}
      {endedCall?.outcome === 'CANCELLED' && (
        <Notice onDismiss={onDismissEndedCall} dismissLabel={t.dismiss}>
          {t.callCancelledNotice}
        </Notice>
      )}

      <div className="dashboard-grid">
        <section className="card partner-card" aria-labelledby="partner-name">
          <div className="partner-card-top">
            <span className="avatar" aria-hidden="true">
              <UserIcon />
            </span>
            <div>
              <h2 id="partner-name" className="card-title">
                {displayName(partner, language)}
              </h2>
              <p className="muted with-icon">
                <BuildingIcon />
                {companyName}
              </p>
            </div>
          </div>
          <StatusSwitch t={t} status={partner.status} onChange={onStatusChange} />
        </section>

        <section className="card" aria-labelledby="incoming-calls-title">
          <h2 id="incoming-calls-title" className="card-title">
            {t.incomingCalls}
          </h2>

          {incomingCall ? (
            <IncomingCall
              t={t}
              call={incomingCall}
              companyName={companyName}
              onJoin={onJoinCall}
              onDecline={onDeclineCall}
              isRinging={isRinging}
              onSilence={onSilenceRingtone}
            />
          ) : (
            <div className="empty-state">
              <PhoneIncomingIcon />
              <div>
                <p>{t.noIncomingCalls}</p>
                <p className="muted">{isAvailable ? t.noIncomingCallsHint : t.notAvailableHint}</p>
              </div>
            </div>
          )}

          <div className="demo-box" role="group" aria-labelledby="demo-tools-title">
            <p id="demo-tools-title" className="demo-box-title">
              {t.demoTools}
            </p>
            <p className="demo-box-note">{t.demoToolsNote}</p>
            <div className="demo-box-actions">
              <button
                type="button"
                className="button button--secondary button--small"
                aria-disabled={!canSimulate}
                onClick={canSimulate ? onSimulateCall : undefined}
              >
                {t.simulateIncomingCall}
              </button>
              <button
                type="button"
                className="button button--ghost button--small"
                aria-disabled={!canSimulate}
                onClick={canSimulate ? onSimulateDelayedCall : undefined}
              >
                {isCallPending ? t.simulatePending(simulateDelaySeconds) : t.simulateDelayed(simulateDelaySeconds)}
              </button>
            </div>
            {callNotRouted && <Notice>{t.callNotRoutedUnavailable}</Notice>}
            {notificationsBlocked && <Notice>{t.notificationsBlocked}</Notice>}
          </div>
        </section>

        <section className="card" aria-labelledby="recent-calls-title">
          <h2 id="recent-calls-title" className="card-title">
            {t.recentCalls}
          </h2>
          {recentCalls.length === 0 ? (
            <p className="muted">{t.noCallsYet}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t.date}</th>
                  <th scope="col">{t.outcomeLabel}</th>
                  <th scope="col">{t.duration}</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr key={call.callId}>
                    <td>{formatDate(call.endedAt, language, false)}</td>
                    <td>
                      <OutcomeBadge t={t} outcome={call.outcome} />
                    </td>
                    <td>
                      <span dir="ltr" className="tabular">
                        {call.outcome === 'COMPLETED' ? formatDuration(call.durationSeconds) : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button type="button" className="link-button" onClick={() => onNavigate('history')}>
            {t.viewCallHistory}
            <ChevronForwardIcon />
          </button>
        </section>
      </div>
    </div>
  );
}
