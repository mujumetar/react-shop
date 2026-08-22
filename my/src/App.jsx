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

// ─── MyOrders ────────────────────────────────────────────────────────────────
const MyOrders = () => {
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();
  const getStatusIcon = (status) => {
    const map = { ordered: { Icon: Clock, color: 'text-amber-500' }, confirmed: { Icon: PackageIcon, color: 'text-blue-500' }, shipped: { Icon: Truck, color: 'text-indigo-600' }, delivered: { Icon: CheckCircle, color: 'text-green-500' } };
    const { Icon, color } = map[status] || map.ordered;
    return <Icon className={color} size={20} />;
  };
  const getNextStatus = (current) => {
    const flow = ['ordered', 'confirmed', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };
  if (!orders.length) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <PackageIcon size={80} className="mx-auto mb-3 text-zinc-300" />
      <h3 className="text-2xl font-bold text-zinc-900 mb-3">No orders yet</h3>
      <button onClick={() => navigate('/products')} className="mt-3 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">Start Shopping</button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-zinc-900">My Orders</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-zinc-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h5 className="text-lg font-bold text-zinc-900">#{order.orderId}</h5>
                <p className="text-zinc-500 text-sm flex items-center gap-1 mt-0.5"><Calendar size={13} />{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">{getStatusIcon(order.status)}<span className="bg-zinc-100 text-zinc-700 text-xs px-2.5 py-1 rounded-full capitalize">{order.status}</span></div>
            </div>
            <div className="border-t pt-3 mb-4 space-y-1">
              <p className="font-semibold text-zinc-900">₹{order.total}</p>
              <p className="text-zinc-500 text-sm">{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</p>
              <p className="text-zinc-500 text-sm flex items-center gap-1"><MapPin size={12} />{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            </div>
            {getNextStatus(order.status) && (
              <button onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))} className="w-full text-sm bg-green-50 hover:bg-green-100 text-green-800 py-2 rounded-lg mb-2 transition-colors">Mark as {getNextStatus(order.status)}</button>
            )}
            <button onClick={() => navigate(`/order/${order._id}`)} className="w-full text-green-700 hover:text-green-900 font-medium text-sm transition-colors">View Details →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── OrderDetails ─────────────────────────────────────────────────────────────
const OrderDetails = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();
  const order = orders.find(o => o._id === id);
  if (!order) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h3 className="text-2xl font-bold text-zinc-900 mb-3">Order not found</h3>
      <button onClick={() => navigate('/orders')} className="mt-3 bg-green-700 text-white font-semibold py-2.5 px-6 rounded-xl">Back to Orders</button>
    </div>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-3 text-zinc-500 hover:text-zinc-700 flex items-center p-2 border border-zinc-200 rounded-xl"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-bold">Order #{order.orderId}</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
            <div className="bg-green-700 text-white p-4"><h5 className="font-semibold">Order Tracking</h5></div>
            <div className="p-6 space-y-4">
              {statusFlow.map((step, idx) => {
                const active = idx <= currentIdx, current = idx === currentIdx;
                return (
                  <div key={step.status} className="flex items-center">
                    <div className={`mr-3 flex items-center justify-center w-11 h-11 rounded-full ${active ? 'bg-green-700 text-white' : 'bg-zinc-100 text-zinc-400'} ${current ? 'ring-4 ring-green-100' : ''}`}>
                      <step.Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h6 className={`${active ? 'font-bold text-zinc-900' : 'text-zinc-400'}`}>{step.label}</h6>
                      {idx < statusFlow.length - 1 && <div className={`ml-3 h-8 border-l-2 ${idx < currentIdx ? 'border-green-600' : 'border-zinc-200'}`} />}
                    </div>
                  </div>
                );
              })}
              {nextStatus && <button onClick={() => updateOrderStatus(order._id, nextStatus)} className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl transition-colors">Mark as {statusFlow.find(s => s.status === nextStatus)?.label}</button>}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-zinc-100 rounded-2xl sticky top-4 overflow-hidden">
            <div className="bg-zinc-50 p-4 border-b"><h5 className="font-semibold">Order Summary</h5></div>
            <div className="p-5 space-y-2 text-sm">
              <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Items:</strong> {order.items?.length}</p>
              <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <hr className="my-3" />
              <h6 className="font-bold text-zinc-900">Shipping Address</h6>
              <p className="text-zinc-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
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
    { status: 'ordered', label: 'Order Placed', Icon: Clock, color: 'text-amber-500' },
    { status: 'confirmed', label: 'Confirmed', Icon: PackageIcon, color: 'text-blue-500' },
    { status: 'shipped', label: 'Shipped', Icon: Truck, color: 'text-green-600' },
    { status: 'delivered', label: 'Delivered', Icon: CheckCircle, color: 'text-green-700' },
  ];
  const currentIdx = statusFlow.findIndex(s => s.status === (order?.status || 'ordered'));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-green-700 text-white text-center py-8 px-4">
          <Truck size={36} className="mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-1">Track Your Order</h2>
          <p className="opacity-80 text-sm">Enter your Order ID to see live status</p>
        </div>
        <div className="p-7">
          <div className="flex gap-2 mb-4">
            <input
              type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. ORD-2025-001"
              className="flex-1 border border-zinc-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
            <button onClick={() => handleTrack()} disabled={searching} className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              {searching ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
            </button>
          </div>
          {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm"><XCircle size={16} />{error}</div>}
        </div>
      </div>
      {order && (
        <div className="mt-6 bg-white border border-zinc-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-green-700 mb-1">Order Found!</h3>
          <p className="text-zinc-500 text-sm mb-5">ID: {order.orderId || order._id}</p>
          <div className="space-y-4">
            {statusFlow.map((step, idx) => {
              const isActive = idx <= currentIdx, isCurrent = idx === currentIdx;
              return (
                <div key={step.status} className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${isActive ? 'bg-green-700 text-white' : 'bg-zinc-100 text-zinc-400'} ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                    <step.Icon size={22} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>{step.label}</p>
                    <p className={`text-xs ${isActive ? step.color : 'text-zinc-400'}`}>{isCurrent ? 'In Progress' : idx < currentIdx ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-400 mt-5 text-center">Ordered: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

// ─── ProductCard ──────────────────────────────────────────────────────────────
const S = {
  section: { padding: '88px 0', background: '#f9fafb' },
  wrap: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:44 },
  eyebrow: { display:'inline-flex', alignItems:'center', gap:6, background:'#dcfce7', color:'#15803d', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', padding:'5px 13px', borderRadius:100, marginBottom:12 },
  h2: { fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:'clamp(26px,3.5vw,42px)', color:'#0f0f0f', lineHeight:1.15 },
  sub: { color:'#9ca3af', fontSize:14, marginTop:6 },
  viewAll: { display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, color:'#16a34a', background:'none', border:'none', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 },
  card: { background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:18, overflow:'hidden', cursor:'pointer', transition:'border-color .25s,transform .25s,box-shadow .25s' },
  imgWrap: { position:'relative', aspectRatio:'1/1', background:'#f4f6f4', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .5s ease' },
  badge: { position:'absolute', top:12, left:12, fontSize:10, fontWeight:800, padding:'4px 9px', borderRadius:100, color:'#fff', letterSpacing:'0.04em', textTransform:'uppercase' },
  wish: { position:'absolute', top:12, right:12, width:32, height:32, background:'rgba(255,255,255,0.92)', border:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity .2s,transform .2s' },
  overlay: { position:'absolute', inset:'auto 0 0 0', background:'linear-gradient(to top,rgba(0,0,0,.70),transparent)', padding:16, transition:'transform .3s ease' },
  atcBtn: { width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'#fff', color:'#15803d', fontSize:13, fontWeight:700, padding:'10px 16px', borderRadius:10, border:'none', cursor:'pointer' },
  body: { padding:16 },
  name: { fontWeight:700, fontSize:14, color:'#111', lineHeight:1.4, marginBottom:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  starsRow: { display:'flex', alignItems:'center', gap:2, marginBottom:10 },
  foot: { display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 },
  price: { fontSize:18, fontWeight:800, color:'#111' },
  orig: { fontSize:12, color:'#9ca3af', textDecoration:'line-through', marginLeft:6 },
  goBtn: { width:34, height:34, background:'#15803d', color:'#fff', border:'none', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'background .2s,transform .2s' },
  fresh: { display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'#16a34a', marginTop:10 },
  freshDot: { width:6, height:6, borderRadius:'50%', background:'#22c55e' },
  cta: { textAlign:'center', marginTop:48 },
  ctaBtn: { display:'inline-flex', alignItems:'center', gap:8, background:'#15803d', color:'#fff', fontSize:14, fontWeight:700, padding:'15px 34px', borderRadius:13, border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(21,128,61,.28)', transition:'background .2s,transform .2s,box-shadow .2s' },
};

const mediaStyles = `
  @media(max-width:1100px){.pcard-grid{grid-template-columns:repeat(3,1fr)!important}}
  @media(max-width:750px){.pcard-grid{grid-template-columns:repeat(2,1fr)!important;gap:14px!important}}
  @media(max-width:420px){.pcard-grid{grid-template-columns:1fr!important}}
  .pcard-item:hover{border-color:#86efac!important;transform:translateY(-4px)!important;box-shadow:0 16px 48px rgba(0,0,0,.10)!important}
  .pcard-item:hover .pcard-img-el{transform:scale(1.07)!important}
  .pcard-item:hover .pcard-wish-btn{opacity:1!important}
  .pcard-item:hover .pcard-overlay-el{transform:translateY(0)!important}
  .pcard-item:hover .pcard-name-el{color:#15803d!important}
`;

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

  if (loading) return (
    <div style={{ padding:'80px 32px', textAlign:'center', background:'#f9fafb' }}>
      <div style={{ display:'inline-block', width:36, height:36, border:'3px solid #e5e7eb', borderTopColor:'#16a34a', borderRadius:'50%', animation:'dk-spin .7s linear infinite', marginBottom:12 }} />
      <p style={{ color:'#9ca3af', fontSize:14 }}>Loading fresh products…</p>
    </div>
  );
  if (error || !products.length) return (
    <div style={{ padding:'80px 32px', textAlign:'center', background:'#f9fafb' }}>
      <p style={{ color:'#9ca3af', fontSize:14 }}>{error || 'New arrivals coming soon.'}</p>
    </div>
  );

  return (
    <section style={S.section}>
      <style>{mediaStyles}</style>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <div style={S.eyebrow}>Handmade with Love · Since 1999</div>
            <h2 style={S.h2}>Our Products</h2>
            <p style={S.sub}>Pure spices &amp; saani — fresh from Dhasa, Gujarat</p>
          </div>
          <button style={S.viewAll} onClick={() => navigate('/products')}>
            View all <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid */}
        <div className="pcard-grid" style={S.grid}>
          {products.map((product, i) => (
            <div
              key={product._id}
              className="pcard-item"
              style={S.card}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Image */}
              <div style={S.imgWrap}>
                {product.img_url
                  ? <img className="pcard-img-el" src={product.img_url} alt={product.name} loading="lazy" style={S.img} />
                  : <div style={{ width:'100%', height:'100%', background:'#ecfdf5', display:'flex', alignItems:'center', justifyContent:'center' }}><ShoppingBag size={36} color="#86efac" /></div>
                }
                <span style={{ ...S.badge, background: product.originalPrice ? '#dc2626' : '#16a34a' }}>
                  {product.originalPrice
                    ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                    : 'Fresh'}
                </span>
                <button
                  className="pcard-wish-btn"
                  style={S.wish}
                  onClick={e => { e.stopPropagation(); setLiked(p => ({ ...p, [product._id]: !p[product._id] })); }}
                >
                  <Heart size={14} style={{ color: liked[product._id] ? '#ef4444' : '#9ca3af', fill: liked[product._id] ? '#ef4444' : 'none' }} />
                </button>
                <div className="pcard-overlay-el" style={{ ...S.overlay, transform: 'translateY(100%)' }}>
                  <button className="pcard-atc" style={S.atcBtn} onClick={e => { e.stopPropagation(); addToCart(product); navigate('/cart'); }}>
                    <ShoppingBag size={13} /> Add to Cart
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={S.body}>
                <p className="pcard-name-el" style={S.name}>{product.name}</p>
                <div style={S.starsRow}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} style={{ fill:'#fbbf24', color:'#fbbf24' }} />)}
                  <span style={{ fontSize:11, color:'#9ca3af', marginLeft:4 }}>(128)</span>
                </div>
                <div style={S.foot}>
                  <div>
                    <span style={S.price}>₹{product.price}</span>
                    {product.originalPrice && <span style={S.orig}>₹{product.originalPrice}</span>}
                  </div>
                  <button style={S.goBtn} onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
                    <ArrowRight size={13} />
                  </button>
                </div>
                <div style={S.fresh}><span style={S.freshDot} /> Fresh · Made in Dhasa</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={S.cta}>
          <button style={S.ctaBtn}
            onClick={() => navigate('/products')}
            onMouseEnter={e => { e.currentTarget.style.background='#166534'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#15803d'; e.currentTarget.style.transform='none'; }}
          >
            <ShoppingBag size={16} /> View All Products
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
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-zinc-900 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium">
            <Check className="w-4 h-4 text-green-400" /> {quantity} × {product.name} added
          </div>
        </div>
      )}
      <div className="bg-zinc-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <button onClick={onClose} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to products
          </button>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100">
              <img src={product.img_url} alt={product.name} className="w-full aspect-square object-cover" />
            </div>
            <div className="space-y-7">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <span className="text-sm text-zinc-500">(428 reviews)</span>
                  <span className="text-sm font-medium text-green-600">In stock</span>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-zinc-900">₹{product.price}</span>
                <del className="text-lg text-zinc-400">₹{originalPrice}</del>
                <span className="text-sm font-medium text-green-600">Save ₹{originalPrice - product.price}</span>
              </div>
              {product.description && <p className="text-zinc-600 leading-relaxed">{product.description}</p>}
              <div className="flex items-center gap-5">
                <span className="text-sm font-medium text-zinc-700">Quantity (kg)</span>
                <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(p => Math.max(1, p - 1))} className="p-3 hover:bg-zinc-50 transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="w-14 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(p => p + 1)} className="p-3 hover:bg-zinc-50 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={handleAddToCart} className="w-full bg-zinc-900 hover:bg-green-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-3">
                  <ShoppingBag className="w-5 h-5" /> Add to Cart — ₹{product.price * quantity}
                </button>
                <button onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) await navigator.share({ title: product.name, url });
                  else { await navigator.clipboard.writeText(url); alert('Link copied!'); }
                }} className="w-full border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3">
                  <Share2 className="w-5 h-5" /> Share Product
                </button>
              </div>
              <div className="border-t pt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-600"><Truck className="w-5 h-5 text-zinc-400" /> Free delivery on orders above ₹499</div>
                <div className="flex items-center gap-3 text-sm text-zinc-600"><Package className="w-5 h-5 text-zinc-400" /> 100% vegetarian · No preservatives</div>
                <div className="flex items-center gap-3 text-sm text-zinc-600"><Shield className="w-5 h-5 text-zinc-400" /> 25 years of trusted quality · Made in Dhasa</div>
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
  if (loading) return <div className="py-12 text-center"><div className="inline-block w-8 h-8 border-b-2 border-zinc-900 rounded-full animate-spin" /></div>;
  if (!product) return <div className="py-12 text-center"><h3 className="text-2xl font-bold text-zinc-900">Product not found</h3></div>;
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
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <ShoppingBag size={64} className="mx-auto mb-4 text-zinc-300" />
      <h3 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h3>
      <button onClick={() => navigate('/products')} className="mt-4 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-xl transition-colors">Continue Shopping</button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h2 className="text-3xl font-bold text-zinc-900 mb-6">Your Cart</h2>
      <div className="flex items-center mb-6 p-4 bg-green-50 border border-green-100 rounded-xl gap-3">
        <Truck size={22} className="text-green-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm text-zinc-800">{subtotal >= 1000 ? 'Free Shipping Unlocked! 🎉' : `Add ₹${(1000 - subtotal).toLocaleString()} more for FREE shipping`}</p>
          <div className="w-full bg-zinc-200 rounded-full h-1.5 mt-1.5"><div className="bg-green-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }} /></div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.productId} className="bg-white border border-zinc-100 rounded-2xl p-5 flex gap-4 items-start">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h6 className="font-bold text-zinc-900 text-sm leading-snug">{item.name}</h6>
                  <button onClick={() => removeFromCart(item.productId)} className="text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={15} /></button>
                </div>
                <p className="text-zinc-400 text-xs mt-0.5">₹{item.price}/kg</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-zinc-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 disabled:opacity-40 hover:bg-zinc-50"><Minus size={12} /></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 hover:bg-zinc-50"><Plus size={12} /></button>
                  </div>
                  <span className="font-bold text-green-700">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden sticky top-4 self-start">
          <div className="bg-zinc-900 text-white p-4"><h5 className="font-semibold">Order Summary</h5></div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Shipping</span><span className="font-semibold">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span></div>
            <div className="border-t pt-3 flex justify-between"><span className="font-bold text-zinc-900">Total</span><span className="font-bold text-xl text-green-700">₹{total.toLocaleString()}</span></div>
            <button onClick={() => navigate('/checkout', { state: { cart } })} className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
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
  if (loading) return <section className="py-12 text-center"><div className="inline-block w-7 h-7 border-4 border-zinc-200 border-t-green-600 rounded-full animate-spin" /></section>;
  if (error || !distributors.length) return null;
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">Local Network</span>
          <h2 className="text-zinc-900 font-bold text-3xl lg:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Find a Distributor Near You</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {distributors.map(dist => (
            <div key={dist._id} className="group bg-white border border-zinc-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-zinc-900">{dist.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-zinc-400" /><span className="text-sm text-zinc-500">{dist.city}</span></div>
                </div>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />In Stock</span>
              </div>
              <div className="space-y-2 mb-5">
                <a href={`tel:${dist.phone}`} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-green-700 transition-colors"><Phone className="w-4 h-4 text-zinc-400" />{dist.phone}</a>
                <div className="flex justify-between text-sm"><span className="text-zinc-400">Stock</span><span className="font-semibold text-zinc-900">{dist.stock} units</span></div>
              </div>
              <a href={dist.locationUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200">
                <MapPin className="w-4 h-4" /> View on Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-8">Can't find one near you? <a href="/contact" className="text-green-700 font-semibold hover:text-green-900">Contact us</a> to become a distributor.</p>
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
  if (loading) return <section className="py-16 bg-zinc-50 text-center"><div className="inline-block w-8 h-8 border-4 border-zinc-200 border-t-green-600 rounded-full animate-spin" /></section>;
  if (!blogs.length) return null;
  return (
    <section className="py-16 lg:py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">From Our Kitchen</span>
            <h2 className="text-zinc-900 font-bold text-3xl lg:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Stories of Tradition &amp; Taste</h2>
          </div>
          <button onClick={() => navigate('/blogs')} className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 group flex-shrink-0">
            All stories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 6).map(blog => (
            <article key={blog._id} className="group bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate(`/blogs/${blog._id}`)}>
              <div className="relative aspect-video overflow-hidden bg-zinc-100">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-zinc-900 text-base leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{blog.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2">{blog.content?.substring(0, 100)}…</p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-50 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{blog.author || 'Dilkhush Family'}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/blogs')} className="inline-flex items-center gap-2 px-8 py-4 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-700 hover:text-white transition-all duration-200">
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
  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center"><div className="inline-block w-8 h-8 border-4 border-zinc-200 border-t-green-600 rounded-full animate-spin" /></div>;
  if (error || !blog) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <p className="text-red-600">{error || 'Blog not found'}</p>
      <button className="mt-4 bg-green-700 text-white px-5 py-2.5 rounded-xl" onClick={() => navigate('/blogs')}>Back to Blogs</button>
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/blogs')} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Back to Blogs
      </button>
      <article className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        {blog.image && <img src={blog.image} alt={blog.title} className="w-full aspect-video object-cover" />}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">{blog.title}</h1>
          <div className="flex gap-4 text-sm text-zinc-500 mb-6 pb-6 border-b">
            <span className="flex items-center gap-1"><User size={14} />{blog.author || 'Dilkhush Family'}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap">{blog.content}</div>
        </div>
      </article>
    </div>
  );
};

// ─── OrderFailed ──────────────────────────────────────────────────────────────
const OrderFailed = ({ errorMessage = "We couldn't process your payment. Please try again." }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-zinc-50">
      <div className="max-w-md w-full bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="bg-red-600 p-6 text-white text-center">
          <XCircle size={48} className="mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Order Failed</h1>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-red-700 text-sm bg-red-50 border border-red-100 rounded-xl p-4">{errorMessage}</p>
          <p className="text-center text-zinc-500 text-sm">Need help? Call 7874536227</p>
          <button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <RefreshCw size={16} /> Try Again
          </button>
          <div className="flex gap-2">
            <button onClick={() => navigate('/cart')} className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft size={15} /> Cart
            </button>
            <button onClick={() => navigate('/')} className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium py-2.5 rounded-xl transition-colors">Home</button>
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
  if (loading) return <div className="text-center py-20">Loading ingredients…</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-zinc-900 mb-8">Build Your Mix</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 grid md:grid-cols-2 gap-5">
          {ingredients.map(ing => (
            <div key={ing._id} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
              {ing.image && <img src={ing.image} className="w-full h-48 object-cover" />}
              <div className="p-5">
                <h5 className="font-bold text-zinc-900 mb-3">{ing.name} ({ing.category})</h5>
                <div className="space-y-2">
                  {ing.variants.map(v => (
                    <button key={v.quality} onClick={() => addIngredient(ing, v)} className="w-full bg-green-50 hover:bg-green-100 text-green-800 py-2 rounded-lg text-sm transition-colors text-left px-3">
                      <span className="font-semibold">{v.quality}</span>
                      <span className="text-xs text-zinc-500 ml-2">₹{v.pricePerKg}/kg · Min {v.minQuantity}{v.unit}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden sticky top-6 self-start">
          <div className="bg-green-700 text-white p-4">
            <h4 className="font-bold">Your Mix · ₹{totalPrice}</h4>
          </div>
          <div className="p-5 space-y-4">
            {selected.map((item, i) => (
              <div key={i} className="pb-3 border-b border-zinc-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm text-zinc-900">{item.name} ({item.variant})</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" min={item.minQty} value={item.quantity} onChange={e => updateQty(i, parseFloat(e.target.value))} className="w-16 px-2 py-1 border border-zinc-200 rounded-lg text-xs" />
                      <span className="text-xs text-zinc-500">{item.unit} = ₹{item.price}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(selected.filter((_, idx) => idx !== i))} className="text-zinc-300 hover:text-red-500 transition-colors">×</button>
                </div>
              </div>
            ))}
            <input placeholder="Name *" className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm" value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
            <input placeholder="Phone *" className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
            <input placeholder="Email" className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm" value={customerInfo.email} onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
            <button disabled={!selected.length} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-colors">
              PAY ₹{totalPrice} & PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
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
          <Route path="/" element={<><Navbars /><Slider /><ProductCard /><DistributorsSection /><Blog /><Footers /></>} />
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
