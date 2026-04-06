import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">LocASK</Link>
      </div>
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">{user?.name ? `Hi, ${user.name}` : user?.email}</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Log out
            </button>
          </>
        ) : location.pathname === '/register' ? (
          <Link className="btn btn-primary" to="/login">
            Sign in
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/register">
            Create account
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
