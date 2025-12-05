import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { BackgroundArt } from './BackgroundArt';
import { LogIn, Mail, Lock, Loader } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <BackgroundArt />
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="auth-container">
        <div className="auth-card">
        <div className="auth-header">
          <LogIn size={40} />
          <h1>LOGIN</h1>
          <p>ENTER YOUR CREDENTIALS</p>
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <Mail size={18} />
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Loader size={20} className="spinner" /> : 'LOGIN'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            NO ACCOUNT? <Link to="/register">SIGN UP</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

