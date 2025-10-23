import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import white from './img/white.jpeg';
import black from './img/black.jpeg';
import Navbars from "./components/Navbar";
import Footers from "./components/Footer";
import Slider from "./components/Slider";
import About from "./components/Aboutsect";

// Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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
          throw new Error(`Failed to fetch products: ${response.statusText}`);
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
      <div className="container mt-4" data-aos="fade-up">
        <h2 className="section-title text-center my-3">Products</h2>
        {loading && <p>Loading products...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {!loading && !error && products.length === 0 && <p>No products available</p>}
        <div className="row">
          {products.map((ele, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
              data-aos="fade-up"
              data-aos-duration="2000"
              key={ele._id || index}
            >
              <div className="product-card">
                <div className="product-image">
                  <img
                    src={ele.img_url ? `${import.meta.env.VITE_API_URL}${ele.img_url}` : imageMap.black}
                    alt={ele.name}
                    className="img-fluid"
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{ele.name || 'Unnamed Product'}</h3>
                  <p className="product-description">₹{ele.price || 0}</p>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#productModal"
                    onClick={() => openPage(ele)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAddToCart(ele)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Eachprod selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
    </>
  );
};

// Eachprod Component
const Eachprod = ({ selectedProduct, setSelectedProduct }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setSelectedProduct(null);
    navigate('/cart');
  };

  return (
    <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="productModalLabel">{selectedProduct.name}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedProduct(null)}></button>
          </div>
          <div className="modal-body">
            <p>Price: ₹{selectedProduct.price}</p>
            <p>{selectedProduct.description}</p>
            {selectedProduct.img_url && (
              <img src={`${import.meta.env.VITE_API_URL}${selectedProduct.img_url}`} alt={selectedProduct.name} className="img-fluid" />
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setSelectedProduct(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Component
const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2 className="section-title text-center my-3">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            {cart.map((item) => (
              <div className="col-md-6 mb-3" key={item.productId}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Price: ₹{item.price}</p>
                    <p className="card-text">
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        style={{ width: '60px', margin: '0 10px' }}
                      />
                    </p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h4 className="mt-3">Total: ₹{totalAmount}</h4>
          <button className="btn btn-primary mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit contact form');
      setSuccess('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
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
  const location = useLocation();
  const { cart } = location.state || {};

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
      alert('Your cart is empty. Please add products.');
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

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId } = await orderResponse.json();

      const razorpayResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/razorpay/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const razorpayOrder = await razorpayResponse.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Dilkhush Kirana',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async (paymentResponse) => {
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
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            alert('Payment successful!');
            navigate('/success', { state: { orderId } });
          },
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone,
          },
          theme: { color: '#3399cc' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        setLoading(false);
        alert('Failed to load payment gateway');
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
      setLoading(false);
    } finally {
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

// Blog Component
const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
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
                  src={blog.image ? `${import.meta.env.VITE_API_URL}${blog.image}` : 'https://via.placeholder.com/400x200'}
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
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`);
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.statusText}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.message);
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
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit comment');
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
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {success && <div className="alert alert-success mb-3">{success}</div>}
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
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
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.statusText}`);
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
            src={`${import.meta.env.VITE_API_URL}${blog.image}`}
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

// Blog Component
const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
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
                  src={blog.image ? `${import.meta.env.VITE_API_URL}${blog.image}` : 'https://via.placeholder.com/400x200'}
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
                <Footers />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <Navbars />
                <Productcard />
                <Footers />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbars />
                <About />
                <Footers />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbars />
                <Cart />
                <Footers />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbars />
                <Checkout />
                <Footers />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbars />
                <Contact />
                <Footers />
              </>
            }
          />
          <Route
            path="/blogs"
            element={
              <>
                <Navbars />
                <BlogPage />
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
                <Footers />
              </>
            }
          />
          <Route
            path="/success"
            element={
              <>
                <Navbars />
                <div className="container mt-4">
                  <h2>Order Placed Successfully!</h2>
                  <p>Thank you for your purchase. You will receive a confirmation email soon.</p>
                </div>
                <Footers />
              </>
            }
          />
          <Route
            path="/cancel"
            element={
              <>
                <Navbars />
                <div className="container mt-4">
                  <h2>Order Failed</h2>
                  <p>Something went wrong. Please try again.</p>
                </div>
                <Footers />
              </>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;