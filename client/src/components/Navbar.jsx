import { Link, useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { FaChartLine, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useGeneral();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to={user ? '/home' : '/'} className="nav-brand">
          <FaChartLine /> SB Stocks
        </Link>

        {user && (
          <div className="nav-links">
            <Link to="/home">Dashboard</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/history">History</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          </div>
        )}

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-balance">${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <Link to="/profile" className="btn btn-outline btn-sm">
                <FaUser /> {user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
