import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, login, logout, isLoading } = useAuth();

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.title} onClick={() => navigate('/')}>
        🚀 MindX App
      </h2>
      <div style={styles.actions}>
        {user ? (
          <>
            <span style={styles.userInfo}>
              👤 {user.name}
            </span>
            <button 
              onClick={logout} 
              style={styles.logoutBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : '🚪 Logout'}
            </button>
          </>
        ) : (
          <button 
            onClick={login} 
            style={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : '🔐 Login'}
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    padding: '1rem 2rem',
    borderBottom: '2px solid #007bff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8f9fa'
  } as React.CSSProperties,
  title: {
    margin: 0,
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 'bold'
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  } as React.CSSProperties,
  userInfo: {
    fontSize: '16px',
    fontWeight: 'bold'
  } as React.CSSProperties,
  loginBtn: {
    padding: '8px 16px',
    fontSize: '14px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  } as React.CSSProperties,
  logoutBtn: {
    padding: '8px 16px',
    fontSize: '14px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  } as React.CSSProperties
};