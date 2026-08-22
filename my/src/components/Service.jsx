import { Truck, ShieldCheck, BadgePercent, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: <Truck size={22} />,
    bg: '#dcfce7', color: '#15803d',
    title: '24-Hour Delivery',
    desc: 'Order before 6 PM and get your groceries delivered to your door by the next day — any day of the week.',
  },
  {
    icon: <ShieldCheck size={22} />,
    bg: '#dbeafe', color: '#1e40af',
    title: 'Freshness Guaranteed',
    desc: 'Every product is checked before dispatch. Not happy? We replace or refund — no questions asked.',
  },
  {
    icon: <BadgePercent size={22} />,
    bg: '#fef9c3', color: '#854d0e',
    title: 'Honest Prices',
    desc: 'We price every product fairly and transparently. No hidden charges — ever.',
  },
  {
    icon: <HeartHandshake size={22} />,
    bg: '#fee2e2', color: '#991b1b',
    title: 'Trusted Since 1999',
    desc: '25+ years of community trust. Pure homemade products made exactly the way your grandparents loved.',
  },
];

export default function Service() {
  return (
    <section className="dk-section-sm" style={{ background: '#fff' }}>
      <div className="dk-wrap">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="dk-eyebrow dk-eyebrow-green">Why Choose Us</span>
          <h2 className="dk-heading">Built around your convenience</h2>
          <p className="dk-subheading" style={{ maxWidth: 520, margin: '12px auto 0' }}>
            From the fields of Gujarat straight to your kitchen — fresh, reliable, and always honest.
          </p>
        </div>

        <div className="dk-features-grid">
          {features.map((f, i) => (
            <div key={i} className="dk-feature-cell">
              <div className="dk-feature-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <div className="dk-feature-title">{f.title}</div>
              <p className="dk-feature-text">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
