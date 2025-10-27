import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import white from './img/white.jpeg';
import black from './img/black.jpeg';
import Navbars from "./components/Navbar";
import Footers from "./components/Footer";
import Slider from "./components/Slider";
import About from "./components/Aboutsect";
import OrderSuccess from "./components/pages/OrderSuccess"
import { ArrowLeft, ArrowLeftSquare, ArrowRight, Heart, Home, Minus, Package, Plus, RefreshCw, Share2, Shield, ShoppingBag, Star, Tag, Trash2, Truck, XCircle } from 'lucide-react';

// Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

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
        console.log('Fetched products:', data);
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
      <div className="container mt-4" data-aos="fade-up" >
        <h2 className="section-title text-center my-3">Products</h2>
        {loading && <p>Loading products...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {!loading && !error && products.length === 0 && <p>No products available</p>}
        <div className="row">
          {products.map((ele, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
              data-aos="fade-up"
              onClick={() => navigate(`/product/${ele._id}`)}
              data-aos-duration="2000"
              key={ele._id || index}
            >
              <div className="product-card">
                <div className="product-image">
                  <img
                    src={ele.img_url || imageMap.black} // Use Cloudinary URL directly or fallback
                    alt={ele.name}
                    className="img-fluid"
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{ele.name || 'Unnamed Product'}</h3>
                  <p className="product-description">₹{ele.price || 0}</p>

                  {/* <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAddToCart(ele)}
                  >
                    Add to Cart
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <Eachprod selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} /> */}
    </>
  );
};

// Eachprod Component
const ProductDetail = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.img_url);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();   // <-- Add this line

  if (!product) return null;

  const handleAddToCart = () => {
    // addToCart logic (will be passed from parent)
    for (let i = 0; i < quantity; i++) {
      window.dispatchEvent(new CustomEvent('addToCart', { detail: product }));
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
                    className="img-fluid rounded shadow-sm"
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
                    <button className="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center">
                      <Heart size={20} />
                    </button>
                    <button className="btn btn-outline-secondary btn-lg d-flex align-items-center justify-content-center">
                      <Share2 size={20} />
                    </button>
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
  const shipping = subtotal > 5000 ? 0 : 99;
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
            {subtotal >= 5000 ? (
              <>Free Shipping Unlocked!</>
            ) : (
              <>Add <span className="text-danger">₹{(5000 - subtotal).toLocaleString()}</span> more for FREE shipping</>
            )}
          </strong>
          <div className="progress mt-2" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
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
// Contact Component
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
    <div className="container mt-4">
      <h2 className="section-title text-center my-3">Contact Us</h2>
      <div className="card p-4">
        {success && <div className="alert alert-success">{success}</div>}
        {formErrors.submit && <div className="alert alert-danger">{formErrors.submit}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your message"
              rows="5"
            />
            {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
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
    if (!addr.zip.trim()) errors['shippingAddress.zip'] = 'Zip code is required';
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
      setError('Your cart is empty. Please add products.');
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
      console.log('Placing order with data:', orderData);
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const text = await orderResponse.text();
        console.error('Order creation failed:', text);
        throw new Error(`Failed to create order: ${orderResponse.status} ${orderResponse.statusText}`);
      }

      const { orderId } = await orderResponse.json();

      const razorpayResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/razorpay/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!razorpayResponse.ok) {
        const text = await razorpayResponse.text();
        console.error('Razorpay order creation failed:', text);
        throw new Error(`Failed to create payment order: ${razorpayResponse.status} ${orderResponse.statusText}`);
      }

      const razorpayOrder = await razorpayResponse.json();
      console.log('Razorpay order created:', razorpayOrder);

      // Ensure Razorpay script is loaded only once
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          console.log('Razorpay script loaded');
          openRazorpayCheckout(razorpayOrder, orderId);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          setError('Failed to load payment gateway');
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        openRazorpayCheckout(razorpayOrder, orderId);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
      setLoading(false);
    }
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
          console.log('Payment response:', paymentResponse);
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
          console.log('Payment verified:', verifyData);
          navigate('/success', { state: { orderId } });
        } catch (error) {
          console.error('Error verifying payment:', error);
          setError(error.message);
          navigate('/cancel');
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
          console.log('Razorpay modal dismissed');
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
                {['street', 'city', 'state', 'zip', 'country'].map((field) => (
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
        console.log('Fetching comments for blog ID:', blogId);
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
      console.log('Submitting comment for blog ID:', blogId, 'Data:', formData);
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
        console.log('Fetching blog with ID:', id);
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
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/blogs')}>
        Back to Blogs
      </button>
      <div className="card">
        {blog.image && (
          <img
            src={blog.image} // Use Cloudinary URL directly
            alt={blog.title}
            className="card-img-top"
            style={{ height: '300px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body">
          <h1 className="card-title">{blog.title}</h1>
          <div className="d-flex justify-content-between mb-3">
            <span className="text-muted">{blog.author || 'Anonymous'}</span>
            <span className="text-muted">{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="card-text">{blog.content}</p>
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-3">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-primary me-1">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <Comments blogId={id} />
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

// Blog Component
const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs from:', `${import.meta.env.VITE_API_URL}/blogs`);
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
    navigate(`/blogs/${blog._id}`);
  };

  return (
    <div className="container mt-4" data-aos="fade-up">
      <h2 className="section-title text-center my-3">Blog</h2>
      {loading && <p>Loading blogs...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && !error && blogs.length === 0 && <p>No blogs available</p>}
      <div className="row">
        {blogs.map((blog, index) => (
          <div
            className="col-lg-4 col-md-6 mb-4"
            data-aos="fade-up"
            data-aos-duration="2000"
            key={blog._id || index}
            onClick={() => handleViewDetails(blog)}
          >
            <div className="card h-100">
              <div className="card-img-top">
                <img
                  src={blog.image || 'https://via.placeholder.com/400x200'} // Use Cloudinary URL or placeholder
                  alt={blog.title}
                  className="img-fluid"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              </div>
              <div className="card-body">
                <h3 className="card-title">{blog.title || 'Untitled Blog'}</h3>
                <p className="card-text">{blog.content?.substring(0, 100)}...</p>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{blog.author || 'Anonymous'}</span>
                  <span className="text-muted">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-2">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-primary me-1">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <CartProvider>
      <Router>
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
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;