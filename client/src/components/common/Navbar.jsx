import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/fridge', label: 'Fridge' },
  { to: '/scan', label: 'Scanner' },
  { to: '/expiration', label: 'Expiration' },
  { to: '/meals', label: 'Meals' },
  { to: '/import', label: 'Import' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <NavLink to="/fridge" className={styles.logo}>
        FridgeIQ
      </NavLink>

      {user && (
        <ul className={styles.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}

      {user && (
        <div className={styles.right}>
          <NavLink to="/profile" className={styles.link}>
            {user.name}
          </NavLink>
          <button onClick={handleLogout} className={`btn btn-secondary ${styles.logoutBtn}`}>
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
