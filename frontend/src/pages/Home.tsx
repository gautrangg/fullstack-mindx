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
      <div style={styles.card}>
        <h1>Welcome to MindX Full Stack App 🎉</h1>
        <p style={styles.subtitle}>
          A demo application built with Node.js, React, and OpenID authentication
        </p>
        
        <div style={styles.features}>
          <h2>Features:</h2>
          <ul>
            <li>✅ User Authentication (Login/Logout)</li>
            <li>✅ Protected Routes</li>
            <li>✅ User Info Display</li>
            <li>✅ Protected Data Fetching</li>
            <li>✅ Secure Token Management</li>
          </ul>
        </div>

        <div style={styles.techStack}>
          <h2>Tech Stack:</h2>
          <p>Frontend: React + TypeScript</p>
          <p>Backend: Node.js + Express + TypeScript</p>
          <p>Auth: OpenID Connect</p>
          <p>Deployment: Azure Cloud (AKS + Docker)</p>
        </div>

        <p style={styles.cta}>Click "Login" to get started! 👆</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem'
  } as React.CSSProperties,
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '600px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  } as React.CSSProperties,
  subtitle: {
    fontSize: '18px',
    color: '#666'
  } as React.CSSProperties,
  features: {
    marginTop: '2rem',
    padding: '1rem',
    background: '#f0f0f0',
    borderRadius: '4px'
  } as React.CSSProperties,
  techStack: {
    marginTop: '2rem',
    padding: '1rem',
    background: '#e3f2fd',
    borderRadius: '4px'
  } as React.CSSProperties,
  cta: {
    marginTop: '2rem',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center'
  } as React.CSSProperties
};