import { Moon, Sun, LogOut, Briefcase, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navbar({ darkMode, onToggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Briefcase size={24} />
          </div>
          <h1>MY BOSS AI</h1>
        </div>
        
        <div className="navbar-actions">
          {user && (
            <div className="user-info">
              <User size={18} />
              <span>{user.name}</span>
            </div>
          )}
          
          <button
            className="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && (
            <button
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}


