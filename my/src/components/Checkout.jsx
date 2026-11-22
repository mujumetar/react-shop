import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Lock, ShoppingBag, Truck, Tag, CheckCircle, MapPin, User, Mail, Phone,
  ArrowLeft, XCircle, RefreshCw, Loader2, Clock,
} from 'lucide-react';
import { INDIAN_STATES, calcShipping, useShippingSettings } from '../shipping';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_live_TgK2N78f0AOXB0';
const WA_NUMBER = '919723089786';

const Field = ({ label, required, children, className = '' }) => (
  <div className={`co-field ${className}`}>
    <label className="t-label">{label}{required && <span className="req">*</span>}</label>
    {children}
  </div>
);

const Section = ({ num, title, sub, children }) => (
  <section className="co-sec t-card">
    <header className="co-sec-head">
      <span className="co-sec-num">{num}</span>
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
    </header>
    <div className="co-sec-body">{children}</div>
  </section>
);

const Steps = () => (
  <ol className="co-steps">
    <li className="done"><span><CheckCircle size={14} /></span>Cart</li>
    <li className="active"><span>2</span>Details</li>
    <li><span>3</span>Payment</li>
  </ol>
);

// Friendlier text for Razorpay's technical error messages
const explain = (reason = '') => {
  if (/website does not match/i.test(reason))
    return 'Online payment is not yet enabled for this website. No money has been taken — please order on WhatsApp and we will confirm it right away.';
  if (/cancel/i.test(reason)) return 'The payment was cancelled.';
  return reason || 'The payment did not go through. If any amount was debited, it will be refunded automatically by your bank.';
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalKg = cart.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  const shippingSettings = useShippingSettings();
  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null | 'ok' | 'err'
  const [couponMsg, setCouponMsg] = useState('');

  // Payment state shown in the overlay: null | { phase: 'checking' | 'failed' | 'pending', reason }
  const [pay, setPay] = useState(null);
  const orderRef = useRef(null);       // { id, sig } — reuse the same order when retrying
  const lastErrorRef = useRef('');

  const [form, setForm] = useState({
    customerName: '', customerEmail: '',
    customerPhone: '', customerAddress: '',
    city: '', state: '', pincode: '',
  });

  // Free across Gujarat; dynamic (by weight) outside — null until a state is chosen
  const shippingQuote = calcShipping(shippingSettings, form.state, totalKg, subtotal);
  const shipping = shippingQuote ?? 0;
  const total = subtotal + shipping - discount;

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

  const goSuccess = (mongoId, orderNumber) =>
    navigate('/success', { state: { orderId: orderNumber || mongoId } });

  /* Ask the server (which asks Razorpay) whether the order was actually paid */
  const checkStatus = async (mongoId) => {
    setPay({ phase: 'checking' });
    try {
      const res = await fetch(`${API_URL}/orders/${mongoId}/razorpay/status`);
      const data = await res.json();
      if (data.status === 'paid') return goSuccess(mongoId, data.orderId);
      if (data.status === 'failed' || lastErrorRef.current)
        return setPay({ phase: 'failed', reason: data.reason || lastErrorRef.current });
      setPay({ phase: 'pending' });
    } catch {
      setPay(lastErrorRef.current ? { phase: 'failed', reason: lastErrorRef.current } : { phase: 'pending' });
    }
  };

  /* Place order */
  const placeOrder = async e => {
    e.preventDefault();
    if (!cart.length) return;
    if (shippingQuote === null) return;
    setLoading(true);
    lastErrorRef.current = '';
    try {
      // Reuse the order if nothing changed since the last attempt (avoids duplicate orders)
      const sig = JSON.stringify({ form, cart });
      let mongoOrderId = orderRef.current?.sig === sig ? orderRef.current.id : null;

      if (!mongoOrderId) {
        const orderRes = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            customerPhone: form.customerPhone,
            shippingAddress: {
              street: form.customerAddress,
              city: form.city,
              state: form.state,
              zip: form.pincode,
              country: 'India',
            },
            products: cart.map(i => ({ productId: i.productId || i._id, quantity: i.quantity })),
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');
        mongoOrderId = orderData.orderId;
        orderRef.current = { id: mongoOrderId, sig };
      }

      const rzpRes = await fetch(`${API_URL}/orders/${mongoOrderId}/razorpay/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzpData.error || 'Failed to start payment');

      let settled = false;
      const rzp = new window.Razorpay({
        key: RZP_KEY,
        order_id: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Dilkhush Kirana',
        description: 'Fresh from Dhasa, Gujarat',
        prefill: { name: form.customerName, email: form.customerEmail, contact: form.customerPhone },
        notes: { order: mongoOrderId },
        theme: { color: '#8A1C1C' },
        handler: async res => {
          settled = true;
          setPay({ phase: 'checking' });
          try {
            const verify = await fetch(`${API_URL}/orders/${mongoOrderId}/razorpay/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              }),
            });
            const v = await verify.json().catch(() => ({}));
            if (verify.ok) return goSuccess(mongoOrderId, v.orderId);
          } catch { /* fall through to status check */ }
          checkStatus(mongoOrderId);
        },
        modal: {
          // Closed without the success callback (e.g. paid by scanning QR on phone, or gave up)
          ondismiss: () => { if (!settled) checkStatus(mongoOrderId); },
        },
      });
      rzp.on('payment.failed', resp => {
        lastErrorRef.current = resp?.error?.description || 'Payment failed';
      });
      rzp.open();
    } catch (err) {
      setPay({ phase: 'failed', reason: err.message });
    } finally {
      setLoading(false);
    }
  };

  const waText = encodeURIComponent(
    `Hello Dilkhush, I want to place an order:\n` +
    cart.map(i => `• ${i.name} × ${i.quantity} kg`).join('\n') +
    `\nTotal: ₹${total}` +
    (form.customerName ? `\nName: ${form.customerName}` : '') +
    (form.city || form.state ? `\nDelivery: ${[form.city, form.state].filter(Boolean).join(', ')}` : '')
  );

  const canPay = !loading && shippingQuote !== null;

  /* ─── RENDER ─── */
  return (
    <div className="co-page">
      {/* Banner */}
      <div className="co-banner">
        <div className="garland" aria-hidden="true" />
        <div className="bandhani-light" style={{ position: 'absolute', inset: 0 }} />
        <div className="co-wrap co-banner-inner">
          <button className="co-back" onClick={() => navigate('/cart')}><ArrowLeft size={15} /> Back to cart</button>
          <h1>Secure Checkout</h1>
          <Steps />
        </div>
        <div className="scallop-bottom" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1 }} />
      </div>

      <div className="co-wrap co-grid">
        {/* LEFT — form */}
        <form id="co-form" onSubmit={placeOrder} className="co-main">
          <Section num="1" title="Contact details" sub="We'll send order updates here">
            <div className="co-grid-2">
              <Field label="Email" required>
                <div className="t-input-icon">
                  <Mail size={15} />
                  <input className="t-input" type="email" required autoComplete="email"
                    value={form.customerEmail} onChange={set('customerEmail')} placeholder="you@example.com" />
                </div>
              </Field>
              <Field label="Phone" required>
                <div className="t-input-icon">
                  <Phone size={15} />
                  <input className="t-input" type="tel" required autoComplete="tel"
                    value={form.customerPhone} onChange={set('customerPhone')} placeholder="+91 XXXXX XXXXX" />
                </div>
              </Field>
            </div>
          </Section>

          <Section num="2" title="Delivery address" sub="Free delivery anywhere in Gujarat">
            <Field label="Full Name" required>
              <div className="t-input-icon">
                <User size={15} />
                <input className="t-input" type="text" required autoComplete="name"
                  value={form.customerName} onChange={set('customerName')} placeholder="Your full name" />
              </div>
            </Field>
            <Field label="Address" required>
              <div className="t-input-icon top">
                <MapPin size={15} />
                <textarea className="t-input" style={{ minHeight: 84 }} required rows={2} autoComplete="street-address"
                  value={form.customerAddress} onChange={set('customerAddress')}
                  placeholder="House No, Street, Area / Village" />
              </div>
            </Field>
            <div className="co-grid-3">
              <Field label="City / Town" required>
                <input className="t-input" type="text" required autoComplete="address-level2"
                  value={form.city} onChange={set('city')} placeholder="e.g. Bhavnagar" />
              </Field>
              <Field label="PIN Code" required>
                <input className="t-input" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required
                  title="6-digit PIN code" autoComplete="postal-code"
                  value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '') }))} placeholder="364740" />
              </Field>
              <Field label="State" required>
                <select className="t-input" required value={form.state} onChange={set('state')}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(st => <option key={st} value={st}>{st}{st === 'Gujarat' ? ' — Free delivery' : ''}</option>)}
                </select>
              </Field>
            </div>

            {/* Delivery notice */}
            <div className={`co-ship ${shippingQuote === 0 ? 'free' : shippingQuote === null ? 'pending' : 'paid'}`}>
              <Truck size={18} />
              <p>
                {shippingQuote === null
                  ? <>Free delivery across <strong>Gujarat</strong>. Select your state to see delivery charges.</>
                  : shippingQuote === 0
                    ? <>🎉 Free delivery to <strong>{form.state}</strong>!</>
                    : <>Delivery to <strong>{form.state}</strong> ({Math.max(1, Math.ceil(totalKg))} kg): <strong>₹{shippingQuote}</strong></>}
              </p>
            </div>
          </Section>

          <Section num="3" title="Payment" sub="UPI, cards, net banking & wallets via Razorpay">
            <div className="co-methods">
              {['UPI', 'Cards', 'NetBanking', 'Wallets'].map(m => <span key={m}>{m}</span>)}
            </div>
            <button type="submit" disabled={!canPay} className="btn btn-primary btn-lg btn-block co-pay">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Starting secure payment…</>
                : shippingQuote === null
                  ? <>Select your state to continue</>
                  : <><Lock size={17} /> Pay ₹{total.toLocaleString()} securely</>}
            </button>
            <p className="co-secure"><ShieldCheck size={15} /> 256-bit SSL · Secured by Razorpay</p>
            <a className="co-wa-alt" href={`https://wa.me/${WA_NUMBER}?text=${waText}`} target="_blank" rel="noopener noreferrer">
              Prefer to order on WhatsApp? <strong>Send your order →</strong>
            </a>
          </Section>
        </form>

        {/* RIGHT — summary */}
        <aside className="co-side">
          <div className="t-card co-summary">
            <div className="t-panel-head dark" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Order Summary</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, opacity: .75 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="co-summary-body">
              <div className="co-items">
                {cart.map((item, i) => (
                  <div key={i} className="co-item">
                    <div className="co-item-img">
                      {item.image
                        ? <img src={item.image} alt={item.name} />
                        : <ShoppingBag size={18} style={{ color: 'var(--line-2)' }} />}
                      <span className="co-item-qty">{item.quantity}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="co-item-name">{item.name}</p>
                      <p className="co-item-meta">₹{item.price} × {item.quantity} kg</p>
                    </div>
                    <span className="co-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="co-coupon">
                <div className="t-input-icon" style={{ flex: 1, minWidth: 0 }}>
                  <Tag size={14} />
                  <input
                    type="text" placeholder="Coupon code" value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponStatus(null); setCouponMsg(''); }}
                    className="t-input" style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}
                  />
                </div>
                <button type="button" onClick={applyCoupon}
                  className={`btn ${couponStatus === 'ok' ? 'btn-wa' : 'btn-dark'}`} style={{ padding: '0 18px', flexShrink: 0 }}>
                  {couponStatus === 'ok' ? <CheckCircle size={15} /> : 'Apply'}
                </button>
              </div>
              {couponMsg && (
                <p style={{ fontSize: 13, margin: '6px 0 0', fontWeight: 600, color: couponStatus === 'ok' ? 'var(--leaf)' : 'var(--maroon)' }}>
                  {couponStatus === 'ok' ? '✓ ' : '✕ '}{couponMsg}
                </p>
              )}

              {/* Totals */}
              <dl className="co-totals">
                <div><dt>Subtotal</dt><dd>₹{subtotal.toLocaleString()}</dd></div>
                <div><dt>Delivery</dt><dd className={shippingQuote === 0 ? 'green' : ''}>{shippingQuote === null ? 'Select state' : shippingQuote === 0 ? 'FREE' : `₹${shippingQuote}`}</dd></div>
                {discount > 0 && <div><dt>Discount</dt><dd className="green">–₹{discount}</dd></div>}
                <div className="co-total"><dt>Total</dt><dd>₹{total.toLocaleString()}<small>Incl. all taxes</small></dd></div>
              </dl>
            </div>
          </div>

          <div className="co-trust">
            {[
              { icon: <ShieldCheck size={15} />, text: 'Secure payment' },
              { icon: <Truck size={15} />, text: 'Free in Gujarat' },
              { icon: <CheckCircle size={15} />, text: 'Freshly packed' },
              { icon: <Lock size={15} />, text: 'Data protected' },
            ].map((b, i) => <div key={i}>{b.icon}<span>{b.text}</span></div>)}
          </div>
        </aside>
      </div>

      {/* Mobile sticky pay bar */}
      <div className="co-paybar">
        <div>
          <small>Total</small>
          <strong>₹{total.toLocaleString()}</strong>
        </div>
        <button type="submit" form="co-form" disabled={!canPay} className="btn btn-primary">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
          {shippingQuote === null ? 'Select state' : 'Pay now'}
        </button>
      </div>

      {/* Payment status overlay */}
      {pay && (
        <div className="co-modal-bg" role="dialog" aria-modal="true">
          <div className="co-modal t-card">
            {pay.phase === 'checking' && (
              <>
                <div className="co-modal-ico"><Loader2 size={30} className="animate-spin" /></div>
                <h3>Confirming your payment…</h3>
                <p>Please wait a moment and don't close this page.</p>
              </>
            )}
            {pay.phase === 'pending' && (
              <>
                <div className="co-modal-ico wait"><Clock size={30} /></div>
                <h3>Payment not received yet</h3>
                <p>If you just paid on your phone, it can take a few seconds to show up.</p>
                <div className="co-modal-actions">
                  <button className="btn btn-primary" onClick={() => checkStatus(orderRef.current?.id)}><RefreshCw size={15} /> Check again</button>
                  <button className="btn btn-soft" onClick={() => setPay(null)}>Try paying again</button>
                </div>
              </>
            )}
            {pay.phase === 'failed' && (
              <>
                <div className="co-modal-ico fail"><XCircle size={30} /></div>
                <h3>Payment didn't go through</h3>
                <p>{explain(pay.reason)}</p>
                <div className="co-modal-actions">
                  <a className="btn btn-wa" href={`https://wa.me/${WA_NUMBER}?text=${waText}`} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
                  <button className="btn btn-soft" onClick={() => setPay(null)}><RefreshCw size={15} /> Try again</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
