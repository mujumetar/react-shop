import { MapPin, Phone, Mail, Instagram, ArrowRight, Heart, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.jpg';

const WA_SVG = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.860 9.860 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Kachariyu', path: '/business/kachariyu' },
  { name: 'Mari Masala', path: '/business/mari-masala' },
  { name: 'Groundnut Oil', path: '/business/groundnut-oil' },
  { name: 'Cattle Feed', path: '/business/cattle-feed' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Track Order', path: '/track-order' },
  { name: 'Blogs', path: '/blogs' },
];

const legal = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms & Conditions', path: '/terms-conditions' },
  { name: 'Refund Policy', path: '/refund-policy' },
];

const trustItems = [
  { icon: <Truck size={15} />, text: 'Free delivery across Gujarat' },
  { icon: <ShieldCheck size={15} />, text: '100% pure & natural' },
  { icon: <Clock size={15} />, text: 'Open 9 AM – 6 PM' },
];

export default function Footer() {
  const navigate = useNavigate();
  const go = path => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer className="dk-footer">
      {/* scalloped top edge */}
      <div aria-hidden="true" style={{ position: 'absolute', top: -9, left: 0, right: 0, height: 9, background: 'radial-gradient(circle at 50% 100%, #24120C 6px, transparent 6.5px) 0 0 / 16px 9px repeat-x' }} />
      <div className="bandhani-light" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: .5, pointerEvents: 'none' }} />

      <div style={{ position: 'relative' }}>
        {/* ── Trust strip ── */}
        <div className="footer-trust">
          {trustItems.map((t, i) => (
            <div key={i} className="footer-trust-item">{t.icon}{t.text}</div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <button onClick={() => go('/')} className="nav-logo" style={{ marginBottom: 18 }}>
              <img src={logo} alt="Dilkhush Kirana Store" style={{ borderColor: 'rgba(246,231,196,.2)' }} />
              <span className="nav-logo-text">
                <strong style={{ color: '#F6E7C4' }}>Kirana</strong>
                <span style={{ color: '#C98A1B' }}>Est. 1999</span>
              </span>
            </button>

            <p className="footer-dim" style={{ maxWidth: 300, marginBottom: 18 }}>
              Your trusted neighbourhood kirana store in Dhasa, Gujarat. Serving pure homemade saani, kachariyu &amp; spices since 1999.
            </p>

            {/* Rating badge */}
            <div className="footer-box" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 14px', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C98A1B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,247,234,.72)' }}>Trusted by 500+ families</span>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: 'https://www.instagram.com/dilkhush_kirana', icon: <Instagram size={16} />, label: 'Instagram' },
                { href: 'https://wa.me/919723089786', icon: WA_SVG, label: 'WhatsApp' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="footer-col-title">Quick Links</p>
            {quickLinks.map(l => (
              <button key={l.path} onClick={() => go(l.path)} className="footer-link">
                <span className="diamond" />
                {l.name}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="footer-col-title">Visit Us</p>
            {[
              { Icon: MapPin, text: 'Dhasa Junction, Gujarat, India' },
              { Icon: Phone, text: '+91 97230 89786', href: 'tel:+919723089786' },
              { Icon: Phone, text: '+91 90333 32365', href: 'tel:+919033332365' },
              { Icon: Mail, text: 'mustakmetar82@gmail.com', href: 'mailto:mustakmetar82@gmail.com', small: true },
            ].map((c, i) => (
              <div key={i} className="footer-contact-row">
                <c.Icon size={15} />
                {c.href
                  ? <a href={c.href} style={{ fontSize: c.small ? 14 : 15, wordBreak: 'break-all', transition: 'color .2s' }}>{c.text}</a>
                  : <span>{c.text}</span>}
              </div>
            ))}

            <div className="footer-box" style={{ marginTop: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#C98A1B', margin: '0 0 6px' }}>Opening Hours</p>
              <p style={{ fontSize: 14, color: 'rgba(255,247,234,.66)', margin: 0 }}>Mon – Fri: 9 AM – 6 PM</p>
              <p style={{ fontSize: 14, color: 'rgba(255,247,234,.66)', margin: 0 }}>Sat – Sun: 9 AM – 2 PM</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="footer-col-title">Stay Updated</p>
            <p className="footer-dim" style={{ marginBottom: 16 }}>
              Get notified about new seasonal products, deals and recipes from our kitchen.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="email" placeholder="your@email.com" className="footer-input" />
              <button className="btn btn-gold btn-block">
                Subscribe <ArrowRight size={15} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,247,234,.38)', marginTop: 10 }}>
              No spam. Unsubscribe anytime.
            </p>

            <a href="https://wa.me/919723089786" target="_blank" rel="noopener noreferrer"
              className="footer-box"
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, borderColor: 'rgba(37,211,102,.28)', background: 'rgba(37,211,102,.08)' }}
            >
              <div style={{ width: 36, height: 36, background: '#25d366', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {WA_SVG}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#86EFAC', margin: 0, lineHeight: 1.2 }}>Order on WhatsApp</p>
                <p style={{ fontSize: 13, color: 'rgba(255,247,234,.5)', margin: 0 }}>Quick, easy ordering</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p style={{ margin: 0 }}>
              © 2025 Dilkhush Kirana Store. Made with&nbsp;
              <Heart size={11} style={{ display: 'inline', color: '#C98A1B', fill: '#C98A1B', verticalAlign: 'middle' }} />
              &nbsp;in Dhasa, Gujarat.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              {legal.map((l, i) => (
                <span key={l.path} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && <span style={{ opacity: .4 }}>·</span>}
                  <button onClick={() => go(l.path)}>{l.name}</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Credit ── */}
        <div className="footer-credit">
          Made with <Heart size={12} style={{ display: 'inline', color: '#C98A1B', fill: '#C98A1B', verticalAlign: '-1px' }} /> by{' '}
          <a href="https://mzml.co.in" target="_blank" rel="noopener noreferrer">mzml.co.in</a>
        </div>
      </div>
    </footer>
  );
}
