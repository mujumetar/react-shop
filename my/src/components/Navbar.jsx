import React, { useState, useEffect } from 'react';
import { Menu, X, Truck, ShoppingBag, Home, Sparkles, BookOpen, Info, Phone, ChevronRight, MessageCircle } from 'lucide-react';

const SPECIALS = [
  { slug: 'kachariyu', name: 'Kachariyu', gu: 'કચરિયું' },
  { slug: 'mari-masala', name: 'Mari Masala', gu: 'મરી મસાલા' },
  { slug: 'groundnut-oil', name: 'Groundnut Oil', gu: 'સીંગતેલ' },
  { slug: 'cattle-feed', name: 'Cattle Feed', gu: 'પશુ આહાર' },
];
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
    if (!mobileOpen) return;
    const onKey = e => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const links = [
    { name: 'Home', path: '/', Icon: Home },
    { name: 'Products', path: '/products', Icon: ShoppingBag },
    { name: 'Specialities', path: '/business', Icon: Sparkles },
    { name: 'Blogs', path: '/blogs', Icon: BookOpen },
    { name: 'About', path: '/about', Icon: Info },
    { name: 'Contact', path: '/contact', Icon: Phone },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="nav-announce">
        <span className="diamond" />
        <span>Free delivery across Gujarat<span className="hide-sm"> · Homemade &amp; fresh from Dhasa</span></span>
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
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="nav-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`mnav-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <aside className={`mnav${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen} aria-label="Menu">
        <div className="mnav-head">
          <div className="bandhani-light" style={{ position: 'absolute', inset: 0 }} />
          <div className="mnav-head-row">
            <Logo onClick={() => go('/')} small />
            <button onClick={() => setMobileOpen(false)} className="mnav-close" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <p className="mnav-greet"><span lang="gu">પધારો</span> · Welcome to Dilkhush</p>
          <div className="mnav-toran" />
        </div>

        <div className="mnav-body">
          <nav className="mnav-links">
            {links.map(l => (
              <button
                key={l.path}
                onClick={() => go(l.path === '/business' ? '/businesses' : l.path)}
                className={`mnav-link${isActive(l.path) ? ' active' : ''}`}
              >
                <span className="mnav-ico"><l.Icon size={18} /></span>
                <span className="mnav-label">{l.name}</span>
                <ChevronRight size={16} className="mnav-chev" />
              </button>
            ))}
          </nav>

          <p className="mnav-section">Our Specialities</p>
          <div className="mnav-spec">
            {SPECIALS.map(s => (
              <button key={s.slug} onClick={() => go(`/business/${s.slug}`)} className="mnav-spec-tile">
                <span lang="gu">{s.gu}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mnav-foot">
          <div className="mnav-ctas">
            <button onClick={() => go('/track-order')} className="btn btn-outline"><Truck size={16} /> Track</button>
            <button onClick={() => go('/products')} className="btn btn-primary"><ShoppingBag size={16} /> Shop Now</button>
          </div>
          <div className="mnav-contact">
            <a href="tel:+919723089786"><Phone size={15} /> Call Us</a>
            <a href="https://wa.me/919723089786" target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> WhatsApp</a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
