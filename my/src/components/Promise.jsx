import { HandHeart, Leaf, Truck, ShieldCheck } from 'lucide-react';
import { SectionHead, Lotus } from './Ornament';

const items = [
  { Icon: HandHeart, title: 'Made by Hand', text: 'Family recipes, prepared in small batches in Dhasa.' },
  { Icon: Leaf, title: '100% Pure', text: 'No preservatives, no added colour, no shortcuts.' },
  { Icon: ShieldCheck, title: 'Trusted Since 1999', text: '25+ years of serving families across Saurashtra.' },
  { Icon: Truck, title: 'Fresh to Your Door', text: 'Packed with care and delivered quickly.' },
];

const stats = [
  { value: '500+', label: 'Happy Families' },
  { value: '25+', label: 'Years of Trust' },
  { value: '100%', label: 'Natural' },
];

export default function PromiseBand() {
  return (
    <section className="promise">
      <div className="bandhani-light" style={{ position: 'absolute', inset: 0, opacity: .6 }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: -160, top: -160, color: 'rgba(201,138,27,.08)' }}><Lotus size={460} /></div>
      <div aria-hidden="true" style={{ position: 'absolute', right: -180, bottom: -200, color: 'rgba(201,138,27,.08)' }}><Lotus size={520} /></div>
      <div className="dk-wrap" style={{ position: 'relative' }}>
        <SectionHead
          eyebrow="The Dilkhush Promise"
          title={<>Tradition you can <em>taste</em></>}
          sub="What our family has stood for, every single day, for more than 25 years."
        />
        <div className="promise-grid">
          {items.map(({ Icon, title, text }) => (
            <div key={title} className="promise-item">
              <div className="promise-icon"><Icon size={26} strokeWidth={1.7} /></div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="promise-stats">
          {stats.map(s => (
            <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
