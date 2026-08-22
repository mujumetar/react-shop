import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

const WA_SVG = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const infoItems = [
  { icon: <MapPin size={18} />, bg: '#dcfce7', color: '#15803d', label: 'Visit Us', content: <a href="https://maps.app.goo.gl/2yeV6Ern1uCUVyEV8" target="_blank" rel="noopener noreferrer" style={{ color:'#15803d', fontWeight:600 }}>Dhasa Junction, Gujarat → Maps</a> },
  { icon: <Phone size={18} />, bg: '#dbeafe', color: '#1e40af', label: 'Call Us', content: <><a href="tel:+919723089786" style={{ display:'block', color:'#111', fontWeight:600 }}>+91 97230 89786</a><a href="tel:+919033332365" style={{ display:'block', color:'#111', fontWeight:600 }}>+91 90333 32365</a></> },
  { icon: <Mail size={18} />, bg: '#f3e8ff', color: '#7e22ce', label: 'Email Us', content: <a href="mailto:mustakmetar82@gmail.com" style={{ color:'#7e22ce', fontWeight:600, wordBreak:'break-all' }}>mustakmetar82@gmail.com</a> },
  { icon: <Clock size={18} />, bg: '#fef9c3', color: '#854d0e', label: 'Hours', content: <><span style={{ display:'block', color:'#111', fontWeight:600 }}>Mon – Fri: 9 AM – 6 PM</span><span style={{ display:'block', color:'#111', fontWeight:600 }}>Sat – Sun: 9 AM – 2 PM</span></> },
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

  const inputStyle = {
    width:'100%', padding:'12px 16px',
    background:'#fff', border:'1.5px solid #e5e7eb',
    borderRadius:11, fontSize:14,
    fontFamily:'inherit', color:'#111',
    outline:'none', boxSizing:'border-box',
    transition:'border-color .2s',
  };
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#6b7280', marginBottom:7 };

  return (
    <section style={{ padding:'88px 0', background:'#f9fafb' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#dcfce7', color:'#15803d', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', padding:'5px 13px', borderRadius:100, marginBottom:14 }}>
            Get in Touch
          </span>
          <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:'clamp(28px,3.8vw,44px)', color:'#0f0f0f', lineHeight:1.15, marginBottom:12 }}>
            We'd love to hear from you
          </h2>
          <p style={{ color:'#9ca3af', fontSize:15, maxWidth:420, margin:'0 auto' }}>
            Question, bulk order, or just saying hello? Drop us a message.
          </p>
        </div>

        {/* Two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'start' }}>

          {/* Left — info */}
          <div>
            {infoItems.map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:16, background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:16, padding:'18px 22px', marginBottom:12, transition:'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='#bbf7d0'}
                onMouseLeave={e => e.currentTarget.style.borderColor='#f0f0f0'}
              >
                <div style={{ width:44, height:44, borderRadius:12, background:item.bg, color:item.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9ca3af', marginBottom:5 }}>{item.label}</p>
                  <div style={{ fontSize:14, lineHeight:1.65 }}>{item.content}</div>
                </div>
              </div>
            ))}

            {/* WhatsApp card */}
            <a
              href="https://wa.me/919723089786?text=Hello%20Dilkhush%2C%20I%20have%20a%20query"
              target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:14, background:'#16a34a', color:'#fff', borderRadius:16, padding:'18px 22px', textDecoration:'none', marginTop:20, transition:'background .2s,transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#15803d'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#16a34a'; e.currentTarget.style.transform='none'; }}
            >
              <div style={{ width:44, height:44, background:'rgba(255,255,255,0.18)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {WA_SVG}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>Chat on WhatsApp</p>
                <p style={{ fontSize:12, opacity:0.8 }}>Fastest way to reach us — we reply quickly</p>
              </div>
            </a>
          </div>

          {/* Right — form */}
          <div style={{ background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:20, padding:36 }}>
            {status === 'done' ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 0', textAlign:'center' }}>
                <div style={{ width:56, height:56, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                  <CheckCircle size={28} style={{ color:'#15803d' }} />
                </div>
                <h3 style={{ fontWeight:700, fontSize:18, color:'#111', marginBottom:8 }}>Message Sent!</h3>
                <p style={{ color:'#9ca3af', fontSize:14, marginBottom:20 }}>We'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus('idle')} style={{ fontSize:13, fontWeight:700, color:'#15803d', background:'none', border:'none', cursor:'pointer' }}>
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={labelStyle}>Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                    <input style={inputStyle} type="text" required value={form.name} onChange={set('name')} placeholder="Your name"
                      onFocus={e => e.target.style.borderColor='#4ade80'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX"
                      onFocus={e => e.target.style.borderColor='#4ade80'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  </div>
                </div>
                {[
                  { k:'email', label:'Email *', type:'email', ph:'you@example.com', req:true },
                  { k:'subject', label:'Subject *', type:'text', ph:"What's this about?", req:true },
                ].map(f => (
                  <div key={f.k} style={{ marginBottom:16 }}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={inputStyle} type={f.type} required={f.req} value={form[f.k]} onChange={set(f.k)} placeholder={f.ph}
                      onFocus={e => e.target.style.borderColor='#4ade80'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  </div>
                ))}
                <div style={{ marginBottom:8 }}>
                  <label style={labelStyle}>Message <span style={{ color:'#ef4444' }}>*</span></label>
                  <textarea style={{ ...inputStyle, resize:'vertical', minHeight:100 }} required rows={4} value={form.message} onChange={set('message')} placeholder="Write your message here…"
                    onFocus={e => e.target.style.borderColor='#4ade80'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                </div>
                {status === 'error' && <p style={{ color:'#dc2626', fontSize:12, marginBottom:8 }}>Something went wrong. Please try WhatsApp instead.</p>}
                <button type="submit" disabled={status==='sending'} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#15803d', color:'#fff', fontSize:15, fontWeight:700, padding:15, borderRadius:12, border:'none', cursor:'pointer', marginTop:16, opacity: status==='sending' ? 0.7 : 1, transition:'background .2s' }}
                  onMouseEnter={e => { if(status!=='sending') e.currentTarget.style.background='#166534'; }}
                  onMouseLeave={e => e.currentTarget.style.background='#15803d'}
                >
                  {status === 'sending'
                    ? <><div style={{ width:18, height:18, border:'2.5px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'dk-spin .7s linear infinite' }} /> Sending…</>
                    : <><Send size={15} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>

        <style>{`@media(max-width:900px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </section>
  );
}
