import type { Language, Partner } from '../../types';
import type { Translation } from '../../i18n';
import { displayName } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { UserIcon } from '../../components/icons';

type ProfilePageProps = { t: Translation; language: Language; partner: Partner };

export default function ProfilePage({ t, language, partner }: ProfilePageProps) {
  return (
    <div className="page page--narrow">
      <h1 className="page-title" tabIndex={-1} data-page-heading>
        {t.profileTitle}
      </h1>

      <section className="card" aria-labelledby="profile-name">
        <div className="partner-card-top">
          <span className="avatar avatar--large" aria-hidden="true">
            <UserIcon />
          </span>
          <h2 id="profile-name" className="card-title">
            {displayName(partner, language)}
          </h2>
        </div>
        <dl className="details-list">
          <div>
            <dt>{t.email}</dt>
            <dd>
                    <span dir="ltr">{partner.email}</span>
                  </dd>
          </div>
          <div>
            <dt>{t.facility}</dt>
            <dd>{t.facilities[partner.facilityId]}</dd>
          </div>
          <div>
            <dt>{t.status}</dt>
            <dd>
              <StatusBadge status={partner.status} label={t.statusLabels[partner.status]} />
            </dd>
          </div>
          <div>
            <dt>{t.partnerId}</dt>
            <dd>
                    <span dir="ltr">{partner.id}</span>
                  </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
