import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { trackEvent } from '../utils/analytics';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  const handleLogin = async () => {
    try {
      trackEvent('Navigation', 'Click', 'Login Button');
      const response = await authAPI.getLoginUrl();
      const { authUrl } = response.data;
      // Redirect to MindX login
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get login URL:', error);
    }
  };

  const handleLogout = () => {
    trackEvent('Navigation', 'Click', 'Logout Button');
    logout();
  };

  const handleLogoClick = () => {
    trackEvent('Navigation', 'Click', 'Logo');
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand} onClick={handleLogoClick}>
          <span style={styles.logo}>⚡</span>
          <h2 style={styles.title}>MindX Full Stack</h2>
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="User" style={styles.avatarImage} />
                  ) : (
                    <span style={styles.avatarPlaceholder}>
                      {user.name?.charAt(0).toUpperCase() || '👤'}
                    </span>
                  )}
                </div>
                <div style={styles.userDetails}>
                  <span style={styles.userName}>{user.name || 'User'}</span>
                  <span style={styles.userEmail}>{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  ...styles.logoutBtn,
                  ...(isHoveringLogout ? styles.logoutBtnHover : {})
                }}
                onMouseEnter={() => setIsHoveringLogout(true)}
                onMouseLeave={() => setIsHoveringLogout(false)}
                disabled={isLoading}
              >
                <span style={styles.btnIcon}>🚪</span>
                <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              style={{
                ...styles.loginBtn,
                ...(isHoveringLogin ? styles.loginBtnHover : {})
              }}
              onMouseEnter={() => setIsHoveringLogin(true)}
              onMouseLeave={() => setIsHoveringLogin(false)}
              disabled={isLoading}
            >
              <span style={styles.btnIcon}>🔐</span>
              <span>{isLoading ? 'Logging in...' : 'Login'}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(26, 31, 58, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
  } as React.CSSProperties,

  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as React.CSSProperties,

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,

  logo: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))',
    animation: 'pulse 2s infinite'
  } as React.CSSProperties,

  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #00d4ff 0%, #b537f2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em'
  } as React.CSSProperties,

  badge: {
    padding: '0.25rem 0.75rem',
    background: 'rgba(0, 212, 255, 0.15)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '12px',
    fontSize: '0.7rem',
    color: '#00d4ff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  } as React.CSSProperties,

  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  } as React.CSSProperties,

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    border: '1px solid rgba(100, 100, 150, 0.2)'
  } as React.CSSProperties,

  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid rgba(0, 212, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #b537f2 0%, #00d4ff 100%)'
  } as React.CSSProperties,

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  } as React.CSSProperties,

  avatarPlaceholder: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white'
  } as React.CSSProperties,

  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem'
  } as React.CSSProperties,

  userName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#e4e4e7'
  } as React.CSSProperties,

  userEmail: {
    fontSize: '0.75rem',
    color: '#71717a'
  } as React.CSSProperties,

  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #b537f2 0%, #00d4ff 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,

  loginBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 212, 255, 0.5)'
  } as React.CSSProperties,

  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    background: 'rgba(220, 53, 69, 0.15)',
    color: '#ff6b6b',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,

  logoutBtnHover: {
    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)',
    color: 'white',
    borderColor: 'transparent',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(220, 53, 69, 0.4)'
  } as React.CSSProperties,

  btnIcon: {
    fontSize: '1rem'
  } as React.CSSProperties
};
