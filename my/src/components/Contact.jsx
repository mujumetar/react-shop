import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { SectionHead } from './Ornament';

const WA_SVG = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const infoItems = [
  { icon: <MapPin size={19} />, label: 'Visit Us', content: <a href="https://maps.app.goo.gl/2yeV6Ern1uCUVyEV8" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--maroon)' }}>Dhasa Junction, Gujarat → Maps</a> },
  { icon: <Phone size={19} />, label: 'Call Us', content: <><a href="tel:+919723089786" style={{ display: 'block' }}>+91 97230 89786</a><a href="tel:+919033332365" style={{ display: 'block' }}>+91 90333 32365</a></> },
  { icon: <Mail size={19} />, label: 'Email Us', content: <a href="mailto:mustakmetar82@gmail.com" style={{ wordBreak: 'break-all' }}>mustakmetar82@gmail.com</a> },
  { icon: <Clock size={19} />, label: 'Hours', content: <><span style={{ display: 'block' }}>Mon – Fri: 9 AM – 6 PM</span><span style={{ display: 'block' }}>Sat – Sun: 9 AM – 2 PM</span></> },
];

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [status, setStatus] = useState('idle');
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, form);
      setStatus('done');
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch { setStatus('error'); }
  };

  return (
    <section className="dk-section bandhani" style={{ background: 'var(--paper)' }}>
      <div className="dk-wrap">

        <SectionHead
          eyebrow="Get in Touch"
          title="We'd love to hear from you"
          sub="Question, bulk order, or just saying hello? Drop us a message."
        />

        <div className="dk-contact-grid">

          {/* Left — info */}
          <div>
            {infoItems.map((item, i) => (
              <div key={i} className="dk-contact-card">
                <div className="t-icon-circle">{item.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <p className="dk-contact-label">{item.label}</p>
                  <div className="dk-contact-val">{item.content}</div>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/919723089786?text=Hello%20Dilkhush%2C%20I%20have%20a%20query"
              target="_blank" rel="noopener noreferrer"
              className="dk-wa-card"
            >
              <div className="dk-wa-icon">{WA_SVG}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Chat on WhatsApp</p>
                <p style={{ fontSize: 14, opacity: 0.82, margin: 0 }}>Fastest way to reach us — we reply quickly</p>
              </div>
            </a>
          </div>

          {/* Right — form */}
          <div className="t-card frame-inset dk-form" style={{ position: 'relative' }}>
            {status === 'done' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
                <div className="t-icon-circle" style={{ width: 64, height: 64, background: 'var(--leaf-50)', color: 'var(--leaf)', borderColor: '#C9DCC2', marginBottom: 16 }}>
                  <CheckCircle size={30} />
                </div>
                <h3 className="font-display" style={{ fontSize: 26, color: 'var(--ink)', margin: '0 0 6px' }}>Message Sent!</h3>
                <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 20 }}>We'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus('idle')} className="link-arrow">Send another →</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ position: 'relative' }}>
                <h3 className="font-display" style={{ fontSize: 26, color: 'var(--ink)', margin: '0 0 4px' }}>Send a message</h3>
                <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 22px' }}>We usually reply within a few hours.</p>
                <div className="dk-form-row">
                  <div className="dk-form-group">
                    <label className="t-label">Full Name <span className="req">*</span></label>
                    <input className="t-input" type="text" required value={form.name} onChange={set('name')} placeholder="Your name" />
                  </div>
                  <div className="dk-form-group">
                    <label className="t-label">Phone</label>
                    <input className="t-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                {[
                  { k:'email', label:'Email', type:'email', ph:'you@example.com', req:true },
                  { k:'subject', label:'Subject', type:'text', ph:"What's this about?", req:true },
                ].map(f => (
                  <div key={f.k} className="dk-form-group">
                    <label className="t-label">{f.label} {f.req && <span className="req">*</span>}</label>
                    <input className="t-input" type={f.type} required={f.req} value={form[f.k]} onChange={set(f.k)} placeholder={f.ph} />
                  </div>
                ))}
                <div className="dk-form-group">
                  <label className="t-label">Message <span className="req">*</span></label>
                  <textarea className="t-input" style={{ minHeight: 110 }} required rows={4} value={form.message} onChange={set('message')} placeholder="Write your message here…" />
                </div>
                {status === 'error' && <p style={{ color: 'var(--maroon)', fontSize: 14, marginBottom: 8 }}>Something went wrong. Please try WhatsApp instead.</p>}
                <button type="submit" disabled={status==='sending'} className="btn btn-primary btn-block btn-lg" style={{ marginTop: 6 }}>
                  {status === 'sending'
                    ? <><span className="dk-spinner" style={{ width: 18, height: 18, borderWidth: 2, margin: 0 }} /> Sending…</>
                    : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
