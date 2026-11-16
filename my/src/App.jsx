import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbars from "./components/Navbar";
import Footers from "./components/Footer";
import Slider from "./components/Slider";
import About from "./components/Aboutsect";
import Contact from "./components/Contact";
import OrderSuccess from "./components/pages/OrderSuccess";
import { TermsPage, PrivacyPage, RefundPage } from './components/pages/privacy-policy';
import {
  ArrowLeft, ArrowRight, Check, ExternalLink, Heart, Loader2, MessageSquare,
  Minus, Package, Plus, RefreshCw, Send, Share2, Shield, ShoppingBag, Star,
  Trash2, Truck, XCircle
} from 'lucide-react';
import {
  Clock, CheckCircle, Package as PackageIcon,
  MapPin, Calendar, User, Phone, Mail
} from 'lucide-react';
import Eachprod from './components/pages/Eachprod';
import GlobalLoader from './GlobalLoader';
import Checkout from './components/Checkout';
import Qna from './components/Qna';
import { SectionHead, PageBanner, Ornament, Lotus } from './components/Ornament';
import whiteKachariyuImg from './img/white.jpeg';
import blackKachariyuImg from './img/black.jpeg';

// Display-only fallback when a product has no uploaded image
const fallbackImage = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('black')) return blackKachariyuImg;
  if (n.includes('white') || n.includes('kachariyu')) return whiteKachariyuImg;
  return null;
};
import { BusinessSection, BusinessPage } from './components/Businesses';
import PromiseBand from './components/Promise';

// ─── Cart Context ───────────────────────────────────────────────────────────
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedOrders = localStorage.getItem('orders');
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedAddresses) setSavedAddresses(JSON.parse(storedAddresses));
  }, []);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses)); }, [savedAddresses]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) return prev.map((i) => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.img_url }];
    });
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.productId !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCart((prev) => prev.map((i) => (i.productId === id ? { ...i, quantity: qty } : i)));
  };
  const clearCart = () => setCart([]);

  const placeOrder = (orderData) => {
    const order = {
      ...orderData,
      _id: Date.now().toString(),
      orderId: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'ordered',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    const addrKey = `${order.customerEmail}-${order.shippingAddress?.street}`;
    if (!savedAddresses.find(a => a.key === addrKey)) {
      setSavedAddresses((prev) => [...prev, {
        key: addrKey, name: order.customerName, email: order.customerEmail,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress || order.shippingAddress,
      }]);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, orders, placeOrder, updateOrderStatus, savedAddresses }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
export { CartProvider, useCart };

// ─── ScrollToTop ─────────────────────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ─── Shared bits ──────────────────────────────────────────────────────────────
const Spinner = ({ text }) => (
  <div className="dk-state">
    <div className="dk-spinner" />
    {text && <p className="dk-state-text">{text}</p>}
  </div>
);

const EmptyState = ({ icon: Icon, title, children }) => (
  <div className="dk-wrap" style={{ padding: '80px 16px', textAlign: 'center' }}>
    <div className="dk-empty-icon"><Icon size={42} strokeWidth={1.4} /></div>
    <h3 className="font-display" style={{ fontSize: 30, color: 'var(--ink)', margin: '0 0 8px' }}>{title}</h3>
    <Ornament />
    <div style={{ marginTop: 22 }}>{children}</div>
  </div>
);

const statusBadge = (status) => {
  const map = { ordered: 't-badge-gold', confirmed: 't-badge-soft', shipped: 't-badge-maroon', delivered: 't-badge-leaf' };
  return map[status] || 't-badge-soft';
};

// ─── MyOrders ────────────────────────────────────────────────────────────────
const MyOrders = () => {
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();
  const getStatusIcon = (status) => {
    const map = { ordered: { Icon: Clock, color: 'var(--haldi-d)' }, confirmed: { Icon: PackageIcon, color: 'var(--ink-2)' }, shipped: { Icon: Truck, color: 'var(--maroon)' }, delivered: { Icon: CheckCircle, color: 'var(--leaf)' } };
    const { Icon, color } = map[status] || map.ordered;
    return <Icon style={{ color }} size={18} />;
  };
  const getNextStatus = (current) => {
    const flow = ['ordered', 'confirmed', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };
  if (!orders.length) return (
    <>
      <PageBanner title="My Orders" crumb="Your Account" />
      <EmptyState icon={PackageIcon} title="No orders yet">
        <button onClick={() => navigate('/products')} className="btn btn-primary">Start Shopping <ArrowRight size={16} /></button>
      </EmptyState>
    </>
  );
  return (
    <>
      <PageBanner title="My Orders" sub="Every order, lovingly packed in Dhasa." crumb="Your Account" />
      <div className="dk-wrap" style={{ padding: '48px 16px 80px' }}>
        <div className="grid gap-5 md:grid-cols-2">
          {orders.map((order) => (
            <div key={order._id} className="t-card t-card-hover p-6">
              <div className="flex justify-between items-start gap-3 mb-4">
                <div>
                  <h5 className="font-display text-xl text-ink m-0">#{order.orderId}</h5>
                  <p className="text-muted text-sm flex items-center gap-1.5 mt-1"><Calendar size={13} />{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">{getStatusIcon(order.status)}<span className={`t-badge ${statusBadge(order.status)}`}>{order.status}</span></div>
              </div>
              <div className="border-t border-dashed border-line-strong pt-4 mb-4 space-y-1">
                <p className="font-display text-2xl text-maroon m-0">₹{order.total}</p>
                <p className="text-ink-soft text-sm m-0">{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</p>
                <p className="text-ink-soft text-sm flex items-center gap-1.5 m-0"><MapPin size={13} />{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              </div>
              {getNextStatus(order.status) && (
                <button onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))} className="btn btn-soft btn-sm btn-block mb-2 capitalize">Mark as {getNextStatus(order.status)}</button>
              )}
              <button onClick={() => navigate(`/order/${order._id}`)} className="link-arrow w-full justify-center py-2">View Details <ArrowRight size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── OrderDetails ─────────────────────────────────────────────────────────────
const OrderDetails = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();
  const order = orders.find(o => o._id === id);
  if (!order) return (
    <EmptyState icon={PackageIcon} title="Order not found">
      <button onClick={() => navigate('/orders')} className="btn btn-primary">Back to Orders</button>
    </EmptyState>
  );
  const statusFlow = [
    { status: 'ordered', label: 'Order Placed', Icon: Clock },
    { status: 'confirmed', label: 'Confirmed', Icon: PackageIcon },
    { status: 'shipped', label: 'Shipped', Icon: Truck },
    { status: 'delivered', label: 'Delivered', Icon: CheckCircle },
  ];
  const currentIdx = statusFlow.findIndex(s => s.status === order.status);
  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1].status : null;
  return (
    <div className="dk-wrap" style={{ padding: '40px 16px 80px' }}>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="nav-toggle" style={{ display: 'flex' }} aria-label="Back"><ArrowLeft size={18} /></button>
        <div>
          <span className="dk-eyebrow" style={{ marginBottom: 2 }}>Order Details</span>
          <h2 className="font-display text-3xl text-ink m-0">#{order.orderId}</h2>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="t-card">
            <div className="t-panel-head">Order Tracking</div>
            <div className="p-6 pt-8">
              <div className="t-steps">
                {statusFlow.map((step, idx) => {
                  const active = idx <= currentIdx, current = idx === currentIdx;
                  return (
                    <div key={step.status} className={`t-step${active ? ' active' : ''}${idx < currentIdx ? ' done' : ''}${current ? ' current' : ''}`}>
                      <div className="t-step-dot"><step.Icon size={19} /></div>
                      <div style={{ paddingTop: 10 }}>
                        <h6 className={`text-base m-0 ${active ? 'font-bold text-ink' : 'text-muted'}`}>{step.label}</h6>
                      </div>
                    </div>
                  );
                })}
              </div>
              {nextStatus && <button onClick={() => updateOrderStatus(order._id, nextStatus)} className="btn btn-primary btn-block mt-6">Mark as {statusFlow.find(s => s.status === nextStatus)?.label}</button>}
            </div>
          </div>
        </div>
        <div>
          <div className="t-card sticky top-24">
            <div className="t-panel-head dark">Order Summary</div>
            <div className="p-5 pt-7 space-y-2 text-[15px] text-ink-soft">
              <p className="flex justify-between m-0"><span>Status</span> <span className={`t-badge ${statusBadge(order.status)}`}>{order.status}</span></p>
              <p className="flex justify-between m-0"><span>Total</span> <strong className="text-ink">₹{order.total}</strong></p>
              <p className="flex justify-between m-0"><span>Items</span> <strong className="text-ink">{order.items?.length}</strong></p>
              <p className="flex justify-between m-0"><span>Placed</span> <strong className="text-ink">{new Date(order.createdAt).toLocaleDateString()}</strong></p>
              <hr className="my-4 border-dashed border-line-strong" />
              <h6 className="font-bold text-ink m-0 flex items-center gap-2"><MapPin size={15} className="text-maroon" />Shipping Address</h6>
              <p className="m-0">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TrackOrder ───────────────────────────────────────────────────────────────
const TrackOrder = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlOrderId = params.get('order');
    if (urlOrderId) { setOrderId(urlOrderId); handleTrack(urlOrderId); }
  }, [location]);

  const handleTrack = async (id = orderId) => {
    if (!id.trim()) { setError('Please enter Order ID'); return; }
    setSearching(true); setError(''); setOrder(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      setOrder(await res.json());
    } catch { setError('Order not found. Please check your Order ID.'); }
    finally { setSearching(false); }
  };

  const statusFlow = [
    { status: 'ordered', label: 'Order Placed', Icon: Clock },
    { status: 'confirmed', label: 'Confirmed', Icon: PackageIcon },
    { status: 'shipped', label: 'Shipped', Icon: Truck },
    { status: 'delivered', label: 'Delivered', Icon: CheckCircle },
  ];
  const currentIdx = statusFlow.findIndex(s => s.status === (order?.status || 'ordered'));

  return (
    <>
      <PageBanner title="Track Your Order" sub="Enter your Order ID to see its live status." crumb="Order Status" />
      <div className="bandhani" style={{ padding: '0 0 80px' }}>
        <div className="max-w-2xl mx-auto px-4" style={{ marginTop: -28, position: 'relative', zIndex: 16 }}>
          <div className="t-card frame-inset p-6 sm:p-8">
            <label className="t-label" htmlFor="track-id">Order ID</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="t-input-icon flex-1">
                <Truck size={16} />
                <input
                  id="track-id"
                  type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                  placeholder="e.g. ORD-2025-001"
                  className="t-input"
                />
              </div>
              <button onClick={() => handleTrack()} disabled={searching} className="btn btn-primary" style={{ minWidth: 120 }}>
                {searching ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
              </button>
            </div>
            {error && <div className="flex items-center gap-2 mt-4 p-3 rounded-lg text-sm" style={{ background: 'var(--maroon-50)', color: 'var(--maroon)', border: '1px solid #EBC9BF' }}><XCircle size={16} />{error}</div>}
          </div>

          {order && (
            <div className="t-card mt-6 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
                <div>
                  <span className="dk-eyebrow" style={{ marginBottom: 4 }}>Order Found</span>
                  <p className="text-ink-soft text-sm m-0">ID: <strong className="text-ink">{order.orderId || order._id}</strong></p>
                </div>
                <span className={`t-badge ${statusBadge(order.status)}`}>{order.status || 'ordered'}</span>
              </div>
              <div className="t-steps">
                {statusFlow.map((step, idx) => {
                  const isActive = idx <= currentIdx, isCurrent = idx === currentIdx;
                  return (
                    <div key={step.status} className={`t-step${isActive ? ' active' : ''}${idx < currentIdx ? ' done' : ''}${isCurrent ? ' current' : ''}`}>
                      <div className="t-step-dot"><step.Icon size={19} /></div>
                      <div style={{ paddingTop: 3 }}>
                        <p className={`font-semibold m-0 ${isActive ? 'text-ink' : 'text-muted'}`}>{step.label}</p>
                        <p className={`text-sm m-0 ${isCurrent ? 'text-maroon font-semibold' : idx < currentIdx ? 'text-leaf' : 'text-muted'}`}>{isCurrent ? 'In Progress' : idx < currentIdx ? 'Completed' : 'Pending'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted mt-6 mb-0 text-center">Ordered: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setProducts(d || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner text="Loading fresh products…" />;
  if (error || !products.length) return (
    <div className="dk-state"><p className="dk-state-text">{error || 'New arrivals coming soon.'}</p></div>
  );

  return (
    <section className="dk-section" style={{ background: 'var(--sand)' }}>
      <div className="dk-wrap">
        <SectionHead
          eyebrow="Handmade with Love · Since 1999"
          title="Our Products"
          sub="Pure spices & saani — fresh from Dhasa, Gujarat"
        />

        <div className="pgrid">
          {products.map((product) => (
            <div key={product._id} className="pcard" onClick={() => navigate(`/product/${product._id}`)}>
              {/* Image */}
              <div className="pcard-img">
                {(product.img_url || fallbackImage(product.name))
                  ? <img src={product.img_url || fallbackImage(product.name)} alt={product.name} loading="lazy" />
                  : <div className="bandhani" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--haldi)' }}><Lotus size={72} /></div>
                }
                <span className="pcard-badge">
                  <span className={`t-badge ${product.originalPrice ? 't-badge-maroon' : 't-badge-gold'}`}>
                    {product.originalPrice
                      ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                      : 'Fresh'}
                  </span>
                </span>
                <button
                  className="pcard-wish"
                  aria-label="Add to wishlist"
                  onClick={e => { e.stopPropagation(); setLiked(p => ({ ...p, [product._id]: !p[product._id] })); }}
                >
                  <Heart size={14} style={{ color: liked[product._id] ? '#8A1C1C' : '#8A7564', fill: liked[product._id] ? '#8A1C1C' : 'none' }} />
                </button>
                <div className="pcard-overlay">
                  <button className="pcard-atc" onClick={e => { e.stopPropagation(); addToCart(product); navigate('/cart'); }}>
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="pcard-body">
                <p className="pcard-name">{product.name}</p>
                <div className="pcard-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} style={{ fill: '#C98A1B', color: '#C98A1B' }} />)}
                  <span>(128)</span>
                </div>
                <div className="pcard-foot">
                  <div>
                    <span className="pcard-price">₹{product.price}</span>
                    {product.originalPrice && <span className="pcard-orig">₹{product.originalPrice}</span>}
                  </div>
                  <button className="pcard-go" aria-label={`View ${product.name}`} onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
                    <ArrowRight size={15} />
                  </button>
                </div>
                <div className="pcard-fresh"><i /> Fresh · Made in Dhasa</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
            <ShoppingBag size={17} /> View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── ProductDetail ────────────────────────────────────────────────────────────
function ProductDetail({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  if (!product) return null;
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    navigate('/cart');
  };
  const originalPrice = Math.round(product.price * 1.3);
  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 z-[1100]">
          <div className="px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium" style={{ background: 'var(--night)', color: '#FFF7EA', border: '1px solid var(--haldi)' }}>
            <Check className="w-4 h-4" style={{ color: 'var(--haldi)' }} /> {quantity} × {product.name} added
          </div>
        </div>
      )}
      <div className="bandhani" style={{ minHeight: '100vh' }}>
        <div className="dk-wrap" style={{ paddingTop: 36, paddingBottom: 88 }}>
          <button onClick={onClose} className="link-arrow mb-8" style={{ color: 'var(--ink-2)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to products
          </button>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="relative max-w-[540px] w-full mx-auto">
              <div className="about-arch-outline" style={{ inset: -12 }} />
              <div className="arch-soft" style={{ border: '1px solid var(--line-2)', background: 'var(--sand)', boxShadow: 'var(--shadow-lg)' }}>
                <img src={product.img_url} alt={product.name} className="w-full aspect-square object-cover" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <span className="dk-eyebrow">Homemade in Dhasa</span>
                <h1 className="font-display text-ink leading-tight m-0" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>{product.name}</h1>
                <div className="flex items-center flex-wrap gap-3 mt-3">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ fill: '#C98A1B', color: '#C98A1B' }} />)}</div>
                  <span className="text-sm text-muted">(428 reviews)</span>
                  <span className="t-badge t-badge-leaf">In stock</span>
                </div>
              </div>
              <div className="flex items-baseline flex-wrap gap-3 py-4 border-y border-dashed border-line-strong">
                <span className="font-display text-maroon" style={{ fontSize: 42, lineHeight: 1 }}>₹{product.price}</span>
                <del className="text-lg text-muted">₹{originalPrice}</del>
                <span className="t-badge t-badge-gold">Save ₹{originalPrice - product.price}</span>
              </div>
              {product.description && <p className="text-ink-soft leading-relaxed text-[17px] m-0">{product.description}</p>}
              <div className="flex items-center gap-5 flex-wrap">
                <span className="t-label" style={{ margin: 0 }}>Quantity (kg)</span>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1.5px solid var(--line-2)', background: 'var(--surface)' }}>
                  <button onClick={() => setQuantity(p => Math.max(1, p - 1))} className="p-3 hover:bg-sand transition-colors" aria-label="Decrease"><Minus className="w-4 h-4" /></button>
                  <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(p => p + 1)} className="p-3 hover:bg-sand transition-colors" aria-label="Increase"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={handleAddToCart} className="btn btn-primary btn-lg btn-block">
                  <ShoppingBag className="w-5 h-5" /> Add to Cart — ₹{product.price * quantity}
                </button>
                <button onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) await navigator.share({ title: product.name, url });
                  else { await navigator.clipboard.writeText(url); alert('Link copied!'); }
                }} className="btn btn-outline btn-block">
                  <Share2 className="w-5 h-5" /> Share Product
                </button>
              </div>
              <div className="t-card p-5 space-y-4">
                {[
                  { Icon: Truck, t: 'Free delivery on orders above ₹499' },
                  { Icon: Package, t: '100% vegetarian · No preservatives' },
                  { Icon: Shield, t: '25 years of trusted quality · Made in Dhasa' },
                ].map(({ Icon, t }) => (
                  <div key={t} className="flex items-center gap-3 text-[15px] text-ink-soft">
                    <span className="t-icon-circle" style={{ width: 38, height: 38 }}><Icon className="w-[18px] h-[18px]" /></span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ProductDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(r => r.json()).then(setProduct).catch(console.error).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <Spinner />;
  if (!product) return <EmptyState icon={ShoppingBag} title="Product not found" />;
  return <ProductDetail product={product} onClose={() => navigate(-1)} />;
};

// ─── Cart ────────────────────────────────────────────────────────────────────
const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 1;
  const total = subtotal + shipping;

  if (!cart.length) return (
    <>
      <PageBanner title="Your Cart" crumb="Shopping Bag" />
      <EmptyState icon={ShoppingBag} title="Your cart is empty">
        <button onClick={() => navigate('/products')} className="btn btn-primary btn-lg">Continue Shopping <ArrowRight size={16} /></button>
      </EmptyState>
    </>
  );
  return (
    <>
      <PageBanner title="Your Cart" sub={`${cart.length} item${cart.length !== 1 ? 's' : ''} in your bag`} crumb="Shopping Bag" />
      <div className="dk-wrap" style={{ paddingTop: 40, paddingBottom: 88 }}>
        <div className="flex items-center mb-8 p-4 rounded-xl gap-4" style={{ background: 'var(--haldi-50)', border: '1px solid #EBD39A' }}>
          <span className="t-icon-circle" style={{ background: 'var(--surface)' }}><Truck size={20} /></span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[15px] text-ink m-0">{subtotal >= 1000 ? 'Free Shipping Unlocked! 🎉' : `Add ₹${(1000 - subtotal).toLocaleString()} more for FREE shipping`}</p>
            <div className="w-full rounded-full h-2 mt-2" style={{ background: 'rgba(168,111,14,.18)' }}><div className="h-2 rounded-full transition-all" style={{ background: 'var(--maroon)', width: `${Math.min((subtotal / 1000) * 100, 100)}%` }} /></div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.productId} className="t-card p-4 sm:p-5 flex gap-4 items-start">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover flex-shrink-0" style={{ borderRadius: '999px 999px 8px 8px', border: '1px solid var(--line)' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h6 className="font-semibold text-ink text-base leading-snug m-0">{item.name}</h6>
                    <button onClick={() => removeFromCart(item.productId)} className="text-muted hover:text-maroon transition-colors flex-shrink-0 p-1" aria-label="Remove"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-muted text-sm mt-0.5 mb-0">₹{item.price}/kg</p>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="flex items-center rounded-md" style={{ border: '1px solid var(--line-2)', background: 'var(--paper)' }}>
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 disabled:opacity-40 hover:bg-sand" aria-label="Decrease"><Minus size={13} /></button>
                      <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-sand" aria-label="Increase"><Plus size={13} /></button>
                    </div>
                    <span className="font-display text-xl text-maroon">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="t-card sticky top-24 self-start">
            <div className="t-panel-head dark">Order Summary</div>
            <div className="p-5 pt-7 space-y-3">
              <div className="flex justify-between text-[15px]"><span className="text-ink-soft">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-[15px]"><span className="text-ink-soft">Shipping</span><span className="font-semibold">{shipping === 0 ? <span className="text-leaf">FREE</span> : `₹${shipping}`}</span></div>
              <div className="border-t border-dashed border-line-strong pt-3 flex justify-between items-baseline"><span className="font-bold text-ink">Total</span><span className="font-display text-3xl text-maroon">₹{total.toLocaleString()}</span></div>
              <button onClick={() => navigate('/checkout', { state: { cart } })} className="btn btn-primary btn-lg btn-block" style={{ marginTop: 14 }}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── DistributorsSection ──────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL;
const DistributorsSection = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/distributors`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setDistributors(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  if (error || !distributors.length) return null;
  return (
    <section className="dk-section" style={{ background: 'var(--sand)' }}>
      <div className="dk-wrap">
        <SectionHead eyebrow="Local Network" title="Find a Distributor Near You" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {distributors.map(dist => (
            <div key={dist._id} className="t-card t-card-hover p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="t-icon-circle"><MapPin size={19} /></span>
                  <div>
                    <h3 className="font-display text-xl text-ink m-0">{dist.name}</h3>
                    <span className="text-[15px] text-muted">{dist.city}</span>
                  </div>
                </div>
                <span className="t-badge t-badge-leaf"><span className="diamond" style={{ width: 5, height: 5, background: 'var(--leaf)' }} />In Stock</span>
              </div>
              <div className="space-y-2 mb-5 pt-4 border-t border-dashed border-line-strong">
                <a href={`tel:${dist.phone}`} className="flex items-center gap-2 text-[15px] text-ink-soft hover:text-maroon transition-colors"><Phone className="w-4 h-4 text-haldi" />{dist.phone}</a>
                <div className="flex justify-between text-[15px]"><span className="text-muted">Stock</span><span className="font-semibold text-ink">{dist.stock} units</span></div>
              </div>
              <a href={dist.locationUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="btn btn-dark btn-block btn-sm">
                <MapPin className="w-4 h-4" /> View on Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-ink-soft text-[15px] mt-10">Can't find one near you? <a href="/contact" className="text-maroon font-bold hover:underline">Contact us</a> to become a distributor.</p>
      </div>
    </section>
  );
};

// ─── Blog ─────────────────────────────────────────────────────────────────────
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/blogs`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setBlogs(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  if (!blogs.length) return null;
  return (
    <section className="dk-section bandhani" style={{ background: 'var(--paper)' }}>
      <div className="dk-wrap">
        <SectionHead eyebrow="From Our Kitchen" title="Stories of Tradition & Taste" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 6).map(blog => (
            <article key={blog._id} className="group t-card t-card-hover overflow-hidden cursor-pointer p-2.5" onClick={() => navigate(`/blogs/${blog._id}`)}>
              <div className="relative aspect-video overflow-hidden rounded-lg" style={{ background: 'var(--sand)' }}>
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div className="p-3 pt-4 space-y-2">
                <h3 className="font-display text-ink text-xl leading-snug line-clamp-2 group-hover:text-maroon transition-colors m-0">{blog.title}</h3>
                <p className="text-ink-soft text-[15px] line-clamp-2 m-0">{blog.content?.substring(0, 100)}…</p>
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-dashed border-line-strong text-sm text-muted">
                  <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{blog.author || 'Dilkhush Family'}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => navigate('/blogs')} className="btn btn-outline btn-lg">
            Explore All Stories <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── BlogDetails ──────────────────────────────────────────────────────────────
const BlogDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) { setError('Invalid blog ID'); setLoading(false); return; }
    fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(setBlog)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <Spinner />;
  if (error || !blog) return (
    <EmptyState icon={MessageSquare} title={error || 'Blog not found'}>
      <button className="btn btn-primary" onClick={() => navigate('/blogs')}>Back to Blogs</button>
    </EmptyState>
  );
  return (
    <div className="bandhani">
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
        <button onClick={() => navigate('/blogs')} className="link-arrow mb-8" style={{ color: 'var(--ink-2)' }}>
          <ArrowLeft size={16} /> Back to Blogs
        </button>
        <article>
          <span className="dk-eyebrow">From Our Kitchen</span>
          <h1 className="font-display text-ink m-0 mb-4" style={{ fontSize: 'clamp(30px, 4.6vw, 48px)', lineHeight: 1.12 }}>{blog.title}</h1>
          <div className="flex flex-wrap gap-5 text-[15px] text-muted mb-8">
            <span className="flex items-center gap-1.5"><User size={15} />{blog.author || 'Dilkhush Family'}</span>
            <span className="flex items-center gap-1.5"><Calendar size={15} />{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          {blog.image && (
            <div className="t-card p-2.5 mb-10">
              <img src={blog.image} alt={blog.title} className="w-full aspect-video object-cover rounded-lg" />
            </div>
          )}
          <div className="t-prose whitespace-pre-wrap">{blog.content}</div>
          <Ornament className="mt-12" />
        </article>
      </div>
    </div>
  );
};

// ─── OrderFailed ──────────────────────────────────────────────────────────────
const OrderFailed = ({ errorMessage = "We couldn't process your payment. Please try again." }) => {
  const navigate = useNavigate();
  return (
    <div className="bandhani flex items-center justify-center px-4 py-16" style={{ minHeight: '70vh' }}>
      <div className="max-w-md w-full t-card overflow-hidden">
        <div className="text-center px-6 pt-10 pb-6">
          <div className="t-icon-circle mx-auto mb-4" style={{ width: 72, height: 72, background: 'var(--maroon-50)', color: 'var(--maroon)', borderColor: '#EBC9BF' }}>
            <XCircle size={34} />
          </div>
          <h1 className="font-display text-3xl text-ink m-0">Order Failed</h1>
          <Ornament className="mt-3" />
        </div>
        <div className="px-6 pb-7 space-y-4">
          <p className="text-[15px] rounded-lg p-4 m-0" style={{ background: 'var(--maroon-50)', color: 'var(--maroon-d)', border: '1px solid #EBC9BF' }}>{errorMessage}</p>
          <p className="text-center text-ink-soft text-[15px] m-0">Need help? Call <a href="tel:7874536227" className="text-maroon font-bold">7874536227</a></p>
          <button onClick={() => window.location.reload()} className="btn btn-primary btn-block">
            <RefreshCw size={16} /> Try Again
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/cart')} className="btn btn-soft"><ArrowLeft size={15} /> Cart</button>
            <button onClick={() => navigate('/')} className="btn btn-soft">Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CustomBuilder ────────────────────────────────────────────────────────────
const CustomBuilder = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('https://dilkhush-api.vercel.app/custom/ingredients')
      .then(r => r.json()).then(d => setIngredients(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);
  const addIngredient = (ing, variant) => {
    if (selected.some(s => s.ingredientId === ing._id && s.variant === variant.quality)) { alert('Already added!'); return; }
    setSelected([...selected, { ingredientId: ing._id, name: ing.name, variant: variant.quality, quantity: variant.unit === 'g' ? 100 : 0.25, unit: variant.unit, minQty: variant.minQuantity, pricePerKg: variant.pricePerKg, price: variant.pricePerKg * (variant.unit === 'g' ? variant.minQuantity / 1000 : variant.minQuantity) }]);
  };
  const updateQty = (i, qty) => {
    if (qty < selected[i].minQty) qty = selected[i].minQty;
    setSelected(prev => { const u = [...prev]; const item = u[i]; item.quantity = qty; item.price = Math.round(item.pricePerKg * (item.unit === 'g' ? qty / 1000 : qty) * 100) / 100; return u; });
  };
  const totalPrice = selected.reduce((s, i) => s + i.price, 0).toFixed(2);
  if (loading) return <Spinner text="Loading ingredients…" />;
  return (
    <>
      <PageBanner title="Build Your Mix" sub="Choose your ingredients and quality — we'll blend it fresh." crumb="Custom Masala" />
      <div className="dk-wrap" style={{ paddingTop: 44, paddingBottom: 88 }}>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-5">
            {ingredients.map(ing => (
              <div key={ing._id} className="t-card overflow-hidden p-2.5">
                {ing.image && <img src={ing.image} className="w-full h-48 object-cover rounded-lg" />}
                <div className="p-3 pt-4">
                  <h5 className="font-display text-xl text-ink m-0 mb-3">{ing.name} <span className="text-muted text-base font-sans">({ing.category})</span></h5>
                  <div className="space-y-2">
                    {ing.variants.map(v => (
                      <button key={v.quality} onClick={() => addIngredient(ing, v)} className="w-full py-2.5 rounded-lg text-left px-3 transition-colors flex items-center justify-between gap-2" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
                        <span className="font-semibold text-ink">{v.quality}</span>
                        <span className="text-sm text-muted">₹{v.pricePerKg}/kg · Min {v.minQuantity}{v.unit}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="t-card sticky top-24 self-start">
            <div className="t-panel-head">Your Mix · ₹{totalPrice}</div>
            <div className="p-5 pt-7 space-y-3">
              {selected.map((item, i) => (
                <div key={i} className="pb-3 border-b border-dashed border-line-strong">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-sm text-ink m-0">{item.name} ({item.variant})</p>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="number" min={item.minQty} value={item.quantity} onChange={e => updateQty(i, parseFloat(e.target.value))} className="t-input" style={{ width: 72, padding: '4px 8px', fontSize: 13 }} />
                        <span className="text-xs text-muted">{item.unit} = ₹{item.price}</span>
                      </div>
                    </div>
                    <button onClick={() => setSelected(selected.filter((_, idx) => idx !== i))} className="text-muted hover:text-maroon transition-colors text-lg leading-none" aria-label="Remove">×</button>
                  </div>
                </div>
              ))}
              <input placeholder="Name *" className="t-input" value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
              <input placeholder="Phone *" className="t-input" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
              <input placeholder="Email" className="t-input" value={customerInfo.email} onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
              <button disabled={!selected.length} className="btn btn-gold btn-block">
                PAY ₹{totalPrice} & PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <CartProvider>
      <Router>
        <GlobalLoader />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<><Navbars /><Slider /><BusinessSection /><ProductCard /><PromiseBand /><DistributorsSection /><Blog /><Qna /><Footers /></>} />
          <Route path="/products" element={<><Navbars /><ProductCard /><Footers /></>} />
          <Route path="/my" element={<><Navbars /><MyOrders /><Footers /></>} />
          <Route path="/about" element={<><Navbars /><About /><Footers /></>} />
          <Route path="/cart" element={<><Navbars /><Cart /><Footers /></>} />
          <Route path="/orders" element={<><Navbars /><MyOrders /><Footers /></>} />
          <Route path="/order/:id" element={<><Navbars /><OrderDetails /><Footers /></>} />
          <Route path="/checkout" element={<><Navbars /><Checkout /><Footers /></>} />
          <Route path="/contact" element={<><Navbars /><Contact /><Footers /></>} />
          <Route path="/blogs" element={<><Navbars /><Blog /><Footers /></>} />
          <Route path="/offers" element={<><Navbars /><Footers /></>} />
          <Route path="/product/:id" element={<><Navbars /><ProductDetailWrapper /><Footers /></>} />
          <Route path="/blogs/:id" element={<><Navbars /><BlogDetails /><Footers /></>} />
          <Route path="/success" element={<><Navbars /><OrderSuccess /><Footers /></>} />
          <Route path="/track-order" element={<><Navbars /><TrackOrder /><Footers /></>} />
          <Route path="/cancel" element={<><Navbars /><OrderFailed /><Footers /></>} />
          <Route path="/businesses" element={<><Navbars /><BusinessSection /><Footers /></>} />
          <Route path="/business/:slug" element={<><Navbars /><BusinessPage /><Footers /></>} />
          <Route path="/custom" element={<><Navbars /><CustomBuilder /><Footers /></>} />
          <Route path="/terms-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
