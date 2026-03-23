import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { groceryService } from '../services/groceryService';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);

  const isConnected = user?.connectedGroceryAccount?.connected;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await groceryService.disconnectAccount();
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div className={styles.grid}>
        <section className="card">
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.field}>
            <label>Name</label>
            <span>{user?.name}</span>
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <span>{user?.email}</span>
          </div>
        </section>

        <section className="card">
          <h2 className={styles.sectionTitle}>Grocery Integration</h2>
          <p className={styles.description}>
            Connect your grocery store account to automatically import purchased items into your fridge.
          </p>
          {isConnected ? (
            <div className={styles.connected}>
              <span className="badge badge-green">Connected · {user.connectedGroceryAccount.provider}</span>
              <button className="btn btn-secondary" onClick={handleDisconnect} disabled={disconnecting} style={{ marginTop: 14 }}>
                {disconnecting ? 'Disconnecting…' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <p className={styles.notConnected}>No grocery account connected. Go to <a href="/import">Import</a> to connect one.</p>
          )}
        </section>

        <section className="card">
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <p className={styles.description}>
            Email alert preferences for expiration reminders.
          </p>
          <p className={styles.notConnected}>
            Notification settings coming soon.
          </p>
        </section>
      </div>
    </div>
  );
}
