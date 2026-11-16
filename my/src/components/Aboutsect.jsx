import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import shopimg from '../img/shop.png';
import { Ornament } from './Ornament';

const highlights = [
  'Pure, homemade saani & kachariyu — zero additives',
  'Sourced from trusted local suppliers in Dhasa',
  'Transparent pricing — no hidden charges ever',
  'Packed with care to ensure quality on arrival',
];

const stats = [
  { value: '25+', label: 'Years' },
  { value: '500+', label: 'Families' },
  { value: '100%', label: 'Natural' },
];

export default function Aboutsect() {
  const navigate = useNavigate();

  return (
    <section className="dk-section bandhani" style={{ background: 'var(--paper)' }}>
      <div className="dk-wrap">
        <div className="dk-about-grid">

          {/* Image — jharokha arch */}
          <div className="about-visual">
            <div className="about-arch-outline" />
            <div className="about-arch">
              <img src={shopimg} alt="Dilkhush Kirana Store, Dhasa" loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(36,18,12,0.35), transparent 45%)' }} />
              <div className="about-loc">
                <MapPin size={14} style={{ color: 'var(--maroon)' }} />
                Dhasa Junction, Gujarat
              </div>
            </div>
            <div className="about-seal">
              <strong>25+</strong>
              <span>Years of<br />Trust</span>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="dk-eyebrow">Our Story</span>
            <h2 className="dk-heading" style={{ marginBottom: 18 }}>
              Your trusted neighbourhood <em>kirana store</em> — now online
            </h2>
            <Ornament className="ornament-left" size={20} />
            <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.8, margin: '18px 0 22px' }}>
              Dilkhush started as a small corner store in Dhasa with a simple promise: offer the
              freshest products at honest prices. Today we bring that same trust directly to your
              home — with a hand-picked catalogue of pure homemade saani, kachariyu, spices, and
              daily essentials.
            </p>

            <ul className="dk-check-list">
              {highlights.map((h, i) => <li key={i}>{h}</li>)}
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
              <button className="btn btn-primary" onClick={() => navigate('/products')}>
                Browse Products <ArrowRight size={16} />
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/contact')}>
                Get in Touch
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
