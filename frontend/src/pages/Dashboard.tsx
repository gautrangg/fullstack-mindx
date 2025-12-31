import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { dataAPI } from '../utils/api';

interface DashboardData {
  id: number;
  title: string;
  description: string;
  features?: string[];
  lastLogin: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchData();
}, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataAPI.getUserData();
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch data';
      setError(errorMessage);
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.bgGradient}></div>

      <div style={styles.content}>
        {/* Page Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back, {user.name}!</p>
          </div>
          <div style={styles.headerBadge}>
            <span style={styles.statusDot}></span>
            <span>Active Session</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div
            style={styles.statCard}
            onMouseEnter={(e) => handleStatHover(e, true)}
            onMouseLeave={(e) => handleStatHover(e, false)}
          >
            <div style={styles.statIcon}>👤</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Account Status</p>
              <p style={styles.statValue}>Verified</p>
            </div>
            <div style={{...styles.statGlow, background: 'rgba(0, 212, 255, 0.1)'}}></div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) => handleStatHover(e, true)}
            onMouseLeave={(e) => handleStatHover(e, false)}
          >
            <div style={styles.statIcon}>🔐</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Auth Method</p>
              <p style={styles.statValue}>OpenID</p>
            </div>
            <div style={{...styles.statGlow, background: 'rgba(181, 55, 242, 0.1)'}}></div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) => handleStatHover(e, true)}
            onMouseLeave={(e) => handleStatHover(e, false)}
          >
            <div style={styles.statIcon}>⚡</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Session</p>
              <p style={styles.statValue}>Secure</p>
            </div>
            <div style={{...styles.statGlow, background: 'rgba(57, 255, 20, 0.1)'}}></div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) => handleStatHover(e, true)}
            onMouseLeave={(e) => handleStatHover(e, false)}
          >
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Data Access</p>
              <p style={styles.statValue}>Full</p>
            </div>
            <div style={{...styles.statGlow, background: 'rgba(255, 107, 53, 0.1)'}}></div>
          </div>
        </div>

        {/* User Information Card */}
        <div
          style={styles.mainCard}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardIcon}>👤</span>
              User Information
            </h2>
            <div style={styles.cardBadge}>Primary Account</div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Full Name</p>
              <p style={styles.infoValue}>{user.name}</p>
              <div style={styles.infoUnderline}></div>
            </div>

            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Email Address</p>
              <p style={styles.infoValue}>{user.email}</p>
              <div style={styles.infoUnderline}></div>
            </div>

            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>User ID</p>
              <p style={styles.infoValue}>{user.id}</p>
              <div style={styles.infoUnderline}></div>
            </div>
          </div>

          {user.avatar && (
            <div style={styles.avatarContainer}>
              <img
                src={user.avatar}
                alt="User Avatar"
                style={styles.avatar}
              />
              <div style={styles.avatarGlow}></div>
            </div>
          )}
        </div>

        {/* Error Card */}
        {error && (
          <div style={styles.errorCard}>
            <div style={styles.errorHeader}>
              <span style={styles.errorIcon}>⚠️</span>
              <h3 style={styles.errorTitle}>Error Loading Data</h3>
            </div>
            <p style={styles.errorMessage}>{error}</p>
            <button
              onClick={fetchData}
              style={styles.retryButton}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <span>🔄</span> Retry
            </button>
          </div>
        )}

        {/* Loading Card */}
        {loading && (
          <div style={styles.loadingCard}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading protected data...</p>
            <div style={styles.loadingBar}>
              <div style={styles.loadingBarFill}></div>
            </div>
          </div>
        )}

        {/* Protected Data Card */}
        {data && !loading && (
          <div
            style={styles.mainCard}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <span style={styles.cardIcon}>📋</span>
                Protected Data
              </h2>
              <div style={styles.cardBadge}>Secured Content</div>
            </div>

            <div style={styles.dataContent}>
              <div style={styles.dataItem}>
                <div style={styles.dataLabel}>
                  <span style={styles.dataIcon}>📌</span>
                  Title
                </div>
                <div style={styles.dataValue}>{data.title}</div>
              </div>

              <div style={styles.dataItem}>
                <div style={styles.dataLabel}>
                  <span style={styles.dataIcon}>📝</span>
                  Description
                </div>
                <div style={styles.dataValue}>{data.description}</div>
              </div>

              <div style={styles.dataItem}>
                <div style={styles.dataLabel}>
                  <span style={styles.dataIcon}>🕒</span>
                  Last Updated
                </div>
                <div style={styles.dataValue}>
                  {new Date(data.lastLogin).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>
              </div>

              {data.features && data.features.length > 0 && (
                <div style={styles.featuresSection}>
                  <div style={styles.dataLabel}>
                    <span style={styles.dataIcon}>✨</span>
                    Available Features
                  </div>
                  <div style={styles.featuresGrid}>
                    {data.features.map((feature, index) => (
                      <div
                        key={index}
                        style={styles.featureTag}
                        onMouseEnter={(e) => handleFeatureHover(e, true)}
                        onMouseLeave={(e) => handleFeatureHover(e, false)}
                      >
                        <span style={styles.featureCheck}>✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hover effect handlers
function handleStatHover(e: React.MouseEvent<HTMLDivElement>, isHover: boolean) {
  const card = e.currentTarget;
  if (isHover) {
    card.style.transform = 'translateY(-4px) scale(1.02)';
    card.style.boxShadow = '0 0 25px rgba(0, 212, 255, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4)';
    card.style.borderColor = 'rgba(0, 212, 255, 0.4)';
  } else {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    card.style.borderColor = 'rgba(100, 100, 150, 0.2)';
  }
}

function handleCardHover(e: React.MouseEvent<HTMLDivElement>, isHover: boolean) {
  const card = e.currentTarget;
  if (isHover) {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)';
    card.style.borderColor = 'rgba(0, 212, 255, 0.3)';
  } else {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    card.style.borderColor = 'rgba(100, 100, 150, 0.2)';
  }
}

function handleButtonHover(e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) {
  const button = e.currentTarget;
  if (isHover) {
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
  } else {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  }
}

function handleFeatureHover(e: React.MouseEvent<HTMLDivElement>, isHover: boolean) {
  const tag = e.currentTarget;
  if (isHover) {
    tag.style.background = 'rgba(0, 212, 255, 0.2)';
    tag.style.borderColor = 'rgba(0, 212, 255, 0.5)';
    tag.style.transform = 'translateX(4px)';
  } else {
    tag.style.background = 'rgba(0, 212, 255, 0.08)';
    tag.style.borderColor = 'rgba(0, 212, 255, 0.2)';
    tag.style.transform = 'translateX(0)';
  }
}

const styles = {
  container: {
    position: 'relative',
    minHeight: 'calc(100vh - 80px)',
    background: '#0a0e27',
    padding: '2rem',
    overflow: 'hidden'
  } as React.CSSProperties,

  bgGradient: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'radial-gradient(circle at 10% 20%, rgba(101, 78, 163, 0.12) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(0, 212, 255, 0.12) 0%, transparent 50%)',
    pointerEvents: 'none'
  } as React.CSSProperties,

  content: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 1,
    animation: 'fadeIn 0.6s ease-out'
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  } as React.CSSProperties,

  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #00d4ff 0%, #b537f2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#a1a1aa',
    fontWeight: '400'
  } as React.CSSProperties,

  headerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'rgba(57, 255, 20, 0.1)',
    border: '1px solid rgba(57, 255, 20, 0.3)',
    borderRadius: '24px',
    color: '#39ff14',
    fontSize: '0.875rem',
    fontWeight: '600'
  } as React.CSSProperties,

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#39ff14',
    boxShadow: '0 0 10px rgba(57, 255, 20, 0.6)',
    animation: 'pulse 2s infinite'
  } as React.CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem'
  } as React.CSSProperties,

  statCard: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    background: 'rgba(26, 31, 58, 0.6)',
    border: '1px solid rgba(100, 100, 150, 0.2)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    overflow: 'hidden'
  } as React.CSSProperties,

  statGlow: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    opacity: 0.5,
    pointerEvents: 'none'
  } as React.CSSProperties,

  statIcon: {
    fontSize: '2rem',
    zIndex: 1
  } as React.CSSProperties,

  statContent: {
    flex: 1,
    zIndex: 1
  } as React.CSSProperties,

  statLabel: {
    fontSize: '0.8rem',
    color: '#71717a',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  } as React.CSSProperties,

  statValue: {
    fontSize: '1.25rem',
    color: '#e4e4e7',
    fontWeight: '700'
  } as React.CSSProperties,

  mainCard: {
    background: 'rgba(26, 31, 58, 0.6)',
    border: '1px solid rgba(100, 100, 150, 0.2)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)'
  } as React.CSSProperties,

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(100, 100, 150, 0.15)'
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#e4e4e7',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  } as React.CSSProperties,

  cardIcon: {
    fontSize: '1.75rem'
  } as React.CSSProperties,

  cardBadge: {
    padding: '0.5rem 1rem',
    background: 'rgba(181, 55, 242, 0.1)',
    border: '1px solid rgba(181, 55, 242, 0.3)',
    borderRadius: '20px',
    color: '#b537f2',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  } as React.CSSProperties,

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem'
  } as React.CSSProperties,

  infoItem: {
    position: 'relative',
    paddingBottom: '0.75rem'
  } as React.CSSProperties,

  infoLabel: {
    fontSize: '0.85rem',
    color: '#71717a',
    marginBottom: '0.5rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  } as React.CSSProperties,

  infoValue: {
    fontSize: '1.1rem',
    color: '#e4e4e7',
    fontWeight: '500'
  } as React.CSSProperties,

  infoUnderline: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '2px',
    background: 'linear-gradient(90deg, #00d4ff, transparent)',
    opacity: 0.3
  } as React.CSSProperties,

  avatarContainer: {
    position: 'relative',
    marginTop: '2rem',
    display: 'inline-block'
  } as React.CSSProperties,

  avatar: {
    maxWidth: '120px',
    borderRadius: '12px',
    border: '2px solid rgba(0, 212, 255, 0.3)',
    position: 'relative',
    zIndex: 1
  } as React.CSSProperties,

  avatarGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '140px',
    height: '140px',
    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
    filter: 'blur(20px)',
    zIndex: 0
  } as React.CSSProperties,

  errorCard: {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem'
  } as React.CSSProperties,

  errorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  errorIcon: {
    fontSize: '1.5rem'
  } as React.CSSProperties,

  errorTitle: {
    fontSize: '1.25rem',
    color: '#ff6b6b',
    fontWeight: '700'
  } as React.CSSProperties,

  errorMessage: {
    color: '#fca5a5',
    marginBottom: '1.5rem',
    fontSize: '0.95rem'
  } as React.CSSProperties,

  retryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  } as React.CSSProperties,

  loadingCard: {
    background: 'rgba(0, 212, 255, 0.05)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    borderRadius: '12px',
    padding: '3rem 2rem',
    marginBottom: '2rem',
    textAlign: 'center'
  } as React.CSSProperties,

  loadingSpinner: {
    width: '50px',
    height: '50px',
    margin: '0 auto 1.5rem',
    border: '4px solid rgba(0, 212, 255, 0.1)',
    borderTop: '4px solid #00d4ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as React.CSSProperties,

  loadingText: {
    color: '#00d4ff',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    fontWeight: '500'
  } as React.CSSProperties,

  loadingBar: {
    width: '100%',
    maxWidth: '300px',
    height: '4px',
    margin: '0 auto',
    background: 'rgba(0, 212, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden'
  } as React.CSSProperties,

  loadingBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4ff, #b537f2)',
    animation: 'shimmer 2s infinite',
    width: '100%'
  } as React.CSSProperties,

  dataContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  } as React.CSSProperties,

  dataItem: {
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(100, 100, 150, 0.1)'
  } as React.CSSProperties,

  dataLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#71717a',
    marginBottom: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  } as React.CSSProperties,

  dataIcon: {
    fontSize: '1rem'
  } as React.CSSProperties,

  dataValue: {
    fontSize: '1.05rem',
    color: '#e4e4e7',
    lineHeight: '1.6'
  } as React.CSSProperties,

  featuresSection: {
    padding: '1.5rem',
    background: 'rgba(0, 212, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 212, 255, 0.15)'
  } as React.CSSProperties,

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
    marginTop: '1rem'
  } as React.CSSProperties,

  featureTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(0, 212, 255, 0.08)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    borderRadius: '8px',
    color: '#00d4ff',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer'
  } as React.CSSProperties,

  featureCheck: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    background: 'rgba(0, 212, 255, 0.2)',
    borderRadius: '50%',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  } as React.CSSProperties
};

// Add keyframe for spinner
const styleSheet = document.styleSheets[0];
const keyframesSpin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframesSpin, styleSheet.cssRules.length);
} catch (e) {
  // Keyframe might already exist
}
