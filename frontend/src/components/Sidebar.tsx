import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">Main Navigation</div>

      <Link
        to="/"
        className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        <span className="sidebar-link-icon">📋</span>
        Feed
      </Link>

      <Link
        to="/liked"
        className={`sidebar-link ${location.pathname === '/liked' ? 'active' : ''}`}
      >
        <span className="sidebar-link-icon">❤️</span>
        Liked
      </Link>
    </aside>
  );
};

export default Sidebar;
