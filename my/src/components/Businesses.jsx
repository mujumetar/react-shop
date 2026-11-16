import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Wheat, Droplets, Factory, ShieldCheck, Truck,
  Leaf, Sprout, Package, Phone, Send, CheckCircle, Flame, Heart, Sparkles,
} from 'lucide-react';
import { SectionHead, Ornament, Lotus } from './Ornament';
import { MasalaArt, OilArt, FeedArt } from './Illustrations';
import whiteKachariyu from '../img/white.jpeg';
import blackKachariyu from '../img/black.jpeg';

/* ────────────────────────────────────────────────────────────
   Business data — edit text here; pages render from this list
──────────────────────────────────────────────────────────── */
export const ENQUIRY_NUMBER = '919033332365';
export const ENQUIRY_DISPLAY = '+91 90333 32365';

export const BUSINESSES = [
  {
    slug: 'kachariyu',
    name: 'Kachariyu',
    gu: 'કચરિયું',
    tagline: 'Our signature winter delicacy — black & white sesame kachariyu, made the traditional way.',
    intro:
      'Kachariyu is a Kathiyawadi winter favourite made by crushing roasted sesame with jaggery, dry fruits and warming spices. We have been making it by hand in Dhasa for over 25 years — rich, nourishing and full of the taste of home.',
    Icon: Heart,
    image: whiteKachariyu,
    gallery: [whiteKachariyu, blackKachariyu],
    bg: 'radial-gradient(120% 100% at 80% 20%, #8A1C1C 0%, #5E1412 45%, #24120C 100%)',
    products: [
      { name: 'White Kachariyu', desc: 'Made from white sesame with jaggery and dry fruits.' },
      { name: 'Black Kachariyu', desc: 'Made from black sesame — rich, earthy and nourishing.' },
      { name: 'Dry-fruit Special', desc: 'Loaded with almonds, cashews and pistachios.' },
      { name: 'Festive Gift Packs', desc: 'Beautifully packed for family and festivals.' },
      { name: 'Bulk Orders', desc: 'For weddings, events, sweet shops and retailers.' },
      { name: 'Fresh Seasonal Batches', desc: 'Made fresh through the winter season.' },
    ],
    features: [
      { Icon: Heart, title: 'Handmade', text: 'Crushed and mixed by hand, the old way.' },
      { Icon: Leaf, title: 'Pure Ingredients', text: 'Sesame, jaggery, dry fruits — nothing else.' },
      { Icon: ShieldCheck, title: 'No Preservatives', text: 'Fresh batches with honest ingredients.' },
      { Icon: Truck, title: 'Delivered Fresh', text: 'Packed with care and shipped quickly.' },
    ],
    steps: ['Roasting sesame', 'Crushing in the ghani', 'Mixing jaggery & spices', 'Adding dry fruits & packing'],
    options: ['White Kachariyu', 'Black Kachariyu', 'Dry-fruit Special', 'Gift Pack', 'Bulk Order'],
    qtyLabel: 'Quantity (kg)',
  },
  {
    slug: 'mari-masala',
    name: 'Mari Masala',
    gu: 'મરી મસાલા',
    tagline: 'Pure ground spices — red chilli, haldi, dhana and more, ground fresh for your kitchen.',
    intro:
      'Every Gujarati kitchen runs on good masala. We source whole spices, clean and sun-dry them, and grind them fresh — so you get true colour, aroma and taste, with no added colour or fillers.',
    Icon: Flame,
    Art: MasalaArt,
    bg: 'radial-gradient(120% 100% at 80% 20%, #5A3420 0%, #3A1F12 45%, #24120C 100%)',
    products: [
      { name: 'Red Chilli Powder (Lal Marchu)', desc: 'Kashmiri & tikhu varieties — bright colour, true heat.' },
      { name: 'Turmeric Powder (Haldi)', desc: 'Golden, aromatic haldi for daily cooking.' },
      { name: 'Coriander Powder (Dhana)', desc: 'Freshly ground dhana with natural fragrance.' },
      { name: 'Dhana-Jeeru Powder', desc: 'The classic Gujarati coriander-cumin blend.' },
      { name: 'Cumin (Jeeru) Powder', desc: 'Roasted and ground for deep flavour.' },
      { name: 'Garam Masala & Annual Masala', desc: 'Whole-year masala filling on order.' },
    ],
    features: [
      { Icon: Sparkles, title: 'Freshly Ground', text: 'Ground in small batches for aroma.' },
      { Icon: ShieldCheck, title: 'No Added Colour', text: 'Pure spice — no fillers, no dyes.' },
      { Icon: Leaf, title: 'Sun-dried Spices', text: 'Cleaned and dried the traditional way.' },
      { Icon: Package, title: 'Annual Masala', text: 'Bulk masala for the whole year.' },
    ],
    steps: ['Selecting whole spices', 'Cleaning & sun-drying', 'Fresh grinding', 'Sieving & packing'],
    options: ['Red Chilli Powder', 'Turmeric (Haldi) Powder', 'Coriander (Dhana) Powder', 'Dhana-Jeeru Powder', 'Cumin (Jeeru) Powder', 'Garam Masala', 'Annual Masala (Bulk)'],
    qtyLabel: 'Quantity (kg)',
  },
  {
    slug: 'cattle-feed',
    Art: FeedArt,
    artHasLabel: true,
    name: 'Cattle Feed Manufacturing',
    gu: 'પશુ આહાર',
    tagline: 'Nutritious, balanced feed for healthier cattle and better milk yield.',
    intro:
      'Alongside our kirana store, we manufacture cattle feed for dairy farmers and pashupalaks across the region. Our feed is prepared from carefully selected grains, oil cakes and minerals to give animals the balanced nutrition they need every day.',
    Icon: Wheat,
    bg: 'radial-gradient(120% 100% at 80% 20%, #3E6B3F 0%, #2E5E3A 40%, #1C3A24 100%)',
    accent: '#2E5E3A',
    products: [
      { name: 'Cattle Feed Pellets', desc: 'Balanced daily ration for cows and buffaloes.' },
      { name: 'Dairy Special Feed', desc: 'Formulated to support milk yield and fat.' },
      { name: 'Calf Starter Feed', desc: 'Gentle nutrition for young, growing calves.' },
      { name: 'Groundnut Oil Cake (Khol)', desc: 'Protein-rich cake from our own oil pressing.' },
      { name: 'Cotton Seed Cake', desc: 'Traditional energy and protein source.' },
      { name: 'Bulk & Dealer Supply', desc: 'Regular supply for dairies, gaushalas and dealers.' },
    ],
    features: [
      { Icon: Sprout, title: 'Quality Ingredients', text: 'Selected grains, oil cakes and minerals.' },
      { Icon: Factory, title: 'Own Manufacturing', text: 'Prepared under our own supervision.' },
      { Icon: ShieldCheck, title: 'Consistent Batches', text: 'Same trusted recipe, every bag.' },
      { Icon: Truck, title: 'Bulk Delivery', text: 'Supply to farms, dairies and dealers.' },
    ],
    steps: ['Sourcing grains & cakes', 'Cleaning & grinding', 'Mixing to formula', 'Pelleting & packing'],
    options: ['Cattle Feed Pellets', 'Dairy Special Feed', 'Calf Starter Feed', 'Groundnut Oil Cake (Khol)', 'Cotton Seed Cake', 'Dealership / Bulk'],
    qtyLabel: 'Quantity (bags / tonnes)',
  },
  {
    slug: 'groundnut-oil',
    Art: OilArt,
    artHasLabel: true,
    name: 'Groundnut Oil',
    gu: 'સીંગતેલ',
    tagline: 'Pure groundnut oil from Saurashtra peanuts — the taste of a Gujarati kitchen.',
    intro:
      'Groundnut oil is the heart of Kathiyawadi cooking. We press oil from quality Saurashtra groundnuts and supply it pure and unadulterated — for homes, restaurants, caterers and retailers.',
    Icon: Droplets,
    bg: 'radial-gradient(120% 100% at 80% 20%, #D9A23A 0%, #B07A14 40%, #6B4108 100%)',
    accent: '#A86F0E',
    products: [
      { name: 'Pure Groundnut Oil', desc: 'Everyday cooking oil with rich, natural aroma.' },
      { name: 'Filtered Groundnut Oil', desc: 'Clear, light oil for daily use and frying.' },
      { name: 'Household Packs', desc: 'Convenient packs for home kitchens.' },
      { name: 'Tins for Bulk Use', desc: 'For restaurants, caterers and farsan makers.' },
      { name: 'Retail & Dealer Supply', desc: 'Regular stock for shops and distributors.' },
      { name: 'Groundnut Oil Cake', desc: 'By-product cake used as nutritious cattle feed.' },
    ],
    features: [
      { Icon: Leaf, title: 'Saurashtra Groundnuts', text: 'Pressed from quality local peanuts.' },
      { Icon: ShieldCheck, title: '100% Pure', text: 'No blending, no adulteration.' },
      { Icon: Package, title: 'Multiple Pack Sizes', text: 'From home packs to bulk tins.' },
      { Icon: Truck, title: 'Wholesale Supply', text: 'Reliable delivery for businesses.' },
    ],
    steps: ['Selecting groundnuts', 'Cleaning & shelling', 'Pressing the oil', 'Filtering & packing'],
    options: ['1 Litre', '5 Litre', '15 kg Tin', 'Bulk / Wholesale', 'Dealership'],
    qtyLabel: 'Quantity',
  },
];

export const openWhatsApp = (text) => {
  window.open(`https://wa.me/${ENQUIRY_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
};

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── Artwork inside a jharokha arch: real photo or SVG illustration ── */
export const BizArt = ({ biz, height = 260 }) => (
  <div className="arch biz-art" style={{ height, background: biz.bg }}>
    {biz.image ? (
      <img src={biz.image} alt={biz.name} loading="lazy" />
    ) : biz.Art ? (
      <biz.Art />
    ) : (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F6E7C4' }}>
        <biz.Icon size={height * 0.3} strokeWidth={1.3} />
      </div>
    )}
    <div className="biz-art-shade" />
    {!biz.artHasLabel && <span className="biz-art-gu" lang="gu">{biz.gu}</span>}
  </div>
);

/* ════════════════════════════════
   Home section — speciality cards
════════════════════════════════ */
export const BusinessSection = () => {
  const navigate = useNavigate();
  return (
    <section className="dk-section bandhani" style={{ background: 'var(--paper)' }}>
      <div className="dk-wrap">
        <SectionHead
          eyebrow="Our Specialities"
          title={<>Made in Dhasa, <em>loved across Gujarat</em></>}
          sub="From our signature kachariyu to fresh-ground masala, pure groundnut oil and cattle feed — explore everything our family makes."
        />
        <div className="biz-grid">
          {BUSINESSES.map((biz, i) => (
            <article key={biz.slug} className="biz-card" onClick={() => navigate(`/business/${biz.slug}`)}>
              <div className="biz-card-art">
                <BizArt biz={biz} height={300} />
                <span className="biz-card-num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="biz-card-body">
                <h3 className="font-display">{biz.name}</h3>
                <p>{biz.tagline}</p>
                <div className="biz-card-tags">
                  {biz.products.slice(0, 3).map(p => <span key={p.name}>{p.name.replace(/\s*\(.*\)/, '')}</span>)}
                </div>
                <div className="biz-card-actions">
                  <button className="btn btn-primary" onClick={e => { e.stopPropagation(); navigate(`/business/${biz.slug}`); }}>
                    Explore <ArrowRight size={16} />
                  </button>
                  <button
                    className="btn btn-wa"
                    onClick={e => { e.stopPropagation(); openWhatsApp(`Hello Dilkhush, I would like to enquire about ${biz.name}.`); }}
                  >
                    {WA_ICON} Enquire
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════
   Dedicated detail page
════════════════════════════════ */
export const BusinessPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const biz = BUSINESSES.find(b => b.slug === slug);
  const [form, setForm] = useState({ name: '', phone: '', place: '', product: '', qty: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  if (!biz) return (
    <div className="dk-wrap" style={{ padding: '96px 16px', textAlign: 'center' }}>
      <h2 className="font-display" style={{ fontSize: 30, margin: '0 0 16px' }}>Business not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/businesses')}>See Our Businesses</button>
    </div>
  );

  const submit = e => {
    e.preventDefault();
    const lines = [
      `*New Enquiry — ${biz.name}*`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.place && `Village / City: ${form.place}`,
      form.product && `Interested in: ${form.product}`,
      form.qty && `${biz.qtyLabel}: ${form.qty}`,
      form.message && `Message: ${form.message}`,
    ].filter(Boolean);
    openWhatsApp(lines.join('\n'));
    setSent(true);
  };

  const others = BUSINESSES.filter(b => b.slug !== biz.slug);

  return (
    <>
      {/* Hero */}
      <section className="page-banner" style={{ background: biz.bg, textAlign: 'left', padding: '48px 0 64px' }}>
        <div className="bandhani-light" style={{ position: 'absolute', inset: 0 }} />
        <div className="dk-wrap biz-hero" style={{ position: 'relative' }}>
          <div>
            <button onClick={() => navigate(-1)} className="link-arrow" style={{ color: 'rgba(255,247,234,.8)', marginBottom: 18 }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div lang="gu" style={{ fontFamily: 'var(--gu)', color: '#F6E7C4', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{biz.gu}</div>
            <h1 style={{ marginBottom: 12 }}>{biz.name}</h1>
            <p style={{ margin: '0 0 26px', maxWidth: 520, fontSize: 18 }}>{biz.tagline}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="#enquiry" className="btn btn-gold btn-lg">Send Enquiry <ArrowRight size={16} /></a>
              <button className="btn btn-ghost-light btn-lg" onClick={() => openWhatsApp(`Hello Dilkhush, I would like to enquire about ${biz.name}.`)}>
                {WA_ICON} WhatsApp Us
              </button>
            </div>
          </div>
          <div className="biz-hero-art">
            <div className="biz-hero-ring" aria-hidden="true"><Lotus size={520} /></div>
            <div style={{ position: 'relative', border: '1px solid rgba(246,231,196,.45)', borderRadius: '999px 999px 18px 18px', padding: 10, background: 'rgba(36,18,12,.15)' }}>
              <BizArt biz={biz} height={380} />
            </div>
          </div>
        </div>
        <div className="scallop-bottom" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1 }} />
      </section>

      {/* About + products */}
      <section className="dk-section bandhani" style={{ background: 'var(--paper)' }}>
        <div className="dk-wrap">
          <div style={{ maxWidth: 760, margin: '0 auto 56px', textAlign: 'center' }}>
            <span className="dk-eyebrow">About this Business</span>
            <p style={{ fontSize: 'clamp(17px, 1.8vw, 20px)', color: 'var(--ink-2)', lineHeight: 1.8, margin: 0 }}>{biz.intro}</p>
            <Ornament className="mt-6" />
          </div>

          {biz.gallery && (
            <div className="biz-gallery">
              {biz.gallery.map((src, i) => (
                <figure key={src}>
                  <div className="arch-soft"><img src={src} alt={biz.products[i]?.name || biz.name} loading="lazy" /></div>
                  <figcaption className="font-display">{biz.products[i]?.name}</figcaption>
                </figure>
              ))}
            </div>
          )}

          <SectionHead eyebrow="What We Offer" title="Product Range" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {biz.products.map((p, i) => (
              <div key={p.name} className="t-card t-card-hover" style={{ padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span className="font-display" style={{ color: 'var(--haldi)', fontSize: 22, lineHeight: 1, minWidth: 28 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', margin: '0 0 4px' }}>{p.name}</h4>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us + process */}
      <section className="dk-section" style={{ background: 'var(--sand)' }}>
        <div className="dk-wrap">
          <SectionHead eyebrow="Why Choose Us" title="Made with the same family trust" />
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: 64 }}>
            {biz.features.map(f => (
              <div key={f.title} className="t-card" style={{ padding: '20px 14px', textAlign: 'center' }}>
                <span className="t-icon-circle" style={{ margin: '0 auto 14px', width: 56, height: 56 }}><f.Icon size={24} /></span>
                <h4 className="font-display" style={{ fontSize: 20, color: 'var(--ink)', margin: '0 0 6px' }}>{f.title}</h4>
                <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span className="dk-eyebrow">Our Process</span>
          </div>
          <div className="biz-steps">
            {biz.steps.map((s, i) => (
              <div key={s} className="biz-step">
                <span className="biz-step-num">{i + 1}</span>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="dk-section bandhani" style={{ background: 'var(--paper)', scrollMarginTop: 80 }}>
        <div className="dk-wrap">
          <div className="dk-contact-grid">
            <div>
              <span className="dk-eyebrow">Enquire Now</span>
              <h2 className="dk-heading" style={{ marginBottom: 14 }}>Get a quote on <em>WhatsApp</em></h2>
              <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.75, margin: '0 0 22px' }}>
                Fill in your details and your enquiry opens directly in WhatsApp, ready to send to our team. We'll reply with prices and availability.
              </p>
              <div className="dk-contact-card">
                <div className="t-icon-circle"><Phone size={19} /></div>
                <div>
                  <p className="dk-contact-label">Call or WhatsApp</p>
                  <a href={`tel:+${ENQUIRY_NUMBER}`} className="dk-contact-val" style={{ display: 'block' }}>{ENQUIRY_DISPLAY}</a>
                </div>
              </div>
              <button
                className="dk-wa-card"
                style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onClick={() => openWhatsApp(`Hello Dilkhush, I would like to enquire about ${biz.name}.`)}
              >
                <div className="dk-wa-icon">{WA_ICON}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Chat directly on WhatsApp</p>
                  <p style={{ fontSize: 14, opacity: .82, margin: 0 }}>Quick reply from our team</p>
                </div>
              </button>
            </div>

            <div className="t-card frame-inset dk-form">
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0', position: 'relative' }}>
                  <div className="t-icon-circle" style={{ width: 64, height: 64, margin: '0 auto 16px', background: 'var(--leaf-50)', color: 'var(--leaf)', borderColor: '#C9DCC2' }}>
                    <CheckCircle size={30} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: 26, margin: '0 0 6px' }}>WhatsApp opened</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 16, margin: '0 0 18px' }}>Just press send in WhatsApp to deliver your enquiry.</p>
                  <button className="link-arrow" onClick={() => setSent(false)}>Send another enquiry →</button>
                </div>
              ) : (
                <form onSubmit={submit} style={{ position: 'relative' }}>
                  <h3 className="font-display" style={{ fontSize: 26, color: 'var(--ink)', margin: '0 0 18px' }}>Enquiry Form</h3>
                  <div className="dk-form-row">
                    <div className="dk-form-group">
                      <label className="t-label">Full Name <span className="req">*</span></label>
                      <input className="t-input" required value={form.name} onChange={set('name')} placeholder="Your name" />
                    </div>
                    <div className="dk-form-group">
                      <label className="t-label">Phone <span className="req">*</span></label>
                      <input className="t-input" type="tel" required value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div className="dk-form-row">
                    <div className="dk-form-group">
                      <label className="t-label">Village / City</label>
                      <input className="t-input" value={form.place} onChange={set('place')} placeholder="e.g. Dhasa" />
                    </div>
                    <div className="dk-form-group">
                      <label className="t-label">{biz.qtyLabel}</label>
                      <input className="t-input" value={form.qty} onChange={set('qty')} placeholder="Approx. quantity" />
                    </div>
                  </div>
                  <div className="dk-form-group">
                    <label className="t-label">Interested In</label>
                    <select className="t-input" value={form.product} onChange={set('product')}>
                      <option value="">Select an option</option>
                      {biz.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="dk-form-group">
                    <label className="t-label">Message</label>
                    <textarea className="t-input" rows={3} value={form.message} onChange={set('message')} placeholder="Any details about your requirement…" />
                  </div>
                  <button type="submit" className="btn btn-lg btn-block" style={{ background: 'var(--leaf)', color: '#fff' }}>
                    {WA_ICON} Send Enquiry on WhatsApp <Send size={15} />
                  </button>
                  <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: '10px 0 0' }}>Opens WhatsApp to {ENQUIRY_DISPLAY}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="dk-section-sm" style={{ background: 'var(--sand)' }}>
        <div className="dk-wrap">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span className="dk-eyebrow">Also From Dilkhush</span>
            <h3 className="dk-heading" style={{ fontSize: 'clamp(26px, 3.4vw, 36px)' }}>Explore our other specialities</h3>
          </div>
          <div className="biz-mini-grid">
            {others.map(o => (
              <button key={o.slug} className="biz-mini" onClick={() => navigate(`/business/${o.slug}`)}>
                <BizArt biz={o} height={150} />
                <span className="biz-mini-name">{o.name}</span>
                <span className="link-arrow" style={{ fontSize: 13 }}>Explore <ArrowRight size={14} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
