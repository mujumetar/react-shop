import { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'Why choose Dilkhush over other stores?',
    a: "We've been serving Dhasa for 25+ years with 100% homemade, pure-ingredient products. Every item is made fresh in-house — no preservatives, no shortcuts. You're getting the same quality your grandparents trusted.",
  },
  {
    q: 'What products do you sell?',
    a: 'Our speciality is homemade Saani (black & white), Kachariyu, and a range of pure spices made fresh in Dhasa. We also carry daily grocery essentials. All products are listed on our Products page.',
  },
  {
    q: 'What are the benefits of buying Kachariyu from us?',
    a: "Our Kachariyu is made using traditional recipes with zero artificial additives. It's packed fresh, rich in natural nutrients, and has a shelf life that beats most mass-produced alternatives.",
  },
  {
    q: 'Is it safe for everyone including children?',
    a: 'Yes. Because we use only pure, natural ingredients with no preservatives or artificial colouring, our products are suitable for the whole family — including children and elderly members.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders placed before 6 PM are dispatched the same day and typically arrive within 24 hours for nearby areas. You can track your order in real time from the Track Order page.',
  },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Qna() {
  const [open, setOpen] = useState(null);

  return (
    <section className="dk-section" style={{ background: '#fff' }}>
      <div className="dk-wrap" style={{ maxWidth: 800, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="dk-eyebrow dk-eyebrow-green">FAQ</span>
          <h2 className="dk-heading" style={{ marginTop: 14 }}>Everything you need to know</h2>
          <p className="dk-subheading" style={{ maxWidth: 440, margin: '12px auto 0' }}>
            Can't find an answer? Reach us on WhatsApp — we reply within minutes.
          </p>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className={`dk-faq-item${open === i ? ' open' : ''}`}>
              <button
                className="dk-faq-btn"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="dk-faq-q">{faq.q}</span>
                <span className="dk-faq-icon">
                  <Plus size={14} />
                </span>
              </button>
              {open === i && (
                <div className="dk-faq-body">{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 14 }}>Still have questions?</p>
          <a
            href="https://wa.me/919723089786?text=Hello%20Dilkhush%2C%20I%20have%20a%20question"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#16a34a', color: '#fff',
              fontSize: 14, fontWeight: 700,
              padding: '13px 26px', borderRadius: 12,
              transition: 'background 0.2s, transform 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'none'; }}
          >
            {WA_ICON} Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
