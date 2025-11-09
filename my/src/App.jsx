import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import white from './img/white.jpeg';
import black from './img/black.jpeg';
import Navbars from "./components/Navbar";
import Footers from "./components/Footer";
import Slider from "./components/Slider";
import About from "./components/Aboutsect";
import OrderSuccess from "./components/pages/OrderSuccess"
import { TermsPage, PrivacyPage, RefundPage } from './components/pages/privacy-policy';
import { ArrowLeft, ArrowLeftSquare, ArrowRight, Heart, Home, MessageSquare, Minus, Package, Plus, RefreshCw, Send, Share2, Shield, ShoppingBag, Star, Tag, Trash2, Truck, XCircle } from 'lucide-react';
import {
  Clock, CheckCircle, Package as PackageIcon,
  MapPin, Calendar, IndianRupee, User, Phone, Mail
} from 'lucide-react';
import contains from "./img/contains.png"
import Eachprod from './components/pages/Eachprod';
import GlobalLoader from './GlobalLoader';
// Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedOrders = localStorage.getItem('orders');
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedAddresses) setSavedAddresses(JSON.parse(storedAddresses));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.img_url }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  };

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
      tracking: null,
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();

    // Save address for reuse
    const addrKey = `${order.customerEmail}-${order.shippingAddress.street}`;
    if (!savedAddresses.find(a => a.key === addrKey)) {
      setSavedAddresses((prev) => [...prev, {
        key: addrKey,
        name: order.customerName,
        email: order.customerEmail,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress || order.shippingAddress,
      }]);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      orders, placeOrder, updateOrderStatus,
      savedAddresses
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
export { CartProvider, useCart };
const MyOrders = () => {
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    const map = {
      ordered: { Icon: Clock, color: 'text-warning' },
      confirmed: { Icon: PackageIcon, color: 'text-info' },
      shipped: { Icon: Truck, color: 'text-primary' },
      delivered: { Icon: CheckCircle, color: 'text-success' },
    };
    const { Icon, color } = map[status] || map.ordered;
    return <Icon className={color} size={20} />;
  };

  const getNextStatus = (current) => {
    const flow = ['ordered', 'confirmed', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <PackageIcon size={80} className="text-muted mb-3" />
        <h3>No orders yet</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-3">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="display-6 fw-bold mb-4">My Orders</h2>
      <div className="row g-4">
        {orders.map((order) => (
          <div key={order._id} className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold">#{order.orderId}</h5>
                    <p className="text-muted small">
                      <Calendar size={14} className="me-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-end">
                    {getStatusIcon(order.status)}
                    <span className="badge bg-light text-dark ms-2 text-capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-top pt-3 mb-3">
                  <p className="mb-1"><strong>Total:</strong> ₹{order.total}</p>
                  <p className="mb-1 text-muted small">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                  <p className="mb-0 text-muted small">
                    <MapPin size={14} className="me-1" />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>

                {getNextStatus(order.status) && (
                  <button
                    onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                    className="btn btn-sm btn-outline-success w-100 mb-2"
                  >
                    Mark as {getNextStatus(order.status)}
                  </button>
                )}

                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="btn btn-link w-100 mt-2"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();

  const order = orders.find(o => o._id === id);
  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
        <button onClick={() => navigate('/orders')} className="btn btn-primary mt-3">
          Back to Orders
        </button>
      </div>
    );
  }

  const statusFlow = [
    { status: 'ordered', label: 'Order Placed', Icon: Clock },
    { status: 'confirmed', label: 'Confirmed', Icon: PackageIcon },
    { status: 'shipped', label: 'Shipped', Icon: Truck },
    { status: 'delivered', label: 'Delivered', Icon: CheckCircle },
  ];

  const currentIdx = statusFlow.findIndex(s => s.status === order.status);
  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1].status : null;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary me-3">
          <ArrowLeft size={20} />
        </button>
        <h2 className="mb-0">Order #{order.orderId}</h2>
      </div>

      <div className="row g-4">
        {/* Tracking Timeline */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Tracking</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                {statusFlow.map((step, idx) => {
                  const active = idx <= currentIdx;
                  const current = idx === currentIdx;
                  return (
                    <div key={step.status} className="d-flex align-items-center mb-4">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center me-3
                          ${active ? 'bg-primary text-white' : 'bg-light text-muted'} 
                          ${current ? 'border border-primary border-3' : ''}`}
                        style={{ width: 48, height: 48 }}
                      >
                        <step.Icon size={22} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className={`mb-0 ${active ? 'fw-bold' : 'text-muted'}`}>
                          {step.label}
                        </h6>
                        {idx < statusFlow.length - 1 && (
                          <div
                            className={`border-start ms-3 ps-3 ${idx < currentIdx ? 'border-primary' : 'border-light'}`}
                            style={{ height: 40 }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {nextStatus && (
                <button
                  onClick={() => updateOrderStatus(order._id, nextStatus)}
                  className="btn btn-success w-100 mt-4"
                >
                  Mark as {statusFlow.find(s => s.status === nextStatus)?.label}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <p><strong>Status:</strong> <span className="text-capitalize">{order.status}</span></p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Items:</strong> {order.items.length}</p>
              <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

              <hr />

              <h6 className="fw-bold">Shipping Address</h6>
              <p className="small">
                {order.shippingAddress.street},<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}<br />
                {order.shippingAddress.country}
              </p>

              <h6 className="fw-bold mt-3">Customer</h6>
              <p className="small">
                <User size={14} className="me-1" /> {order.customerName}<br />
                <Mail size={14} className="me-1" /> {order.customerEmail}<br />
                <Phone size={14} className="me-1" /> {order.customerPhone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Items</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image || 'https://via.placeholder.com/60'}
                          alt={item.name}
                          className="me-3 rounded"
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                        <div>
                          <strong>{item.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">₹{item.price}</td>
                    <td className="text-end">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};



const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// ──────────────────────────────────────────────────────────────
// ORDER TRACKING PAGE - Enter Order ID → See Live Status
// ──────────────────────────────────────────────────────────────

const TrackOrder = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  // AUTO READ FROM URL ?order=XXX
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlOrderId = params.get("order");
    if (urlOrderId) {
      setOrderId(urlOrderId);
      handleTrack(urlOrderId);
    }
  }, [location]);

  const handleTrack = async (id = orderId) => {
    if (!id.trim()) {
      setError("Please enter Order ID");
      return;
    }

    setSearching(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`);
      if (!res.ok) throw new Error("Order not found");

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError("Order not found. Please check your Order ID.");
    } finally {
      setSearching(false);
    }
  };

  const statusFlow = [
    { status: "ordered", label: "Order Placed", icon: Clock, color: "text-warning" },
    { status: "confirmed", label: "Confirmed", icon: PackageIcon, color: "text-info" },
    { status: "shipped", label: "Shipped", icon: Truck, color: "text-primary" },
    { status: "delivered", label: "Delivered", icon: CheckCircle, color: "text-success" },
  ];

  const currentStatus = order?.status || "ordered";
  const currentIdx = statusFlow.findIndex((s) => s.status === currentStatus);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Search Box */}
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-gradient-primary text-white text-center py-4">
              <Truck size={40} className="mb-3" />
              <h2 className="mb-0 fw-bold">Track Your Order</h2>
              <p className="mb-0 opacity-90">Enter your Order ID to see live status</p>
            </div>
            <div className="card-body p-5">
              <div className="input-group input-group-lg mb-3">
                <input
                  type="text"
                  className="form-control border-primary shadow-sm"
                  placeholder="e.g. ORD-2025-001 or 69104af8db77bdca89b0a6ba"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                />
                <button
                  className="btn btn-primary px-5"
                  onClick={() => handleTrack()}
                  disabled={searching}
                >
                  {searching ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Searching...
                    </>
                  ) : (
                    "Track"
                  )}
                </button>
              </div>
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <XCircle size={20} className="me-2" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Order Found */}
          {order && (
            <div className="mt-5">
              <div className="text-center mb-5">
                <h1 className="display-6 fw-bold text-success">
                  Order Found!
                </h1>
                <p className="lead text-muted">
                  Order ID: <strong>{order.orderId || order._id}</strong>
                </p>
              </div>

              {/* Tracking Timeline */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h4 className="mb-4 text-primary">
                    <PackageIcon className="me-2" />
                    Order Status
                  </h4>
                  <div className="timeline position-relative">
                    {statusFlow.map((step, idx) => {
                      const isActive = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      const Icon = step.icon;

                      return (
                        <div key={step.status} className="d-flex align-items-center mb-4 position-relative">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0
                              ${isActive ? "bg-primary text-white" : "bg-light text-muted"}
                              ${isCurrent ? "shadow-lg border border-4 border-white" : ""}
                            `}
                            style={{ width: 56, height: 56, zIndex: 1 }}
                          >
                            <Icon size={26} />
                          </div>

                          <div className="ms-4 flex-grow-1">
                            <h6 className={`mb-1 ${isActive ? "fw-bold text-dark" : "text-muted"}`}>
                              {step.label}
                            </h6>
                            <small className={isActive ? step.color : "text-muted"}>
                              {isCurrent && "In Progress"}
                              {idx < currentIdx && "Completed"}
                            </small>
                          </div>

                          {idx < statusFlow.length - 1 && (
                            <div
                              className="position-absolute top-0 start-0 translate-middle-x ms-3"
                              style={{
                                width: "4px",
                                height: "60px",
                                backgroundColor: idx < currentIdx ? "#0d6efd" : "#e9ecef",
                                left: "28px",
                                top: "56px",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-muted small">
                  Ordered on: <strong>{new Date(order.createdAt).toLocaleString()}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0d6efd, #6610f2) !important;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 28px;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #e9ecef;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

// Productcard Component
const Productcard = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // console.log('Fetched products:', data);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openPage = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate('/cart');
  };

  const imageMap = { white, black };

  return (
    <>
      <div className="container-fluid py-5 bg-light">
        <div className="container">
          {/* Header Section */}
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-3">
              <span className="text-primary">Our</span> Products
            </h2>
            <p className="lead text-muted mb-4">
              Discover our curated collection of premium products
            </p>
            <div className="mx-auto" style={{ width: '80px', height: '4px', background: 'linear-gradient(to right, #0d6efd, #6610f2)', borderRadius: '50px' }}></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5" data-aos="fade-up">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted fw-semibold">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger shadow-sm border-0 rounded-4" role="alert" data-aos="fade-up">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
                <div>
                  <h5 className="alert-heading mb-1">Error Loading Products</h5>
                  <p className="mb-0">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5" data-aos="fade-up">
              <div className="mb-4">
                <i className="bi bi-box-seam fs-1 text-muted"></i>
              </div>
              <h4 className="text-muted">No products available</h4>
              <p className="text-muted">Check back soon for new arrivals!</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="row g-4">
              {products.map((ele, index) => (
                <div
                  className="col-lg-4 col-md-6 col-sm-6"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={index * 50}
                  key={ele._id || index}
                >
                  <div
                    className="card border-0 shadow-sm h-100 product-card-hover"
                    onClick={() => navigate(`/product/${ele._id}`)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: '1rem',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 1rem 3rem rgba(0,0,0,0.175)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
                    }}
                  >
                    {/* Image Container */}
                    <div
                      className="position-relative overflow-hidden bg-light"
                      style={{
                        height: '280px',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                      }}
                    >
                      <img
                        src={ele.img_url || imageMap.black}
                        alt={ele.name}
                        className="w-100 h-100 object-fit-cover"
                        style={{
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />

                      {/* Overlay Badge */}
                      <div
                        className="position-absolute top-0 start-0 m-3"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.parentElement.querySelector('.hover-overlay').style.opacity = '1';
                        }}
                      >
                        <span className="badge bg-white text-dark shadow-sm">
                          <i className="bi bi-heart text-danger"></i>
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div
                        className="position-absolute bottom-0 start-0 end-0 hover-overlay"
                        style={{
                          height: '100%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      ></div>

                      {/* Quick View Button (appears on hover) */}
                      <div
                        className="position-absolute top-50 start-50 translate-middle quick-view-btn"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <button className="btn btn-light btn-sm rounded-pill shadow">
                          <i className="bi bi-eye me-2"></i>See more
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold mb-2 text-truncate" style={{ fontSize: '1.1rem' }}>
                        {ele.name || 'Unnamed Product'}
                      </h5>

                      {/* Price */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="mb-0 fw-bold" style={{
                          background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          ₹{ele.price || 0}
                        </h4>
                        <div className="text-muted small">
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-half text-warning"></i>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary rounded-pill fw-semibold"
                          style={{
                            background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
                            border: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${ele._id}`);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(13,110,253,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card Footer (Optional - for additional info) */}
                    {/* <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
                      <div className="d-flex justify-content-between align-items-center text-muted small">
                        <span><i className="bi bi-truck me-1"></i> 5 ⭐⭐⭐⭐⭐</span>
                        <span><i className="bi bi-shield-check me-1"></i>200+ orders</span>
                      </div>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
      .product-card-hover:hover .hover-overlay,
      .product-card-hover:hover .quick-view-btn {
        opacity: 1 !important;
      }
      
      .card {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      }
      
      .object-fit-cover {
        object-fit: cover;
      }
    `}</style>
    </>
  );
};

// Eachprod Component
const ProductDetail = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.img_url);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();   // <-- Add this line
  const { addToCart } = useCart();
  if (!product) return null;
  const handleAddToCart = () => {
    // Use context instead of event
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    navigate('/cart');
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const averageRating = 4.5;
  const totalReviews = 128;

  return (
    <>
      <div className='container'>
        {/* Toast */}
        {showToast && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
            <div className="toast show align-items-center text-white bg-success border-0">
              <div className="d-flex">
                <div className="toast-body">
                  <ShoppingBag size={18} className="me-2" />
                  {quantity} × {product.name} added to cart!
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setShowToast(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container-fluid py-4 py-md-5">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={onClose}
              className="btn text-decoration-none d-flex align-items-center p-2"
            >
              <ArrowLeft size={20} className="me-2 " />
              Back to Products
            </button>
          </div>

          <div className="row g-4 g-xl-5">
            {/* Image Gallery */}
            <div className="col-lg-6">
              <div className="sticky-top" style={{ top: '1rem' }}>
                <div className="mb-3">
                  <img
                    src={selectedImage || 'https://via.placeholder.com/600'}
                    alt={product.name}
                    className="img-fluid rounded shadow-sm "
                    style={{ height: '500px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* <div className="d-flex gap-2 flex-wrap">
                  {[product.img_url, 'https://via.placeholder.com/150?text=2', 'https://via.placeholder.com/150?text=3'].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className={`rounded cursor-pointer ${selectedImage === img ? 'border border-primary border-3' : 'border'}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div> */}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className="h-100 d-flex flex-column">
                <div className="mb-4">
                  <h1 className="display-5 fw-bold mb-3">{product.name}</h1>

                  {/* Rating */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.floor(averageRating) ? 'text-warning fill-warning' : 'text-muted'}
                        />
                      ))}
                    </div>
                    <span className="text-muted small">
                      {averageRating} ({totalReviews} reviews)
                    </span>
                  </div>

                  <div className="d-flex-align-items-baseline mb-4">
                    <h2 className="text-primary me-3">₹{product.price?.toLocaleString()}</h2>
                    <del className="text-muted">₹{(product.price * 1.3).toFixed(0)}</del>
                    <span className="badge bg-success ms-2">23% OFF</span>
                  </div>

                  <p className="lead text-muted">
                    {product.description || 'High-quality product with premium materials. Perfect for daily use.'}
                  </p>
                </div>

                {/* Quantity */}
                <div className="mb-4">

                  {/* <div className="d-flex align-items-center mb-3">
                    <span className="me-3 fw-semibold">Quantity:</span>
                    <div className="input-group" style={{ width: '150px' }}>
                      <button className="btn btn-outline-secondary" onClick={decrement}>
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        className="form-control text-center fw-bold"
                        value={quantity}
                        readOnly
                      />
                      <button className="btn btn-outline-secondary" onClick={increment}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="ms-3 fw-semibold">In KGs</span>
                  </div> */}

                  <div className="d-grid d-md-flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="btn btn-primary btn-lg flex-grow-1 d-flex align-items-center justify-content-center"
                    >
                      <ShoppingBag className="me-2" size={20} />
                      Add to Cart
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-lg d-flex align-items-center justify-content-center"
                      onClick={async () => {
                        const url = window.location.href; // current page URL
                        const shareData = {
                          title: `🔥 ${product.name} is a must-have! 🔥`,
                          text: `✨ Your next favorite purchase is here: ${product.name} ✨\nGrab it now 👉 ${url}`,
                          url,
                        };

                        try {
                          if (navigator.share) {
                            await navigator.share(shareData);
                            // console.log('Product shared successfully');
                          } else {
                            // Fallback: copy link to clipboard
                            await navigator.clipboard.writeText(url);
                            alert('Link copied to clipboard!');
                          }
                        } catch (err) {
                          console.error('Error sharing:', err);
                        }
                      }}
                    >
                      <Share2 size={20} className="me-1" /> Share
                    </button>
                  </div>
                  <div className=" my-5">

                    {/* <div>
                      <marquee className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" behavior="" direction="">  <b>25 years of trust</b></marquee>
                      <marquee behavior="" direction="">   <b>we belive in quality not in quantity</b></marquee>
                      <p> <b>Latest Products</b>
                        <br />
                        {product.name} kachariyu/saani


                        <ul>
                          <li> No added flavours.</li>
                          <li> No harmful Chemicals.</li>
                          <li>Best for winters.</li>
                          <li> No additional colours.</li>
                          <li>  100% natural and healthy.</li>
                          <li> Healthy for everyone ☺️.</li>
                        </ul>
                      </p>
                      <b> It contains</b>
                      <img className="img-fluid" src={contains} alt="" />

                      <b>✅ Health Review</b>
                      <br />
                      Energy-dense (~474 kcal per 100 g) → great for winters, boosts energy.
                      <br />
                      Balanced macros → Carbs from jaggery + healthy fats & protein from sesame.
                      <br />
                      Rich in minerals → especially Calcium (good for bones), Iron (blood health), Magnesium, and Potassium.
                      <br />
                      Fiber content (6 g/100 g) → supports digestion.
                      <br />
                      Antioxidants → Sesamin & sesamolin from sesame + minerals from jaggery.
                      <br />
                      <b>🏆 Why This Mixture is Powerful</b>
                      <br />
                      Gives instant energy (from jaggery).
                      <br />
                      Provides long-lasting satiety & strength (from sesame protein & fats).
                      <br />
                      Traditional wisdom = perfect winter superfood 🌿.
                    </div> */}
                    {/* Trust Banner */}
                    <div className="alert alert-success text-center mb-4" role="alert">
                      <strong>🏆 25 years of trust</strong> | We believe in quality, not in quantity
                    </div>

                    {/* Product Header */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-body">
                        <h2 className="card-title text-primary mb-3">
                          {/* <span className="badge bg-primary me-2">Latest</span> */}
                          {product.name} Kachariyu/Saani
                        </h2>

                        {/* Key Features */}
                        <div className="row g-3">
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item">✓ No added flavours</li>
                              <li className="list-group-item">✓ No harmful chemicals</li>
                              <li className="list-group-item">✓ Best for winters</li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item">✓ No additional colours</li>
                              <li className="list-group-item">✓ 100% natural and healthy</li>
                              <li className="list-group-item">✓ Healthy for everyone ☺️</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-success text-white">
                        <h4 className="mb-0">📦 It Contains</h4>
                      </div>
                      <div className="card-body text-center">
                        <img className="img-fluid rounded" src={contains} alt="Product ingredients" />
                      </div>
                    </div>

                    {/* Health Review */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-info text-white">
                        <h4 className="mb-0">✅ Health Review</h4>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-lg-6">
                            <div className="p-3 border rounded bg-light">
                              <strong>⚡ Energy-dense</strong>
                              <p className="mb-0 small">~474 kcal per 100g - great for winters, boosts energy</p>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="p-3 border rounded bg-light">
                              <strong>⚖️ Balanced macros</strong>
                              <p className="mb-0 small">Carbs from jaggery + healthy fats & protein from sesame</p>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="p-3 border rounded bg-light">
                              <strong>💎 Rich in minerals</strong>
                              <p className="mb-0 small">Calcium (bones), Iron (blood), Magnesium, Potassium</p>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="p-3 border rounded bg-light">
                              <strong>🌾 Fiber content</strong>
                              <p className="mb-0 small">6g/100g - supports healthy digestion</p>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="p-3 border rounded bg-light">
                              <strong>🛡️ Antioxidants</strong>
                              <p className="mb-0 small">Sesamin & sesamolin from sesame + minerals from jaggery</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Why This Mixture is Powerful */}
                    <div className="card shadow-sm border-warning">
                      <div className="card-header bg-warning">
                        <h4 className="mb-0">🏆 Why This Mixture is Powerful</h4>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex align-items-start">
                            <span className="badge bg-success me-3 mt-1">1</span>
                            <div>
                              <strong>Instant Energy</strong>
                              <p className="mb-0 text-muted">Quick energy boost from natural jaggery</p>
                            </div>
                          </div>
                          <div className="list-group-item d-flex align-items-start">
                            <span className="badge bg-success me-3 mt-1">2</span>
                            <div>
                              <strong>Long-lasting Satiety & Strength</strong>
                              <p className="mb-0 text-muted">From sesame protein & healthy fats</p>
                            </div>
                          </div>
                          <div className="list-group-item d-flex align-items-start">
                            <span className="badge bg-success me-3 mt-1">3</span>
                            <div>
                              <strong>Traditional Wisdom</strong>
                              <p className="mb-0 text-muted">Perfect winter superfood 🌿</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

    </>
  );
};


// Cart Component

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const discount = 0; // You can add coupon logic later
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  const increment = (id) => {
    const item = cart.find(i => i.productId === id);
    updateQuantity(id, item.quantity + 1);
  };

  const decrement = (id) => {
    const item = cart.find(i => i.productId === id);
    if (item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: 120, height: 120 }}>
          <ShoppingBag size={60} className="text-primary" />
        </div>
        <h3 className="mb-3">Your cart is empty</h3>
        <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary btn-lg px-5">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <h2 className="text-center mb-4 fw-bold text-primary">Your Cart</h2>

      {/* Free Shipping Alert */}
      <div className="alert alert-success d-flex align-items-center mb-4 shadow-sm rounded">
        <Truck className="me-3" size={24} />
        <div>
          <strong>
            {subtotal >= 1000 ? (
              <>Free Shipping Unlocked!</>
            ) : (
              <>Add <span className="text-danger">₹{(1000 - subtotal).toLocaleString()}</span> more for FREE shipping</>
            )}
          </strong>
          <div className="progress mt-2" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            {cart.map((item) => (
              <div key={item.productId} className="card-body border-bottom">
                <div className="row align-items-center g-3">
                  {/* Product Image */}
                  <div className="col-4 col-md-3 col-lg-2">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="img-fluid rounded shadow-sm"
                      style={{ height: 90, objectFit: 'cover' }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="col-8 col-md-9 col-lg-10">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1 fw-bold">{item.name}</h6>
                        <p className="text-muted small mb-0">₹{item.price.toLocaleString()} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Quantity & Total */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="input-group" style={{ width: '140px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => decrement(item.productId)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="text"
                          className="form-control text-center fw-bold"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => increment(item.productId)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-end">
                        <p className="text-muted small mb-0">Item Total</p>
                        <h5 className="text-primary mb-0">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between py-2">
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString()}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between py-2 text-success">
                  <span>Discount</span>
                  <strong>-₹{discount.toLocaleString()}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between py-2">
                  <span>Shipping</span>
                  <strong>
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </strong>
                </li>
              </ul>

              <div className="border-top pt-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total</h5>
                  <h4 className="text-primary mb-0">₹{total.toLocaleString()}</h4>
                </div>
                <small className="text-muted">Inclusive of all taxes</small>
              </div>

              {/* Coupon Input */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                />
                <button className="btn btn-outline-primary" type="button">
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight className="ms-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border"></div></div>;
  if (!product) return <div className="container py-5 text-center"><h3>Product not found</h3></div>;

  return <ProductDetail product={product} onClose={() => navigate(-1)} />;
};



const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setLoading(true);
    try {
      // Replace with your actual API URL
      const apiUrl = 'https://api.example.com';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Failed to submit contact form: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setSuccess('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />

      <style>{`
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .contact-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 40px 15px;
        }

        .contact-header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }

        .contact-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .contact-header p {
          font-size: 1.1rem;
          opacity: 0.95;
        }

        .contact-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 50px;
          border: none;
        }

        .form-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .input-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px 0 0 10px;
          border: 2px solid #e0e0e0;
          border-right: none;
        }

        .form-control, .form-select {
          border: 2px solid #e0e0e0;
          padding: 12px 15px;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .input-group .form-control {
          border-left: none;
          border-radius: 0 10px 10px 0;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .input-group:focus-within .input-icon {
          border-color: #667eea;
        }

        .input-group:focus-within .form-control {
          border-color: #667eea;
        }

        .form-control.is-invalid {
          border-color: #dc3545;
        }

        .input-group .form-control.is-invalid {
          border-color: #dc3545;
        }

        .input-group:has(.is-invalid) .input-icon {
          border-color: #dc3545;
          background: #dc3545;
        }

        .btn-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 14px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.3s ease;
          width: 100%;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert {
          border-radius: 10px;
          border: none;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .alert-success {
          background-color: #d4edda;
          color: #155724;
        }

        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }

        .footer-text {
          text-align: center;
          color: white;
          margin-top: 20px;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .contact-card {
            padding: 30px 20px;
          }
          
          .contact-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="contact-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="contact-header">
                <h2>Get In Touch</h2>
                <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              </div>

              <div className="card contact-card">
                {success && (
                  <div className="alert alert-success mb-4">
                    <i className="fas fa-check-circle"></i>
                    <span>{success}</span>
                  </div>
                )}

                {formErrors.submit && (
                  <div className="alert alert-danger mb-4">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{formErrors.submit}</span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-icon">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {formErrors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-icon">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {formErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">
                      Your Message
                    </label>
                    <div className="input-group">
                      <span className="input-icon align-items-start pt-3">
                        <i className="fas fa-comment"></i>
                      </span>
                      <textarea
                        className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us what's on your mind..."
                        rows="5"
                      />
                      {formErrors.message && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {formErrors.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <i className="fas fa-paper-plane ms-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="footer-text">
                <i className="fas fa-clock me-2"></i>
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};




// Checkout Component
const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: { street: '', city: '', state: '', zip: '', country: '' },
    billingAddress: { street: '', city: '', state: '', zip: '', country: '' },
    useSameAddress: true,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart } = state || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('shippingAddress.') || name.includes('billingAddress.')) {
      const [prefix, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [prefix]: { ...prev[prefix], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      useSameAddress: checked,
      billingAddress: checked ? prev.shippingAddress : { street: '', city: '', state: '', zip: '', country: '' },
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone.trim()) errors.customerPhone = 'Phone is required';
    const addr = formData.shippingAddress;
    if (!addr.street.trim()) errors['shippingAddress.street'] = 'Street is required';
    if (!addr.city.trim()) errors['shippingAddress.city'] = 'City is required';
    if (!addr.state.trim()) errors['shippingAddress.state'] = 'State is required';
    if (!addr.zip.trim()) errors['shippingAddress.zip'] = 'Pin code is required';
    if (!addr.country.trim()) errors['shippingAddress.country'] = 'Country is required';
    if (!formData.useSameAddress) {
      const billAddr = formData.billingAddress;
      if (!billAddr.street.trim()) errors['billingAddress.street'] = 'Street is required';
      if (!billAddr.city.trim()) errors['billingAddress.city'] = 'City is required';
      if (!billAddr.state.trim()) errors['billingAddress.state'] = 'State is required';
      if (!billAddr.zip.trim()) errors['billingAddress.zip'] = 'Zip code is required';
      if (!billAddr.country.trim()) errors['billingAddress.country'] = 'Country is required';
    }
    return errors;
  };



  const placeOrder = async () => {
    if (!cart || cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: formData.shippingAddress,
      billingAddress: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress,
      products: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      notes: formData.notes,
    };

    try {
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) throw new Error('Order failed');
      const { orderId } = await orderResponse.json();

      const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      const trackingUrl = `${window.location.origin}/track-order?order=${orderId}`;

      const sendSMS = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/sms/fast2sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: formData.customerPhone,
            orderId,
            total,
            trackingUrl
          })
        });
      };
      // console.log(data)
      sendSMS(); // Auto SMS after order created

      // Razorpay
      const razorpayResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/razorpay/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!razorpayResponse.ok) throw new Error('Payment failed');
      const razorpayOrder = await razorpayResponse.json();

      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => openRazorpayCheckout(razorpayOrder, orderId);
        document.body.appendChild(script);
      } else {
        openRazorpayCheckout(razorpayOrder, orderId);
      }

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const Checkout = () => {
    const { cart, placeOrder, savedAddresses } = useCart();
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [formData, setFormData] = useState({
      customerName: '', customerEmail: '', customerPhone: '',
      shippingAddress: { street: '', city: '', state: '', zip: '', country: '' },
      billingAddress: { street: '', city: '', state: '', zip: '', country: '' },
      useSameAddress: true,
    });

    // Auto-fill from saved address
    useEffect(() => {
      if (selectedAddress) {
        setFormData(prev => ({
          ...prev,
          customerName: selectedAddress.name,
          customerEmail: selectedAddress.email,
          shippingAddress: selectedAddress.shippingAddress,
          billingAddress: selectedAddress.billingAddress,
          useSameAddress: selectedAddress.shippingAddress.street === selectedAddress.billingAddress.street,
        }));
      }
    }, [selectedAddress]);

    const handleSubmit = () => {
      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      placeOrder({
        ...formData,
        items: cart,
        total,
      });
      navigate('/success');
    };

    return (
      <div className="container py-4">
        <h2>Checkout</h2>

        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="card mb-4 border-primary">
            <div className="card-body">
              <h5 className="text-primary mb-3">
                <Shield className="me-2" /> Use Saved Address
              </h5>
              <div className="row g-3">
                {savedAddresses.map((addr) => (
                  <div key={addr.key} className="col-md-6">
                    <div
                      className={`p-3 border rounded cursor-pointer hover-shadow ${selectedAddress?.key === addr.key ? 'border-primary bg-primary text-white' : 'bg-light'}`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <strong>{addr.name}</strong>
                      <br />
                      <small>
                        {addr.shippingAddress.city}, {addr.shippingAddress.state}
                        {selectedAddress?.key === addr.key && " (Selected)"}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form continues as before... */}
        {/* ... your existing form fields ... */}
        <button onClick={handleSubmit} className="btn btn-success">Place Order</button>
      </div>
    );
  };
  const openRazorpayCheckout = (razorpayOrder, orderId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Dilkhush Kirana',
      description: 'Order Payment',
      order_id: razorpayOrder.id,
      handler: async (paymentResponse) => {
        try {
          // console.log('Payment response:', paymentResponse);
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/razorpay/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            const text = await verifyResponse.text();
            console.error('Payment verification failed:', text);
            throw new Error(`Payment verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`);
          }

          const verifyData = await verifyResponse.json();
          // console.log('Payment verified:', verifyData);
          navigate('/success', {
            state: {
              orderId,
              orderData: {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                shippingAddress: formData.shippingAddress,
                billingAddress: formData.useSameAddress
                  ? formData.shippingAddress
                  : formData.billingAddress,
                cartItems: cart.map((item) => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
                totalAmount: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
                notes: formData.notes,
              },
            },
          });

        } catch (error) {
          console.error('Error verifying payment:', error);
          setError(error.message);
          navigate('/success', {
            state: {
              orderId,
              orderData: {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                shippingAddress: formData.shippingAddress,
                billingAddress: formData.useSameAddress
                  ? formData.shippingAddress
                  : formData.billingAddress,
                cartItems: cart.map((item) => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
                totalAmount: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
                notes: formData.notes,
              },
            },
          });


        }
      },
      prefill: {
        name: formData.customerName,
        email: formData.customerEmail,
        contact: formData.customerPhone,
      },
      theme: { color: '#3399cc' },
      modal: {
        ondismiss: () => {
          // console.log('Razorpay modal dismissed');
          setLoading(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
        navigate('/cancel');
      });
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay checkout:', error);
      setError('Failed to open payment gateway');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="section-title text-center my-3">Checkout</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {!cart || cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <h4>Order Summary</h4>
          {cart.map((item) => (
            <div key={item.productId} className="mb-2">
              <p>{item.name} - ₹{item.price} x {item.quantity}</p>
            </div>
          ))}
          <h5>Total: ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h5>

          <h4 className="mt-4">Customer Details</h4>
          <div className="card p-4 mb-4">
            <div className="mb-3">
              <label htmlFor="customerName" className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${formErrors.customerName ? 'is-invalid' : ''}`}
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              {formErrors.customerName && <div className="invalid-feedback">{formErrors.customerName}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="customerEmail" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${formErrors.customerEmail ? 'is-invalid' : ''}`}
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {formErrors.customerEmail && <div className="invalid-feedback">{formErrors.customerEmail}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="customerPhone" className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control ${formErrors.customerPhone ? 'is-invalid' : ''}`}
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {formErrors.customerPhone && <div className="invalid-feedback">{formErrors.customerPhone}</div>}
            </div>
            <h5>Shipping Address</h5>
            {['street', 'city', 'state', 'zip', 'country'].map((field) => (
              <div className="mb-3" key={field}>
                <label htmlFor={`shippingAddress.${field}`} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors[`shippingAddress.${field}`] ? 'is-invalid' : ''}`}
                  id={`shippingAddress.${field}`}
                  name={`shippingAddress.${field}`}
                  value={formData.shippingAddress[field]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                />
                {formErrors[`shippingAddress.${field}`] && (
                  <div className="invalid-feedback">{formErrors[`shippingAddress.${field}`]}</div>
                )}
              </div>
            ))}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="useSameAddress"
                checked={formData.useSameAddress}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="useSameAddress">
                Use same address for billing
              </label>
            </div>
            {!formData.useSameAddress && (
              <>
                <h5>Billing Address</h5>
                {['street', 'city', 'state', 'Pin Code', 'country'].map((field) => (
                  <div className="mb-3" key={field}>
                    <label htmlFor={`billingAddress.${field}`} className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors[`billingAddress.${field}`] ? 'is-invalid' : ''}`}
                      id={`billingAddress.${field}`}
                      name={`billingAddress.${field}`}
                      value={formData.billingAddress[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field}`}
                    />
                    {formErrors[`billingAddress.${field}`] && (
                      <div className="invalid-feedback">{formErrors[`billingAddress.${field}`]}</div>
                    )}
                  </div>
                ))}
              </>
            )}
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
              <textarea
                className={`form-control ${formErrors.notes ? 'is-invalid' : ''}`}
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions?"
                rows="3"
              />
              {formErrors.notes && <div className="invalid-feedback">{formErrors.notes}</div>}
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading || !cart || cart.length === 0}
            className="btn btn-primary"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
};

// Comments Component
const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!blogId || !/^[0-9a-fA-F]{24}$/.test(blogId)) {
        console.error('Invalid blog ID:', blogId);
        setError('Invalid blog ID');
        return;
      }
      setLoading(true);
      try {
        // console.log('Fetching comments for blog ID:', blogId);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [blogId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.comment.trim()) errors.comment = 'Comment is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (!blogId || !/^[0-9a-fA-F]{24}$/.test(blogId)) {
      setError('Invalid blog ID');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // console.log('Submitting comment for blog ID:', blogId, 'Data:', formData);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Failed to submit comment: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setComments((prev) => [...prev, { ...formData, createdAt: new Date().toISOString(), _id: data._id }]);
      setFormData({ name: '', email: '', comment: '' });
      setSuccess('Comment submitted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h4 className="mb-3">Comments</h4>
      {loading && <p>Loading comments...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {success && <div className="alert alert-success mb-3">{success}</div>}
      {!loading && !error && comments.length === 0 && (
        <p>No comments yet. Be the first to comment!</p>
      )}
      {!loading && comments.length > 0 && (
        <div className="mb-4">
          {comments.map((comment, index) => (
            <div key={comment._id || index} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title">{comment.name}</h6>
                  <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
                <p className="card-text">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <h5 className="mb-3">Leave a Comment</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="commentName" className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
            id="commentName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
          {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="commentEmail" className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            id="commentEmail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="commentText" className="form-label">Comment</label>
          <textarea
            className={`form-control ${formErrors.comment ? 'is-invalid' : ''}`}
            id="commentText"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Enter your comment"
            rows="4"
          />
          {formErrors.comment && <div className="invalid-feedback">{formErrors.comment}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

// Blog Details Component
const BlogDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        console.error('Invalid blog ID:', id);
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }
      try {
        // console.log('Fetching blog with ID:', id);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error(`Failed to fetch blog: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="container mt-4"><p>Loading blog...</p></div>;
  }

  if (error || !blog) {
    return (
      <div className="container mt-4">
        <p className="text-danger">{error || 'Blog not found'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/blogs')}>
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <button
          className="btn btn-outline-primary d-flex justify-content-between align-items-center "
          onClick={() => navigate('/blogs')}
        >
          <ArrowLeft size={20} className='me-2' />
          Back to Blogs
        </button>
      </nav>

      {/* Main Blog Card */}
      <article className="card shadow-sm border-0 mb-4">
        {blog.image && (
          <div className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
            <img
              src={blog.image}
              alt={blog.title}
              className="card-img-top w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white p-3">
              {blog.tags && blog.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-primary rounded-pill px-3 py-2">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card-body p-4 p-md-5">
          {/* Title */}
          <h1 className="display-5 fw-bold mb-4">{blog.title}</h1>

          {/* Meta Information */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4 pb-4 border-bottom">
            <div className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <small className="text-muted d-block">Written by</small>
                <strong>{blog.author || 'Anonymous'}</strong>
              </div>
            </div>

            <div className="vr d-none d-md-block"></div>

            <div className="d-flex align-items-center">
              <i className="bi bi-calendar3 text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Published on</small>
                <strong>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</strong>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="blog-content">
            <p className="lead fs-5 lh-lg text-dark" style={{ whiteSpace: 'pre-wrap' }}>
              {blog.content}
            </p>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="mb-4">
            <i className="bi bi-chat-left-text me-2"></i>
            Comments
          </h3>
          <Comments blogId={id} />
        </div>
      </div>
    </div>
  );
};


// failde order components 

const OrderFailed = ({ errorMessage = "We couldn't process your payment. Please try again." }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header - Red Gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-pulse">
            <XCircle size={48} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Order Failed</h1>
          <p className="text-red-100 mt-2 text-sm">Something went wrong with your payment</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm leading-relaxed">
              <strong>Error:</strong> {errorMessage}
            </p>
          </div>

          <div className="text-center text-gray-600 text-sm">
            <p>Don't worry — no money was charged.</p>
            <p className="mt-1">You can try again or contact support.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw size={18} />
              Try Again
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/cart')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Cart
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-100 hover:bg-gray- ág-200 text-gray-800 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Home
              </button>
            </div>
          </div>

          {/* Support Info */}
          <div className="border-t pt-4 text-center">
            <p className="text-xs text-gray-500">
              Need help?{' '}
              <a href="mailto:support@yoursite.com" className="text-red-600 hover:underline font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
};



const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate()
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Replace with your actual API URL
        // const apiUrl = 'https://api.example.com';
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleViewDetails = (blog) => {
    // Replace with your navigation logic
    console.log('Navigate to:', `/blogs/${blog._id}`);
    // navigate(`/blogs/${blog._id}`);
  };

  return (
    <>


      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-primary mb-3">Our Blogs</h2>
            <p className="lead text-secondary">Discover insights, stories, and updates from our team</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 fs-5 text-primary fw-semibold">Loading amazing content...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-5">
              <i className="fas fa-exclamation-circle text-danger mb-3" style={{ fontSize: '4rem' }}></i>
              <div className="alert alert-danger d-inline-block" role="alert">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '5rem' }}></i>
              <p className="fs-4 text-muted fw-semibold">No blogs available</p>
            </div>
          )}

          {/* Blog Grid */}
          <div className="row g-4">
            {blogs.map((blog, index) => (
              <div
                className="col-lg-4 col-md-6 rounded-4"
                key={blog._id || index}
              >
                <div
                  className="card shadow-sm border-0 rounded-4 overflow-hidden"
                  onClick={() => handleViewDetails(blog)}
                  style={{ cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                  }}
                >
                  {/* Image */}
                  <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                    <img
                      src={blog.image || 'https://via.placeholder.com/400x250'}
                      alt={blog.title}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold text-dark mb-3" style={{
                      fontSize: '1.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.title || 'Untitled Blog'}
                    </h5>

                    <p className="card-text text-muted mb-4" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.content?.substring(0, 100)}...
                    </p>

                    {/* Meta Info */}
                    <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                      <div className="d-flex align-items-center text-primary">
                        <i className="fas fa-user-circle me-2"></i>
                        <small className="fw-semibold">{blog.author || 'Anonymous'}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-calendar-alt me-2"></i>
                        <small>{new Date(blog.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && (
                      <div className="d-flex flex-wrap gap-2">
                        {(() => {
                          let tags = [];
                          try {
                            tags = typeof blog.tags === "string" ? JSON.parse(blog.tags) : blog.tags;
                          } catch {
                            tags = blog.tags.split(",").map(t => t.trim());
                          }

                          return Array.isArray(tags) && tags.length > 0 ? (
                            tags.map((tag, idx) => (
                              <span key={idx} className="badge bg-primary rounded-pill px-3 py-2">
                                {tag}
                              </span>
                            ))
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
                    <button className="btn btn-outline-primary w-100 rounded-4 fw-semibold">
                      Read More <ArrowRight size={15} onClick={() => navigate(`/blogs/${blog._id}`)}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


// Main App Component
function App() {
  return (
    <CartProvider>
      <Router>
      <GlobalLoader/>
      <ScrollToTop/>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbars />
                <Slider />
                <Productcard />
                <Blog />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <Navbars />
                <Productcard />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbars />
                <About />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbars />
                <Cart />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route path="/orders" element={<><Navbars /><MyOrders /><Footers /></>} />
          <Route path="/order/:id" element={<><Navbars />
            {/* <OrderDetails /> */}
            <Footers /></>} />
          <Route
            path="/checkout"
            element={
              <>
                <Navbars />
                <Checkout />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbars />
                <Contact />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/blogs"
            element={
              <>
                <Navbars />
                <Blog />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/offers"
            element={
              <>
                <Navbars />
                {/* <Blog /> */}
                {/* <Offerspage/> */}
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/product/:id"
            element={
              <>
                <Navbars />
                <ProductDetailWrapper />
                <Footers />
              </>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <>
                <Navbars />
                <BlogDetails />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route
            path="/success"
            element={
              <>
                <Navbars />
                <OrderSuccess />
                <div className="container mt-4">
                  <h2>Order Placed Successfully!</h2>
                  <p>Thank you for your purchase. You will receive a confirmation email soon.</p>
                </div>
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route path="/track-order" element={<><Navbars /><TrackOrder /><Footers /></>} />
          <Route
            path="/cancel"
            element={
              <>
                <Navbars />
                <OrderFailed />
                <div className="">
                  <Footers />
                </div>

              </>
            }
          />
          <Route path="/terms-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;