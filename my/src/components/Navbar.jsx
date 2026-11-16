import React, { useState, useEffect } from 'react';
import { Menu, X, Truck, ShoppingBag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.jpg';

const Logo = ({ onClick, small }) => (
  <button onClick={onClick} className="nav-logo" aria-label="Dilkhush Kirana Store — Home">
    <img src={logo} alt="Dilkhush Kirana Store" style={small ? { height: 36 } : undefined} />
    <span className="nav-logo-text">
      <strong>Kirana</strong>
      <span>Est. 1999</span>
    </span>
  </button>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Specialities', path: '/business' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="nav-announce">
        <span className="diamond" />
        <span>Free delivery on orders above ₹299<span className="hide-sm"> · Homemade &amp; fresh from Dhasa</span></span>
        <span className="diamond" />
      </div>

      {/* Main nav */}
      <header className={`nav-header${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Logo onClick={() => go('/')} />

          {/* Desktop links */}
          <nav className="nav-links nav-desktop">
            {links.map(l => (
              <button
                key={l.path}
                onClick={() => go(l.path === '/business' ? '/businesses' : l.path)}
                className={`nav-link${isActive(l.path) ? ' active' : ''}`}
              >
                {l.name}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="nav-ctas nav-desktop">
            <button onClick={() => go('/track-order')} className="btn btn-outline btn-sm">
              <Truck size={15} /> Track Order
            </button>
            <button onClick={() => go('/products')} className="btn btn-primary btn-sm">
              <ShoppingBag size={15} /> Shop Now
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="nav-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="nav-overlay" />
      )}

      {/* Mobile panel */}
      <div
        className="nav-panel"
        style={{
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      >
        <div className="toran" />
        <div className="nav-panel-head">
          <Logo onClick={() => go('/')} small />
          <button onClick={() => setMobileOpen(false)} className="nav-toggle" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '12px 16px 22px' }}>
          {links.map(l => (
            <button
              key={l.path}
              onClick={() => go(l.path === '/business' ? '/businesses' : l.path)}
              className={`nav-panel-link${isActive(l.path) ? ' active' : ''}`}
            >
              {l.name}
              {isActive(l.path) && <span className="diamond" />}
            </button>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            <button onClick={() => go('/track-order')} className="btn btn-outline">
              <Truck size={16} /> Track
            </button>
            <button onClick={() => go('/products')} className="btn btn-primary">
              <ShoppingBag size={16} /> Shop Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
