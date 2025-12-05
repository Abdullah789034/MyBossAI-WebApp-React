import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <Loader size={48} className="spinner" />
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>LOADING...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

