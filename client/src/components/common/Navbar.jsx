import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  {
    to: '/fridge',
    label: 'My Fridge',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="3" />
        <path d="M4 10h16" />
        <path d="M9 6v2M9 14v4" />
      </svg>
    ),
  },
  {
    to: '/scan',
    label: 'Scanner',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
      </svg>
    ),
  },
  {
    to: '/import',
    label: 'Import',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Theme ──────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('fridgeiq-theme') || 'light'; } catch { return 'light'; }
  });

  const logoSrc = theme === 'dark' ? '/fridge-icon-dark.svg' : '/fridge-icon-light.svg';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('fridgeiq-theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // ─── Auth guard ──────────────────────────────────────────
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage || !user) return null;

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="nav-sidebar">
        <div className="nav-top">
          <NavLink to="/fridge" className="nav-logo">
            <img src={logoSrc} className="nav-logo-mark" alt="" />
            <span className="nav-logo-text">FridgeIQ</span>
          </NavLink>

          <nav className="nav-nav">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
              >
                <span className="nav-link-icon">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="nav-bottom">
          <NavLink to="/profile" className="nav-user-row">
            <div className="nav-avatar">{initials}</div>
            <div className="nav-user-info">
              <span className="nav-user-name">{user.name}</span>
              <span className="nav-user-email">{user.email}</span>
            </div>
          </NavLink>
          <button className="nav-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="nav-icon-btn" onClick={handleLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="nav-mobile-header">
        <NavLink to="/fridge" className="nav-mobile-logo">
          <img src={logoSrc} className="nav-logo-mark" style={{ width: 28, height: 28 }} alt="" />
          <span className="nav-logo-text" style={{ fontSize: 15 }}>FridgeIQ</span>
        </NavLink>
        <div className="nav-mobile-header-right">
          <button className="nav-icon-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <NavLink to="/profile" className="nav-mobile-avatar">{initials}</NavLink>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="nav-bottom-nav">
        {NAV_LINKS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-bottom-link${isActive ? ' nav-bottom-link-active' : ''}`}
          >
            <span className="nav-bottom-icon">{icon}</span>
            <span className="nav-bottom-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
