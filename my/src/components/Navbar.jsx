import React, { useState, useEffect } from 'react';
import { Menu, X, Truck, ShoppingBag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.jpg';

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
    { name: 'Blogs', path: '/blogs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        width: '100%', background: '#15803d', color: '#fff',
        textAlign: 'center', fontSize: 12, padding: '7px 16px',
        fontWeight: 500, letterSpacing: '0.02em',
      }}>
        🚚 Free delivery on orders above ₹299 — Homemade &amp; fresh from Dhasa, Gujarat
      </div>

      {/* Main nav */}
      <header style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid #f4f4f5',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 24px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>
          {/* Logo */}
          <button onClick={() => go('/')} style={{
            display: 'flex', alignItems: 'flex-end', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
          }}>
            <img src={logo} alt="Dilkhush" style={{ height: 40, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
            <span className="font-primary" style={{ fontSize: 10, fontWeight: 700, color: '#a1a1aa', marginBottom: 2 }}>.Shop</span>
          </button>

          {/* Desktop links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }} className="nav-desktop">
            {links.map(l => (
              <button
                key={l.path}
                onClick={() => go(l.path)}
                style={{
                  position: 'relative', padding: '7px 14px',
                  fontSize: 14, fontWeight: 500, borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  background: isActive(l.path) ? '#f0fdf4' : 'none',
                  color: isActive(l.path) ? '#15803d' : '#52525b',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { if (!isActive(l.path)) { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#18181b'; }}}
                onMouseLeave={e => { if (!isActive(l.path)) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}}
              >
                {l.name}
                {isActive(l.path) && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 16, height: 2, background: '#16a34a', borderRadius: 2,
                  }} />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} className="nav-desktop">
            <button
              onClick={() => go('/track-order')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                color: '#15803d', border: '1.5px solid #bbf7d0',
                borderRadius: 10, background: 'none', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Truck size={15} /> Track Order
            </button>
            <button
              onClick={() => go('/products')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', fontSize: 13, fontWeight: 600,
                color: '#fff', background: '#15803d', border: 'none',
                borderRadius: 10, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#166534'}
              onMouseLeave={e => e.currentTarget.style.background = '#15803d'}
            >
              <ShoppingBag size={15} /> Shop Now
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="nav-mobile-toggle"
            style={{
              display: 'none', padding: 8, background: 'none',
              border: 'none', cursor: 'pointer', color: '#27272a',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 998, display: 'none',
          }}
          className="nav-mobile-overlay"
        />
      )}

      {/* Mobile panel */}
      <div
        className="nav-mobile-panel"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: '#fff', zIndex: 999,
          borderBottom: '1px solid #f4f4f5',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'transform 0.35s ease, opacity 0.35s ease',
          display: 'none',
        }}
      >
        {/* Panel header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56, borderBottom: '1px solid #f4f4f5' }}>
          <button onClick={() => go('/')} style={{ display: 'flex', alignItems: 'flex-end', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
            <img src={logo} alt="Dilkhush" style={{ height: 34, borderRadius: 7 }} />
            <span className="font-primary" style={{ fontSize: 9, fontWeight: 700, color: '#a1a1aa', marginBottom: 2 }}>.Shop</span>
          </button>
          <button onClick={() => setMobileOpen(false)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#52525b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div style={{ padding: '12px 16px 20px' }}>
          {links.map(l => (
            <button
              key={l.path}
              onClick={() => go(l.path)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '12px 16px', marginBottom: 4,
                borderRadius: 12, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: isActive(l.path) ? 700 : 500,
                background: isActive(l.path) ? '#f0fdf4' : 'none',
                color: isActive(l.path) ? '#15803d' : '#3f3f46',
                textAlign: 'left',
              }}
            >
              {l.name}
              {isActive(l.path) && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} />}
            </button>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <button onClick={() => go('/track-order')} style={{ width: '100%', padding: '12px', border: '1.5px solid #bbf7d0', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#15803d', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Truck size={16} /> Track Order
            </button>
            <button onClick={() => go('/products')} style={{ width: '100%', padding: '13px', background: '#15803d', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <ShoppingBag size={16} /> Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
          .nav-mobile-panel { display: block !important; }
          .nav-mobile-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
