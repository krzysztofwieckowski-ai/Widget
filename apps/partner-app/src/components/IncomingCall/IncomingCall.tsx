import type { IncomingCall as IncomingCallData } from '../../types';
import type { Translation } from '../../i18n';
import { PhoneIncomingIcon, VideoIcon } from '../icons';

type IncomingCallProps = {
  t: Translation;
  call: IncomingCallData;
  onJoin: () => void;
};

/** Incoming call card on the dashboard. The arrival itself is announced by App via the live region. */
export default function IncomingCall({ t, call, onJoin }: IncomingCallProps) {
  return (
    <article className="incoming-call" aria-labelledby="incoming-call-title">
      <div className="incoming-call-icon" aria-hidden="true">
        <PhoneIncomingIcon />
      </div>
      <div className="incoming-call-body">
        <h3 id="incoming-call-title" className="incoming-call-title">
          {t.newAccessibilityCall}
        </h3>
        <dl className="incoming-call-details">
          <div>
            <dt>{t.facility}</dt>
            <dd>{t.facilities[call.facilityId]}</dd>
          </div>
          <div>
            <dt>{t.language}</dt>
            <dd>{t.callLanguages[call.language]}</dd>
          </div>
          <div>
            <dt>{t.callId}</dt>
            <dd>
                    <span dir="ltr">{call.callId}</span>
                  </dd>
          </div>
        </dl>
      </div>
      <button type="button" className="button button--primary incoming-call-join" onClick={onJoin}>
        <VideoIcon />
        {t.joinCall}
      </button>
    </article>
  );
}
