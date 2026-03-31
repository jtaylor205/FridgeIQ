import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { groceryService } from '../services/groceryService';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState('');

  const isConnected = user?.connectedGroceryAccount?.connected;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setError('');
    try {
      await groceryService.disconnectAccount();
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Failed to disconnect grocery account.');
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

      {error && <p className="auth-error">{error}</p>}

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
          <NotificationSettings user={user} refreshUser={refreshUser} />
        </section>
      </div>
    </div>
  );
}

// NotificationSettings component (must be outside ProfilePage)
import { authService } from '../services/authService';

function NotificationSettings({ user, refreshUser }) {
  const [emailAlerts, setEmailAlerts] = useState(user?.notificationPreferences?.emailAlerts ?? true);
  const [days, setDays] = useState(user?.notificationPreferences?.daysBeforeExpiration ?? 3);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleToggle = async (e) => {
    setSaving(true);
    setMsg('');
    try {
      await authService.updateNotificationPreferences({ emailAlerts: e.target.checked });
      setEmailAlerts(e.target.checked);
      setMsg('Saved!');
      await refreshUser();
    } catch (err) {
      setMsg(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  const handleDaysChange = async (e) => {
    const val = parseInt(e.target.value, 10);
    setDays(val);
    setSaving(true);
    setMsg('');
    try {
      await authService.updateNotificationPreferences({ daysBeforeExpiration: val });
      setMsg('Saved!');
      await refreshUser();
    } catch (err) {
      setMsg(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="notification-settings">
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={emailAlerts}
          onChange={handleToggle}
          disabled={saving}
        />
        Enable expiration email alerts
      </label>
      <div style={{ marginTop: 12 }}>
        <label>
          Days before expiration:{' '}
          <input
            type="number"
            min={1}
            max={14}
            value={days}
            onChange={handleDaysChange}
            disabled={saving || !emailAlerts}
            style={{ width: 50 }}
          />
        </label>
      </div>
      {msg && <div className="profile-msg" style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
