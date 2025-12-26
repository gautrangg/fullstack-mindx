import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataAPI } from '../utils/api';

interface DashboardData {
  id: number;
  title: string;
  description: string;
  features?: string[];
  lastLogin: string;
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }

    // Fetch protected data on mount
    fetchData();
  }, [user, token, navigate]);

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
      <div style={styles.content}>
        <h1>📊 Your Dashboard</h1>

        {/* User Info Card */}
        <div style={styles.card}>
          <h2>👤 Your Information</h2>
          <div style={styles.infoGrid}>
            <div>
              <p style={styles.label}>Name:</p>
              <p style={styles.value}>{user.name}</p>
            </div>
            <div>
              <p style={styles.label}>Email:</p>
              <p style={styles.value}>{user.email}</p>
            </div>
            <div>
              <p style={styles.label}>User ID:</p>
              <p style={styles.value}>{user.id}</p>
            </div>
          </div>
          {user.avatar && (
            <img 
              src={user.avatar} 
              alt="User Avatar"
              style={styles.avatar}
            />
          )}
        </div>

        {/* Protected Data Card */}
        {error && (
          <div style={styles.errorCard}>
            <p>❌ Error: {error}</p>
            <button onClick={fetchData}>Retry</button>
          </div>
        )}

        {loading && (
          <div style={styles.loadingCard}>
            <p>⏳ Loading protected data...</p>
          </div>
        )}

        {data && (
          <div style={styles.card}>
            <h2>📋 Protected Data</h2>
            <div style={styles.infoGrid}>
              <div>
                <p style={styles.label}>Title:</p>
                <p style={styles.value}>{data.title}</p>
              </div>
              <div>
                <p style={styles.label}>Description:</p>
                <p style={styles.value}>{data.description}</p>
              </div>
              <div>
                <p style={styles.label}>Last Updated:</p>
                <p style={styles.value}>{new Date(data.lastLogin).toLocaleString()}</p>
              </div>
            </div>
            {data.features && (
              <div style={styles.features}>
                <p style={styles.label}>Features:</p>
                <ul>
                  {data.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#f5f5f5',
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem'
  } as React.CSSProperties,
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  } as React.CSSProperties,
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  } as React.CSSProperties,
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  } as React.CSSProperties,
  label: {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '0.5rem'
  } as React.CSSProperties,
  value: {
    fontSize: '16px',
    color: '#333'
  } as React.CSSProperties,
  avatar: {
    maxWidth: '150px',
    borderRadius: '8px',
    marginTop: '1rem'
  } as React.CSSProperties,
  errorCard: {
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem'
  } as React.CSSProperties,
  loadingCard: {
    background: '#d1ecf1',
    border: '1px solid #bee5eb',
    color: '#0c5460',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem'
  } as React.CSSProperties,
  features: {
    marginTop: '1rem'
  } as React.CSSProperties
};