import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="brand-block">
          <Link to="/" className="brand-name">
            Artisan Marketplace
          </Link>
          <p className="brand-tag">Earth-crafted goods, human stories.</p>
        </div>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Home</NavLink>
          <NavLink to="/artisans" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Artisans</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Cart{totalItems ? ` (${totalItems})` : ''}</NavLink>
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <NavLink to="/profile" className="header-button">{user.name}</NavLink>
              <button type="button" className="header-button secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-button">Login</Link>
              <Link to="/register" className="header-button secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
