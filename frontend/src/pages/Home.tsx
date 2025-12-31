import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div style={styles.container}>
      {/* Animated Background Elements */}
      <div style={styles.bgGradient}></div>

      <div style={styles.content}>
        {/* Main Hero Section */}
        <div style={styles.hero}>
          <div style={styles.glowEffect}></div>
          <h1 style={styles.title}>
            <span style={styles.titleGradient}>MindX</span> Full Stack
          </h1>
          <p style={styles.subtitle}>
            Enterprise-grade authentication platform built with modern tech stack
          </p>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>⚡</span>
            <span>Production Ready</span>
          </div>
        </div>

        {/* Features Grid */}
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
            <div style={styles.featureIcon}>🔐</div>
            <h3 style={styles.featureTitle}>Secure Authentication</h3>
            <p style={styles.featureDesc}>
              OpenID Connect integration with enterprise-grade security
            </p>
            <div style={styles.featureHighlight}></div>
          </div>

          <div style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
            <div style={styles.featureIcon}>🛡️</div>
            <h3 style={styles.featureTitle}>Protected Routes</h3>
            <p style={styles.featureDesc}>
              Advanced route protection with token-based authorization
            </p>
            <div style={styles.featureHighlight}></div>
          </div>

          <div style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
            <div style={styles.featureIcon}>👤</div>
            <h3 style={styles.featureTitle}>User Management</h3>
            <p style={styles.featureDesc}>
              Complete user profile and session management system
            </p>
            <div style={styles.featureHighlight}></div>
          </div>

          <div style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Real-time Data</h3>
            <p style={styles.featureDesc}>
              Protected data fetching with real-time synchronization
            </p>
            <div style={styles.featureHighlight}></div>
          </div>

          <div style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
            <div style={styles.featureIcon}>🔑</div>
            <h3 style={styles.featureTitle}>Token Management</h3>
            <p style={styles.featureDesc}>
              Secure JWT token storage and automatic refresh handling
            </p>
            <div style={styles.featureHighlight}></div>
          </div>

          <div style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
            <div style={styles.featureIcon}>☁️</div>
            <h3 style={styles.featureTitle}>Cloud Native</h3>
            <p style={styles.featureDesc}>
              Deployed on Azure AKS with Docker containerization
            </p>
            <div style={styles.featureHighlight}></div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div style={styles.techSection}>
          <h2 style={styles.techTitle}>
            <span style={styles.techTitleIcon}>🚀</span>
            Powered By Modern Tech Stack
          </h2>
          <div style={styles.techGrid}>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="blue">React</div>
              <span style={styles.techLabel}>Frontend</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="blue">TypeScript</div>
              <span style={styles.techLabel}>Type Safety</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="green">Node.js</div>
              <span style={styles.techLabel}>Backend</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="green">Express</div>
              <span style={styles.techLabel}>API Server</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="purple">OpenID</div>
              <span style={styles.techLabel}>Authentication</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="orange">Azure</div>
              <span style={styles.techLabel}>Cloud Platform</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="blue">Docker</div>
              <span style={styles.techLabel}>Containers</span>
            </div>
            <div style={styles.techItem}>
              <div style={styles.techBadge} data-color="purple">Kubernetes</div>
              <span style={styles.techLabel}>Orchestration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hover effect handler
function handleCardHover(e: React.MouseEvent<HTMLDivElement>, isHover: boolean) {
  const card = e.currentTarget;
  if (isHover) {
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.5)';
    card.style.borderColor = 'rgba(0, 212, 255, 0.5)';
  } else {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    card.style.borderColor = 'rgba(100, 100, 150, 0.2)';
  }
}

const styles = {
  container: {
    position: 'relative',
    minHeight: 'calc(100vh - 80px)',
    background: '#0a0e27',
    overflow: 'hidden',
    padding: '2rem'
  } as React.CSSProperties,

  bgGradient: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'radial-gradient(circle at 20% 50%, rgba(101, 78, 163, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none'
  } as React.CSSProperties,

  content: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 1,
    animation: 'fadeIn 0.8s ease-out'
  } as React.CSSProperties,

  hero: {
    position: 'relative',
    textAlign: 'center',
    padding: '4rem 2rem',
    marginBottom: '4rem'
  } as React.CSSProperties,

  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none'
  } as React.CSSProperties,

  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
    color: '#e4e4e7',
    letterSpacing: '-0.02em',
    position: 'relative'
  } as React.CSSProperties,

  titleGradient: {
    background: 'linear-gradient(135deg, #b537f2 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  } as React.CSSProperties,

  subtitle: {
    fontSize: '1.25rem',
    color: '#a1a1aa',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    lineHeight: '1.6'
  } as React.CSSProperties,

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.5rem',
    background: 'rgba(0, 212, 255, 0.1)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '24px',
    color: '#00d4ff',
    fontSize: '0.875rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)'
  } as React.CSSProperties,

  badgeIcon: {
    fontSize: '1rem'
  } as React.CSSProperties,

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem'
  } as React.CSSProperties,

  featureCard: {
    position: 'relative',
    background: 'rgba(26, 31, 58, 0.6)',
    border: '1px solid rgba(100, 100, 150, 0.2)',
    borderRadius: '16px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    overflow: 'hidden'
  } as React.CSSProperties,

  featureHighlight: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '3px',
    background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
    opacity: 0.5
  } as React.CSSProperties,

  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#e4e4e7',
    marginBottom: '0.75rem'
  } as React.CSSProperties,

  featureDesc: {
    fontSize: '0.95rem',
    color: '#a1a1aa',
    lineHeight: '1.6'
  } as React.CSSProperties,

  techSection: {
    marginBottom: '4rem',
    padding: '3rem 2rem',
    background: 'rgba(26, 31, 58, 0.4)',
    borderRadius: '24px',
    border: '1px solid rgba(100, 100, 150, 0.15)'
  } as React.CSSProperties,

  techTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#e4e4e7',
    textAlign: 'center',
    marginBottom: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem'
  } as React.CSSProperties,

  techTitleIcon: {
    fontSize: '2rem'
  } as React.CSSProperties,

  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem'
  } as React.CSSProperties,

  techItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  } as React.CSSProperties,

  techBadge: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    background: 'rgba(0, 212, 255, 0.1)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    color: '#00d4ff',
    width: '100%',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,

  techLabel: {
    fontSize: '0.75rem',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  } as React.CSSProperties,

  ctaSection: {
    textAlign: 'center',
    padding: '3rem 2rem'
  } as React.CSSProperties,

  ctaText: {
    fontSize: '1.5rem',
    color: '#a1a1aa',
    marginBottom: '1.5rem',
    fontWeight: '500'
  } as React.CSSProperties,

  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 2.5rem',
    background: 'linear-gradient(135deg, #b537f2 0%, #00d4ff 100%)',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
  } as React.CSSProperties,

  ctaButtonText: {
    fontSize: '1rem'
  } as React.CSSProperties,

  ctaArrow: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  } as React.CSSProperties
};
