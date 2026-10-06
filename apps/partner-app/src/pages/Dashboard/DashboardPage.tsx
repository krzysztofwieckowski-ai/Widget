import type { CallRecord, FacilityId, IncomingCall as IncomingCallData, Language, Page, Partner, PartnerStatus } from '../../types';
import type { Translation } from '../../i18n';
import { FACILITIES } from '../../mock/facilities';
import { displayName, formatDate, formatDuration } from '../../utils/format';
import StatusSelector from '../../components/StatusSelector/StatusSelector';
import IncomingCall from '../../components/IncomingCall/IncomingCall';
import Notice from '../../components/Notice/Notice';
import { BuildingIcon, ChevronForwardIcon, PhoneIncomingIcon, UserIcon } from '../../components/icons';

/** Result of the last "Simulate ..." click that did not produce an incoming call. */
export type RoutingMessage =
  | { type: 'other-facility'; facilityId: FacilityId }
  | { type: 'partner-unavailable' }
  | null;

type DashboardPageProps = {
  t: Translation;
  language: Language;
  partner: Partner;
  onStatusChange: (status: PartnerStatus) => void;
  incomingCall: IncomingCallData | null;
  onJoinCall: () => void;
  onSimulateCall: (facilityId: FacilityId) => void;
  routingMessage: RoutingMessage;
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
  onStatusChange,
  incomingCall,
  onJoinCall,
  onSimulateCall,
  routingMessage,
  history,
  endedCall,
  onDismissEndedCall,
  onNavigate,
}: DashboardPageProps) {
  const otherFacility = FACILITIES.find((facility) => facility !== partner.facilityId)!;
  const isAvailable = partner.status === 'AVAILABLE';
  const recentCalls = history.slice(0, RECENT_CALLS_COUNT);

  return (
    <div className="page">
      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.dashboardTitle}
      </h1>

      {endedCall && (
        <Notice tone={endedCall.outcome === 'COMPLETED' ? 'success' : 'info'} onDismiss={onDismissEndedCall} dismissLabel={t.dismiss}>
          {endedCall.outcome === 'COMPLETED'
            ? t.callEndedNotice(formatDuration(endedCall.durationSeconds))
            : t.callCancelledNotice}
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
                {t.facilities[partner.facilityId]}
              </p>
            </div>
          </div>
          <StatusSelector t={t} status={partner.status} onChange={onStatusChange} />
        </section>

        <section className="card" aria-labelledby="incoming-calls-title">
          <h2 id="incoming-calls-title" className="card-title">
            {t.incomingCalls}
          </h2>

          {incomingCall ? (
            <IncomingCall t={t} call={incomingCall} onJoin={onJoinCall} />
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
                aria-disabled={incomingCall !== null}
                onClick={incomingCall ? undefined : () => onSimulateCall(partner.facilityId)}
              >
                {t.simulateIncomingCall}
              </button>
              <button
                type="button"
                className="button button--ghost button--small"
                onClick={() => onSimulateCall(otherFacility)}
              >
                {t.simulateOtherFacility(t.facilities[otherFacility])}
              </button>
            </div>
            {routingMessage && (
              <Notice>
                {routingMessage.type === 'other-facility'
                  ? t.callRoutedElsewhere(t.facilities[routingMessage.facilityId])
                  : t.callNotRoutedUnavailable}
              </Notice>
            )}
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
                  <th scope="col">{t.facility}</th>
                  <th scope="col">{t.language}</th>
                  <th scope="col">{t.duration}</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr key={call.callId}>
                    <td>{formatDate(call.endedAt, language, false)}</td>
                    <td>{t.facilityShort[call.facilityId]}</td>
                    <td>{t.callLanguages[call.language]}</td>
                    <td>
                      <span dir="ltr" className="tabular">
                        {formatDuration(call.durationSeconds)}
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
