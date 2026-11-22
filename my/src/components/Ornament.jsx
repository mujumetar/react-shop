// Shared traditional ornaments — purely decorative
export const Lotus = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {[0, 45, 90, 135, 180, 225, 270, 315].map(r => (
      <ellipse key={r} cx="16" cy="8.5" rx="3.2" ry="6.5" transform={`rotate(${r} 16 16)`}
        stroke={color} strokeWidth="1.1" fill={r % 90 === 0 ? color : 'none'} fillOpacity=".18" />
    ))}
    <circle cx="16" cy="16" r="3" fill={color} />
  </svg>
);

export const Ornament = ({ className = '', size = 22 }) => (
  <div className={`ornament ${className}`}><Lotus size={size} /></div>
);

export const SectionHead = ({ eyebrow, title, sub, align = 'center', children }) => (
  <div className={`dk-head${align === 'left' ? ' dk-head-left' : ''}`}>
    {eyebrow && <span className="dk-eyebrow">{eyebrow}</span>}
    <h2 className="dk-heading">{title}</h2>
    {sub && <p className="dk-subheading" style={align === 'left' ? { marginLeft: 0 } : undefined}>{sub}</p>}
    {align !== 'left' && <Ornament />}
    {children}
  </div>
);

export const PageBanner = ({ title, sub, crumb = 'Dilkhush Kirana' }) => (
  <section className="page-banner">
    <div className="garland" aria-hidden="true" />
    <div className="bandhani-light" style={{ position: 'absolute', inset: 0 }} />
    <div className="dk-wrap" style={{ position: 'relative' }}>
      <div className="crumb"><span className="diamond" />{crumb}<span className="diamond" /></div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
    <div className="scallop-bottom" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1 }} />
  </section>
);
