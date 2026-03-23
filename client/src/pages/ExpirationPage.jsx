import { useEffect, useState } from 'react';
import { MOCK_EXPIRATION_ALERTS } from '../mocks/data';
import ExpirationAlert from '../components/expiration/ExpirationAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './ExpirationPage.module.css';


export default function ExpirationPage() {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAlerts(MOCK_EXPIRATION_ALERTS);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) return <LoadingSpinner />;

  const urgentCount = (alerts?.expired?.length ?? 0) + (alerts?.today?.length ?? 0);
  const totalTracked =
    (alerts?.expired?.length ?? 0) +
    (alerts?.today?.length ?? 0) +
    (alerts?.tomorrow?.length ?? 0) +
    (alerts?.thisWeek?.length ?? 0);

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1>Expiration Alerts</h1>
          <p className={styles.sub}>{totalTracked} item{totalTracked !== 1 ? 's' : ''} tracked</p>
        </div>
        {urgentCount > 0 && (
          <span className="badge badge-red">{urgentCount} urgent</span>
        )}
      </div>

      {totalTracked === 0 ? (
        <div className={styles.empty}>
          <p>All clear — nothing expiring this week.</p>
        </div>
      ) : (
        <>
          <AlertSection title="Expired" icon="⚠" items={alerts?.expired} />
          <AlertSection title="Expiring Today" icon="⚠" items={alerts?.today} />
          <AlertSection title="Expiring Tomorrow" icon="⚠" items={alerts?.tomorrow} />
          <AlertSection title="Expiring This Week" icon="⚠" items={alerts?.thisWeek} />
        </>
      )}
    </div>
  );
}

function AlertSection({ title, icon, items }) {
  if (!items?.length) return null;
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{icon}</span> {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => <ExpirationAlert key={item._id} item={item} />)}
      </div>
    </section>
  );
}
