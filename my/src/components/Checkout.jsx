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
    <label className="t-label">
      {label}{required && <span className="req">*</span>}
    </label>
    {children}
  </div>
);

/* ─── Step pill ─── */
const Step = ({ num, label, active, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 30, height: 30, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      background: done ? 'var(--leaf)' : active ? 'var(--maroon)' : 'var(--sand)',
      color: done || active ? '#FFF7EA' : 'var(--muted)',
      border: done || active ? 'none' : '1px solid var(--line-2)',
      boxShadow: active ? '0 0 0 4px var(--haldi-50)' : 'none',
      fontSize: 13, fontWeight: 800,
      transition: 'all .25s',
    }}>
      {done ? <CheckCircle size={15} /> : num}
    </div>
    <span className="co-step-label" style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--ink)' : done ? 'var(--leaf)' : 'var(--muted)' }}>
      {label}
    </span>
  </div>
);

/* ─── Main Component ─── */
/* ─── Main Component ─── */
export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 50;
  const [discount, setDiscount] = useState(0);
  const total = subtotal + shipping - discount;

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null | 'ok' | 'err'
  const [couponMsg, setCouponMsg] = useState('');

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
      const res = await fetch(`${API_URL}/coupons/apply`, {
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
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          shippingAddress: form.customerAddress, // Map to backend requirement
          products: cart.map(i => ({ productId: i.productId || i._id, quantity: i.quantity })),
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      const mongoOrderId = orderData.orderId;

      const rzpRes = await fetch(`${API_URL}/orders/${mongoOrderId}/razorpay/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error('Failed to create Razorpay order');

      const rzp = new window.Razorpay({
        key: 'rzp_live_TgK2N78f0AOXB0',
        order_id: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Dilkhush Kirana',
        description: 'Fresh from Dhasa, Gujarat',
        prefill: { name: form.customerName, email: form.customerEmail, contact: form.customerPhone },
        theme: { color: '#8A1C1C' },
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
        .co-page{display:flex;min-height:100vh;background:var(--paper);}
        .co-left{flex:0 0 56%;padding:52px 64px 80px;display:flex;justify-content:flex-end;}
        .co-right{flex:0 0 44%;background:var(--sand);border-left:1px solid var(--line);padding:52px 56px 80px;display:flex;justify-content:flex-start;}
        .co-left-inner{width:100%;max-width:520px;}
        .co-right-inner{width:100%;max-width:420px;position:sticky;top:100px;height:fit-content;}
        .co-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        @media(max-width:920px){
          .co-page{flex-direction:column;}
          .co-left{flex:none;padding:32px 16px;}
          .co-right{flex:none;padding:32px 16px 56px;border-left:none;border-top:1px solid var(--line);}
          .co-left-inner,.co-right-inner{max-width:100%;position:static;}
        }
        @media(max-width:560px){ .co-grid-2{grid-template-columns:1fr;gap:0;} }
        @media(max-width:380px){ .co-step-label{font-size:12px!important;} }
        .co-section-divider{display:flex;align-items:center;gap:12px;margin:28px 0 20px;}
        .co-section-divider::before,.co-section-divider::after{content:'';flex:1;height:1px;background:var(--line-2);}
        .co-section-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:var(--maroon);white-space:nowrap;display:inline-flex;align-items:center;gap:8px;}
        .co-section-label::before,.co-section-label::after{content:'';width:5px;height:5px;background:var(--haldi);transform:rotate(45deg);}
      `}</style>

      <div className="co-page bandhani">

        {/* LEFT — checkout form */}
        <div className="co-left">
          <div className="co-left-inner">

            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
              <Step num={1} label="Cart" done />
              <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }} />
              <Step num={2} label="Details" active />
              <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }} />
              <Step num={3} label="Payment" />
            </div>

            {/* Title */}
            <span className="dk-eyebrow">Secure Checkout</span>
            <h1 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 40px)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.12 }}>
              Shipping &amp; Payment
            </h1>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 24 }}>
              All fields marked <span style={{ color: 'var(--maroon)' }}>*</span> are required.
            </p>

            <form onSubmit={placeOrder}>

              {/* ── Contact ── */}
              <div className="co-section-divider"><span className="co-section-label">Contact Information</span></div>

              <div className="co-grid-2">
                <Field label="Email" required>
                  <div className="t-input-icon">
                    <Mail size={15} />
                    <input className="t-input" type="email" required
                      value={form.customerEmail} onChange={set('customerEmail')} placeholder="you@example.com" />
                  </div>
                </Field>
                <Field label="Phone" required>
                  <div className="t-input-icon">
                    <Phone size={15} />
                    <input className="t-input" type="tel" required
                      value={form.customerPhone} onChange={set('customerPhone')} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </Field>
              </div>

              {/* ── Shipping ── */}
              <div className="co-section-divider"><span className="co-section-label">Shipping Address</span></div>

              <Field label="Full Name" required>
                <div className="t-input-icon">
                  <User size={15} />
                  <input className="t-input" type="text" required
                    value={form.customerName} onChange={set('customerName')} placeholder="Your full name" />
                </div>
              </Field>

              <Field label="Full Address" required>
                <div className="t-input-icon top">
                  <MapPin size={15} />
                  <textarea className="t-input" style={{ minHeight: 96 }}
                    required rows={3}
                    value={form.customerAddress} onChange={set('customerAddress')}
                    placeholder="House No, Street, Area, City, State — PIN" />
                </div>
              </Field>

              {/* ── Delivery notice ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: shipping === 0 ? 'var(--leaf-50)' : 'var(--haldi-50)',
                border: `1px solid ${shipping === 0 ? '#C9DCC2' : '#EBD39A'}`,
                borderRadius: 10, padding: '12px 16px', marginBottom: 26,
              }}>
                <Truck size={18} style={{ color: shipping === 0 ? 'var(--leaf)' : 'var(--haldi-d)', flexShrink: 0 }} />
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: shipping === 0 ? 'var(--leaf)' : 'var(--ink-2)' }}>
                  {shipping === 0
                    ? '🎉 You\'ve unlocked free delivery!'
                    : <>Add <strong>₹{1000 - subtotal}</strong> more for free delivery. Current shipping: ₹{shipping}</>}
                </p>
              </div>

              {/* ── Pay button ── */}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block" style={{ fontSize: 17, padding: 17 }}>
                {loading ? (
                  <>
                    <span className="dk-spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }} />
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                <ShieldCheck size={15} style={{ color: 'var(--leaf)' }} />
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>256-bit SSL · Secured by Razorpay</span>
              </div>

              {/* Accepted payment methods */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                {['UPI', 'Cards', 'NetBanking', 'Wallets', 'EMI'].map(m => (
                  <span key={m} className="t-badge t-badge-soft">{m}</span>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT — order summary */}
        <div className="co-right">
          <div className="co-right-inner">

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 className="font-display" style={{ fontSize: 24, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
                <ShoppingBag size={19} style={{ color: 'var(--maroon)' }} />
                Order Summary
              </h3>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Item list */}
            <div style={{ marginBottom: 22 }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px dashed var(--line-2)' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 60, height: 64, background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: '999px 999px 8px 8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        : <ShoppingBag size={18} style={{ color: 'var(--line-2)' }} />
                      }
                    </div>
                    <span style={{
                      position: 'absolute', top: -6, right: -6,
                      width: 21, height: 21,
                      background: 'var(--maroon)', color: '#FFF7EA',
                      fontSize: 11, fontWeight: 800, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--sand)',
                    }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>₹{item.price} × {item.quantity} kg</p>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="t-input-icon" style={{ flex: 1, minWidth: 0 }}>
                  <Tag size={14} />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponStatus(null); setCouponMsg(''); }}
                    className="t-input"
                    style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCoupon}
                  className={`btn ${couponStatus === 'ok' ? '' : 'btn-dark'}`}
                  style={{ padding: '0 20px', flexShrink: 0, ...(couponStatus === 'ok' ? { background: 'var(--leaf)', color: '#fff' } : {}) }}
                >
                  {couponStatus === 'ok' ? <CheckCircle size={15} /> : 'Apply'}
                </button>
              </div>
              {couponMsg && (
                <p style={{ fontSize: 13, marginTop: 6, fontWeight: 600, color: couponStatus === 'ok' ? 'var(--leaf)' : 'var(--maroon)' }}>
                  {couponStatus === 'ok' ? '✓ ' : '✕ '}{couponMsg}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="t-card frame-inset" style={{ padding: 22 }}>
              {[
                { label: 'Subtotal', val: `₹${subtotal.toLocaleString()}` },
                { label: 'Shipping', val: shipping === 0 ? 'FREE' : `₹${shipping}`, green: shipping === 0 },
                ...(discount > 0 ? [{ label: 'Discount', val: `–₹${discount}`, green: true }] : []),
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 15, color: 'var(--ink-2)' }}>{r.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: r.green ? 'var(--leaf)' : 'var(--ink)' }}>{r.val}</span>
                </div>
              ))}

              <div style={{ height: 1, borderTop: '1px dashed var(--line-2)', margin: '8px 0 14px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Total</span>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-display" style={{ fontSize: 32, color: 'var(--maroon)', lineHeight: 1 }}>
                    ₹{total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Incl. all taxes</div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: <ShieldCheck size={15} />, text: 'Secure checkout' },
                { icon: <Truck size={15} />, text: 'Fast delivery' },
                { icon: <CheckCircle size={15} />, text: 'Easy returns' },
                { icon: <Lock size={15} />, text: '100% safe' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 12px' }}>
                  <span style={{ color: 'var(--haldi-d)', display: 'flex' }}>{b.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
