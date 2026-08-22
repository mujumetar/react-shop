import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import shopimg from '../img/shop.png';

const highlights = [
  'Pure, homemade saani & kachariyu — zero additives',
  'Sourced from trusted local suppliers in Dhasa',
  'Transparent pricing — no hidden charges ever',
  'Packed with care to ensure quality on arrival',
];

const stats = [
  { value: '25+', label: 'Years in Business' },
  { value: '500+', label: 'Happy Families' },
  { value: '100%', label: 'Natural' },
];

export default function Aboutsect() {
  const navigate = useNavigate();

  return (
    <section className="dk-section" style={{ background: '#f9fafb' }}>
      <div className="dk-wrap">
        <div className="dk-about-grid">

          {/* Image */}
          <div style={{ position: 'relative', paddingBottom: 24, paddingRight: 24 }}>
            <div className="dk-about-img-wrap">
              <img src={shopimg} alt="Dilkhush Kirana Store, Dhasa" loading="lazy" />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.18), transparent)',
              }} />
              <div className="dk-about-loc">
                <MapPin size={13} style={{ color: '#16a34a' }} />
                Dhasa Junction, Gujarat
              </div>
            </div>
            <div className="dk-about-badge" style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <strong>25+</strong>
              <span>Years of<br />Trust</span>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="dk-eyebrow dk-eyebrow-green">Our Story</span>
            <h2 className="dk-heading" style={{ marginTop: 14, marginBottom: 16 }}>
              Your trusted neighbourhood<br />
              <em style={{ fontStyle: 'normal', color: '#15803d' }}>kirana store</em> — now online
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 24 }}>
              Dilkhush started as a small corner store in Dhasa with a simple promise: offer the
              freshest products at honest prices. Today we bring that same trust directly to your
              home — with a hand-picked catalogue of pure homemade saani, kachariyu, spices, and
              daily essentials.
            </p>

            <ul className="dk-check-list">
              {highlights.map((h, i) => (
                <li key={i}>
                  <span className="dk-check-icon">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="dk-stats-row">
              {stats.map((s, i) => (
                <div key={i} className="dk-stat-cell">
                  <div className="dk-stat-val">{s.value}</div>
                  <div className="dk-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button className="dk-btn-primary" onClick={() => navigate('/products')}>
                Browse Products <ArrowRight size={15} />
              </button>
              <button className="dk-btn-outline" onClick={() => navigate('/contact')}>
                Get in Touch
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
