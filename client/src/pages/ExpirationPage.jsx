import { useEffect, useState } from 'react';
import { MOCK_EXPIRATION_ALERTS } from '../mocks/data';
import ExpirationAlert from '../components/expiration/ExpirationAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
      <div className="exp-page-header">
        <div>
          <h1>Expiration</h1>
          <p className="exp-page-sub">{totalTracked} item{totalTracked !== 1 ? 's' : ''} tracked this week</p>
        </div>
        {urgentCount > 0 && (
          <span className="badge badge-red">{urgentCount} urgent</span>
        )}
      </div>

      {totalTracked === 0 ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">✓</div>
          <div className="exp-empty-title">All clear</div>
          <p className="exp-empty-text">Nothing expiring this week. You're on top of it.</p>
        </div>
      ) : (
        <>
          <AlertSection title="Expired" items={alerts?.expired} urgent />
          <AlertSection title="Expiring Today" items={alerts?.today} urgent />
          <AlertSection title="Expiring Tomorrow" items={alerts?.tomorrow} />
          <AlertSection title="This Week" items={alerts?.thisWeek} />
        </>
      )}
    </div>
  );
}

function AlertSection({ title, items, urgent }) {
  if (!items?.length) return null;
  return (
    <section className="exp-section">
      <div className="exp-section-header">
        <span className="exp-section-title">{title}</span>
        <span className="exp-section-count">{items.length}</span>
      </div>
      <div className="exp-list">
        {items.map((item) => (
          <ExpirationAlert key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
