import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { groceryService } from '../services/groceryService';

export default function ProfilePage() {
  const { user } = useAuth();
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

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-hero">
        <div className="profile-hero-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h2>{user?.name}</h2>
          <span className="profile-hero-email">{user?.email}</span>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <h2 className="profile-section-title">Account</h2>
          <div className="profile-field">
            <label>Name</label>
            <span>{user?.name}</span>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <span>{user?.email}</span>
          </div>
        </section>

        <section className="profile-card">
          <h2 className="profile-section-title">Grocery Integration</h2>
          <p className="profile-description">
            Connect your grocery store account to automatically import purchased items into your fridge.
          </p>
          {isConnected ? (
            <div className="profile-connected">
              <span className="badge badge-green">Connected · {user.connectedGroceryAccount.provider}</span>
              <button className="btn btn-secondary" onClick={handleDisconnect} disabled={disconnecting}>
                {disconnecting ? 'Disconnecting…' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <p className="profile-not-connected">
              No account connected. Go to <a href="/import">Import</a> to connect one.
            </p>
          )}
        </section>

        <section className="profile-card">
          <h2 className="profile-section-title">Notifications</h2>
          <p className="profile-description">
            Email alert preferences for expiration reminders.
          </p>
          <span className="profile-coming-soon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Notification settings coming soon
          </span>
        </section>
      </div>
    </div>
  );
}
