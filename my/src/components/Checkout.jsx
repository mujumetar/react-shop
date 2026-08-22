import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Lock, ChevronRight, ShoppingBag,
  Truck, Tag, CheckCircle, MapPin, User, Mail, Phone
} from 'lucide-react';
import logo from '../assets/logo2.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/* ─── tiny helpers ─── */
const F = ({ children }) => <>{children}</>;

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.09em',
      color: '#6b7280', marginBottom: 7,
    }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const baseInput = {
  width: '100%', padding: '13px 16px',
  border: '1.5px solid #e5e7eb', borderRadius: 12,
  fontSize: 14, fontFamily: "'Inter',system-ui,sans-serif",
  color: '#111', background: '#fff', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color .18s, box-shadow .18s',
};

const focusInput  = e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)'; };
const blurInput   = e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; };

/* ─── Step pill ─── */
const Step = ({ num, label, active, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      background: done ? '#16a34a' : active ? '#111' : '#f0f0f0',
      color: done || active ? '#fff' : '#9ca3af',
      fontSize: 12, fontWeight: 800,
      transition: 'all .25s',
    }}>
      {done ? <CheckCircle size={14} /> : num}
    </div>
    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#111' : done ? '#16a34a' : '#9ca3af' }}>
      {label}
    </span>
  </div>
);

/* ─── Main Component ─── */
export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart     = location.state?.cart || [];

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 50;
  const [discount, setDiscount] = useState(0);
  const total    = subtotal + shipping - discount;

  const [loading, setLoading] = useState(false);
  const [coupon,  setCoupon]  = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null | 'ok' | 'err'
  const [couponMsg, setCouponMsg]       = useState('');

  const [form, setForm] = useState({
    customerName: '', customerEmail: '',
    customerPhone: '', customerAddress: '',
  });

  useEffect(() => { if (!cart.length) navigate('/cart'); }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  /* Apply coupon */
  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res  = await fetch(`${API_URL}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, totalAmount: subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.discount) {
        setDiscount(data.discount);
        setCouponStatus('ok');
        setCouponMsg(`Saved ₹${data.discount}!`);
      } else {
        setCouponStatus('err');
        setCouponMsg(data.error || 'Invalid coupon');
      }
    } catch {
      setCouponStatus('err');
      setCouponMsg('Could not apply coupon');
    }
  };

  /* Place order */
  const placeOrder = async e => {
    e.preventDefault();
    if (!cart.length) return;
    setLoading(true);
    try {
      const orderRes  = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          products: cart.map(i => ({ productId: i.productId || i._id, quantity: i.quantity })),
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      const mongoOrderId = orderData.orderId;

      const rzpRes  = await fetch(`${API_URL}/orders/${mongoOrderId}/razorpay/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error('Failed to create Razorpay order');

      const rzp = new window.Razorpay({
        key: 'rzp_live_Re1i7zytUrHedP',
        order_id: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Dilkhush Kirana',
        description: 'Fresh from Dhasa, Gujarat',
        prefill: { name: form.customerName, email: form.customerEmail, contact: form.customerPhone },
        theme: { color: '#16a34a' },
        handler: async res => {
          const verify = await fetch(`${API_URL}/orders/${mongoOrderId}/razorpay/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            }),
          });
          verify.ok ? navigate('/success') : navigate('/cancel');
        },
      });
      rzp.on('payment.failed', () => navigate('/cancel'));
      rzp.open();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── RENDER ─── */
  return (
    <>
      <style>{`
        @keyframes spin-co{to{transform:rotate(360deg)}}
        .co-page{display:flex;min-height:100vh;font-family:'Inter',system-ui,sans-serif;background:#fff;}
        .co-left{flex:0 0 56%;background:#fff;padding:52px 72px 72px;display:flex;justify-content:flex-end;}
        .co-right{flex:0 0 44%;background:#f8f8f6;border-left:1.5px solid #ebebeb;padding:52px 64px 72px;display:flex;justify-content:flex-start;}
        .co-left-inner{width:100%;max-width:500px;}
        .co-right-inner{width:100%;max-width:420px;position:sticky;top:88px;height:fit-content;}
        @media(max-width:920px){
          .co-page{flex-direction:column;}
          .co-left{flex:none;padding:32px 24px;}
          .co-right{flex:none;padding:32px 24px;border-left:none;border-top:1.5px solid #ebebeb;}
          .co-left-inner,.co-right-inner{max-width:100%;position:static;}
        }
        .co-input:focus{border-color:#16a34a!important;box-shadow:0 0 0 3px rgba(22,163,74,0.12)!important;}
        .co-pay-btn:hover:not(:disabled){background:#166534!important;transform:translateY(-1px)!important;box-shadow:0 8px 28px rgba(22,163,74,0.4)!important;}
        .co-section-divider{display:flex;align-items:center;gap:12px;margin:28px 0 22px;}
        .co-section-divider::before,.co-section-divider::after{content:'';flex:1;height:1px;background:#ebebeb;}
        .co-section-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.14em;color:#b0b0b0;white-space:nowrap;}
      `}</style>

      <div className="co-page">

        {/* ════════════════════════════════════
            LEFT — checkout form
        ════════════════════════════════════ */}
        <div className="co-left">
          <div className="co-left-inner">

            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              style={{ display:'flex', alignItems:'flex-end', gap:4, background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:40 }}
            >
              <img src={logo} alt="Dilkhush" style={{ height:38, width:'auto', borderRadius:8, objectFit:'contain' }} />
              <span style={{ fontFamily:'Pacifico,cursive', fontSize:10, fontWeight:700, color:'#bbb', marginBottom:2 }}>.Shop</span>
            </button>

            {/* Steps */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:44 }}>
              <Step num={1} label="Cart" done />
              <div style={{ flex:1, height:1, background:'#e5e7eb' }} />
              <Step num={2} label="Details" active />
              <div style={{ flex:1, height:1, background:'#e5e7eb' }} />
              <Step num={3} label="Payment" />
            </div>

            {/* Title */}
            <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:32, fontWeight:700, color:'#0f0f0f', marginBottom:6, lineHeight:1.15 }}>
              Shipping &amp; Payment
            </h1>
            <p style={{ fontSize:14, color:'#9ca3af', marginBottom:40 }}>
              All fields marked <span style={{ color:'#ef4444' }}>*</span> are required.
            </p>

            <form onSubmit={placeOrder}>

              {/* ── Contact ── */}
              <div className="co-section-divider"><span className="co-section-label">Contact Information</span></div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <Field label="Email" required>
                  <div style={{ position:'relative' }}>
                    <Mail size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
                    <input className="co-input" style={{ ...baseInput, paddingLeft:38 }} type="email" required
                      value={form.customerEmail} onChange={set('customerEmail')} placeholder="you@example.com" />
                  </div>
                </Field>
                <Field label="Phone" required>
                  <div style={{ position:'relative' }}>
                    <Phone size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
                    <input className="co-input" style={{ ...baseInput, paddingLeft:38 }} type="tel" required
                      value={form.customerPhone} onChange={set('customerPhone')} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </Field>
              </div>

              {/* ── Shipping ── */}
              <div className="co-section-divider"><span className="co-section-label">Shipping Address</span></div>

              <Field label="Full Name" required>
                <div style={{ position:'relative' }}>
                  <User size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
                  <input className="co-input" style={{ ...baseInput, paddingLeft:38 }} type="text" required
                    value={form.customerName} onChange={set('customerName')} placeholder="Your full name" />
                </div>
              </Field>

              <Field label="Full Address" required>
                <div style={{ position:'relative' }}>
                  <MapPin size={15} style={{ position:'absolute', left:13, top:14, color:'#9ca3af' }} />
                  <textarea className="co-input" style={{ ...baseInput, paddingLeft:38, resize:'vertical', minHeight:88 }}
                    required rows={3}
                    value={form.customerAddress} onChange={set('customerAddress')}
                    placeholder="House No, Street, Area, City, State — PIN" />
                </div>
              </Field>

              {/* ── Delivery notice ── */}
              <div style={{
                display:'flex', alignItems:'center', gap:10,
                background: shipping === 0 ? '#f0fdf4' : '#fff8f0',
                border: `1px solid ${shipping === 0 ? '#bbf7d0' : '#fed7aa'}`,
                borderRadius:12, padding:'12px 16px', marginBottom:28,
              }}>
                <Truck size={16} style={{ color: shipping === 0 ? '#16a34a' : '#d97706', flexShrink:0 }} />
                <p style={{ fontSize:13, fontWeight:500, color: shipping === 0 ? '#15803d' : '#92400e' }}>
                  {shipping === 0
                    ? '🎉 You\'ve unlocked free delivery!'
                    : <>Add <strong>₹{1000 - subtotal}</strong> more for free delivery. Current shipping: ₹{shipping}</>}
                </p>
              </div>

              {/* ── Pay button ── */}
              <button
                type="submit"
                disabled={loading}
                className="co-pay-btn"
                style={{
                  width:'100%',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  background: loading ? '#86efac' : '#15803d',
                  color:'#fff', fontSize:16, fontWeight:800,
                  padding:'17px', borderRadius:14, border:'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition:'background .2s,transform .2s,box-shadow .2s',
                  boxShadow:'0 4px 20px rgba(21,128,61,0.28)',
                  letterSpacing:'-0.01em',
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width:20, height:20, border:'2.5px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin-co .7s linear infinite' }} />
                    Processing payment…
                  </>
                ) : (
                  <>
                    <Lock size={17} />
                    Pay ₹{total.toLocaleString()} securely
                  </>
                )}
              </button>

              {/* Security row */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:14 }}>
                <ShieldCheck size={14} style={{ color:'#16a34a' }} />
                <span style={{ fontSize:12, color:'#9ca3af' }}>256-bit SSL · Secured by Razorpay</span>
              </div>

              {/* Accepted payment methods */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:18, flexWrap:'wrap' }}>
                {['UPI', 'Cards', 'NetBanking', 'Wallets', 'EMI'].map(m => (
                  <span key={m} style={{ fontSize:10, fontWeight:700, padding:'4px 9px', background:'#f4f4f5', borderRadius:6, color:'#6b7280', letterSpacing:'0.04em' }}>{m}</span>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* ════════════════════════════════════
            RIGHT — order summary
        ════════════════════════════════════ */}
        <div className="co-right">
          <div className="co-right-inner">

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <h3 style={{ fontSize:16, fontWeight:800, color:'#111', display:'flex', alignItems:'center', gap:8 }}>
                <ShoppingBag size={17} style={{ color:'#16a34a' }} />
                Order Summary
              </h3>
              <span style={{ fontSize:12, color:'#9ca3af', fontWeight:500 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Item list */}
            <div style={{ marginBottom:24 }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #f0f0f0' }}>
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:60, height:60, background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                        : <ShoppingBag size={18} style={{ color:'#d1d5db' }} />
                      }
                    </div>
                    <span style={{
                      position:'absolute', top:-6, right:-6,
                      width:19, height:19,
                      background:'#16a34a', color:'#fff',
                      fontSize:10, fontWeight:800, borderRadius:'50%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:'2px solid #f8f8f6',
                    }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#111', lineHeight:1.35, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize:12, color:'#9ca3af' }}>₹{item.price} × {item.quantity} kg</p>
                  </div>
                  <span style={{ fontSize:14, fontWeight:800, color:'#111', flexShrink:0 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ marginBottom:24 }}>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ flex:1, position:'relative' }}>
                  <Tag size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponStatus(null); setCouponMsg(''); }}
                    style={{ ...baseInput, paddingLeft:34, fontSize:13 }}
                    onFocus={focusInput} onBlur={blurInput}
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCoupon}
                  style={{ padding:'0 18px', background: couponStatus === 'ok' ? '#16a34a' : '#111', color:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', flexShrink:0, transition:'background .2s' }}
                  onMouseEnter={e => { if(couponStatus !== 'ok') e.currentTarget.style.background='#374151'; }}
                  onMouseLeave={e => { if(couponStatus !== 'ok') e.currentTarget.style.background='#111'; }}
                >
                  {couponStatus === 'ok' ? <CheckCircle size={15} /> : 'Apply'}
                </button>
              </div>
              {couponMsg && (
                <p style={{ fontSize:12, marginTop:6, fontWeight:600, color: couponStatus === 'ok' ? '#16a34a' : '#ef4444' }}>
                  {couponStatus === 'ok' ? '✓ ' : '✕ '}{couponMsg}
                </p>
              )}
            </div>

            {/* Totals */}
            <div style={{ background:'#fff', border:'1.5px solid #ebebeb', borderRadius:16, padding:20 }}>
              {[
                { label:'Subtotal', val:`₹${subtotal.toLocaleString()}` },
                { label:'Shipping', val: shipping === 0 ? 'FREE' : `₹${shipping}`, green: shipping === 0 },
                ...(discount > 0 ? [{ label:'Discount', val:`–₹${discount}`, green:true }] : []),
              ].map((r, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <span style={{ fontSize:14, color:'#6b7280' }}>{r.label}</span>
                  <span style={{ fontSize:14, fontWeight:600, color: r.green ? '#16a34a' : '#111' }}>{r.val}</span>
                </div>
              ))}

              <div style={{ height:1, background:'#ebebeb', margin:'8px 0 16px' }} />

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:16, fontWeight:800, color:'#111' }}>Total</span>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:26, fontWeight:900, color:'#0f0f0f', lineHeight:1 }}>
                    ₹{total.toLocaleString()}
                  </div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>Incl. all taxes</div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { icon:<ShieldCheck size={14}/>, text:'Secure checkout' },
                { icon:<Truck size={14}/>, text:'Fast delivery' },
                { icon:<CheckCircle size={14}/>, text:'Easy returns' },
                { icon:<Lock size={14}/>, text:'100% safe' },
              ].map((b, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:7, background:'#fff', border:'1px solid #ebebeb', borderRadius:10, padding:'9px 12px' }}>
                  <span style={{ color:'#16a34a' }}>{b.icon}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:'#6b7280' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
