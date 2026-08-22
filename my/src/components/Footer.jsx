import { MapPin, Phone, Mail, Instagram, ArrowRight, Heart, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.jpg';

const WA_SVG = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
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
  { icon: <Truck size={14} />, text: 'Free delivery above ₹299' },
  { icon: <ShieldCheck size={14} />, text: '100% pure & natural' },
  { icon: <Clock size={14} />, text: 'Open 9 AM – 6 PM' },
];

export default function Footer() {
  const navigate = useNavigate();
  const go = path => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const dimText = { fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7 };
  const colHead = { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.7)', marginBottom: 20 };
  const linkBtn = {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, color: 'rgba(255,255,255,0.42)',
    padding: '5px 0', background: 'none', border: 'none',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    transition: 'color 0.2s, gap 0.2s',
  };

  return (
    <footer style={{ background: '#0b110b', color: '#fff', fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* ── Trust strip ── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(22,163,74,0.08)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '16px 32px',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: '0px',
        }}>
          {trustItems.map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 28px',
              borderRight: i < trustItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500,
            }}>
              <span style={{ color: '#4ade80' }}>{t.icon}</span>
              {t.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '68px 32px 52px',
        display: 'grid',
        gridTemplateColumns: '2.2fr 1fr 1fr 1.5fr',
        gap: 56,
      }} className="footer-main-grid">

        {/* Brand column */}
        <div>
          {/* Logo — same as navbar */}
          <button
            onClick={() => go('/')}
            style={{ display: 'flex', alignItems: 'flex-end', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 20 }}
          >
            <img src={logo} alt="Dilkhush" style={{ height: 40, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
            <span className="font-primary" style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>.Shop</span>
          </button>

          <p style={{ ...dimText, maxWidth: 280, marginBottom: 16 }}>
            Your trusted neighbourhood kirana store in Dhasa, Gujarat. Serving pure homemade saani, kachariyu &amp; spices since 1999.
          </p>

          {/* Rating badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '8px 14px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Trusted by 500+ families</span>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { href: 'https://www.instagram.com/dilkhush_kirana', icon: <Instagram size={15} />, label: 'Instagram', hoverColor: '#f472b6' },
              { href: 'https://wa.me/919723089786', icon: WA_SVG, label: 'WhatsApp', hoverColor: '#4ade80' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s', textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.hoverColor; e.currentTarget.style.color = s.hoverColor; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p style={colHead}>Quick Links</p>
          {quickLinks.map(l => (
            <button
              key={l.path}
              onClick={() => go(l.path)}
              style={linkBtn}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.gap = '12px'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.42)'; e.currentTarget.style.gap = '8px'; }}
            >
              <ArrowRight size={11} style={{ color: '#4ade80', flexShrink: 0 }} />
              {l.name}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={colHead}>Contact</p>
          {[
            { Icon: MapPin, text: 'Dhasa Junction, Gujarat, India' },
            { Icon: Phone, text: '+91 97230 89786', href: 'tel:+919723089786' },
            { Icon: Phone, text: '+91 90333 32365', href: 'tel:+919033332365' },
            { Icon: Mail, text: 'mustakmetar82@gmail.com', href: 'mailto:mustakmetar82@gmail.com', small: true },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <c.Icon size={14} style={{ color: '#4ade80', flexShrink: 0, marginTop: 2 }} />
              {c.href
                ? <a href={c.href} style={{ fontSize: c.small ? 12 : 13, color: 'rgba(255,255,255,0.5)', transition: 'color .2s', wordBreak: 'break-all' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >{c.text}</a>
                : <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{c.text}</span>
              }
            </div>
          ))}

          {/* Hours */}
          <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', marginBottom: 8 }}>Opening Hours</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Mon – Fri: 9 AM – 6 PM</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Sat – Sun: 9 AM – 2 PM</p>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <p style={colHead}>Stay Updated</p>
          <p style={{ ...dimText, marginBottom: 20 }}>
            Get notified about new seasonal products, deals and recipes from our kitchen.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 11, fontSize: 13, color: '#fff',
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
            <button
              style={{
                width: '100%', padding: '12px',
                background: '#15803d', color: '#fff',
                border: 'none', borderRadius: 11,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#166534'}
              onMouseLeave={e => e.currentTarget.style.background = '#15803d'}
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 10 }}>
            No spam. Unsubscribe anytime.
          </p>

          {/* WhatsApp shortcut */}
          <a
            href="https://wa.me/919723089786"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginTop: 20, padding: '12px 14px',
              background: 'rgba(37,211,102,0.1)',
              border: '1px solid rgba(37,211,102,0.2)',
              borderRadius: 11, textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.18)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.2)'; }}
          >
            <div style={{ width: 32, height: 32, background: '#25d366', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {WA_SVG}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', marginBottom: 1 }}>Order on WhatsApp</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Quick, easy ordering</p>
            </div>
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '20px 32px',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
            © 2025 Dilkhush Kirana Store. Made with&nbsp;
            <Heart size={10} style={{ display: 'inline', color: '#ef4444', fill: '#ef4444', verticalAlign: 'middle' }} />
            &nbsp;in Dhasa, Gujarat.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {legal.map((l, i) => (
              <span key={l.path} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>·</span>}
                <button
                  onClick={() => go(l.path)}
                  style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '0 4px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
                >{l.name}</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:1100px){ .footer-main-grid{ grid-template-columns:1fr 1fr!important; gap:40px!important; } }
        @media(max-width:600px){  .footer-main-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </footer>
  );
}
