import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import white from './img/white.jpeg';
import black from './img/black.jpeg';
import Navbars from "./components/Navbar"
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

// Navbars Component
const Navbar= () => (
  <Navbars/>
);

// Footer Component
const Footer = () => (
  <footer className="bg-light text-center py-3">
    <p>&copy; 2025 Your Shop. All rights reserved.</p>
  </footer>
);

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
        const response = await fetch('https://dilkhush-api-49h6.onrender.com/products');
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
                    src={ele.img_url ? `https://dilkhush-api.vercel.app${ele.img_url}` : imageMap.black}
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
              <img src={`https://dilkhush-api.vercel.app${selectedProduct.img_url}`} alt={selectedProduct.name} className="img-fluid" />
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
      const response = await fetch('https://dilkhush-api-49h6.onrender.com/contact', {
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
      console.error('No cart provided');
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    const orderData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: formData.shippingAddress,
      billingAddress: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress,
      products: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      notes: formData.notes,
    };
    console.log('Sending order data:', orderData);

    try {
      const response = await fetch('https://dilkhush-api-49h6.onrender.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status} - ${responseData.error || response.statusText}`);
      }

      alert('Order placed successfully!');
      navigate('/success', { state: { orderId: responseData.orderId } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error.message}`);
      navigate('/cancel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="section-title text-center my-3">Checkout</h2>
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
            <div className="mb-3">
              <label htmlFor="shippingAddress.street" className="form-label">Street</label>
              <input
                type="text"
                className={`form-control ${formErrors['shippingAddress.street'] ? 'is-invalid' : ''}`}
                id="shippingAddress.street"
                name="shippingAddress.street"
                value={formData.shippingAddress.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
              />
              {formErrors['shippingAddress.street'] && <div className="invalid-feedback">{formErrors['shippingAddress.street']}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="shippingAddress.city" className="form-label">City</label>
              <input
                type="text"
                className={`form-control ${formErrors['shippingAddress.city'] ? 'is-invalid' : ''}`}
                id="shippingAddress.city"
                name="shippingAddress.city"
                value={formData.shippingAddress.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
              {formErrors['shippingAddress.city'] && <div className="invalid-feedback">{formErrors['shippingAddress.city']}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="shippingAddress.state" className="form-label">State</label>
              <input
                type="text"
                className={`form-control ${formErrors['shippingAddress.state'] ? 'is-invalid' : ''}`}
                id="shippingAddress.state"
                name="shippingAddress.state"
                value={formData.shippingAddress.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
              {formErrors['shippingAddress.state'] && <div className="invalid-feedback">{formErrors['shippingAddress.state']}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="shippingAddress.zip" className="form-label">Zip Code</label>
              <input
                type="text"
                className={`form-control ${formErrors['shippingAddress.zip'] ? 'is-invalid' : ''}`}
                id="shippingAddress.zip"
                name="shippingAddress.zip"
                value={formData.shippingAddress.zip}
                onChange={handleInputChange}
                placeholder="Enter zip code"
              />
              {formErrors['shippingAddress.zip'] && <div className="invalid-feedback">{formErrors['shippingAddress.zip']}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="shippingAddress.country" className="form-label">Country</label>
              <input
                type="text"
                className={`form-control ${formErrors['shippingAddress.country'] ? 'is-invalid' : ''}`}
                id="shippingAddress.country"
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleInputChange}
                placeholder="Enter country"
              />
              {formErrors['shippingAddress.country'] && <div className="invalid-feedback">{formErrors['shippingAddress.country']}</div>}
            </div>
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
                <div className="mb-3">
                  <label htmlFor="billingAddress.street" className="form-label">Street</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors['billingAddress.street'] ? 'is-invalid' : ''}`}
                    id="billingAddress.street"
                    name="billingAddress.street"
                    value={formData.billingAddress.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                  />
                  {formErrors['billingAddress.street'] && <div className="invalid-feedback">{formErrors['billingAddress.street']}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="billingAddress.city" className="form-label">City</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors['billingAddress.city'] ? 'is-invalid' : ''}`}
                    id="billingAddress.city"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                  {formErrors['billingAddress.city'] && <div className="invalid-feedback">{formErrors['billingAddress.city']}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="billingAddress.state" className="form-label">State</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors['billingAddress.state'] ? 'is-invalid' : ''}`}
                    id="billingAddress.state"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                  />
                  {formErrors['billingAddress.state'] && <div className="invalid-feedback">{formErrors['billingAddress.state']}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="billingAddress.zip" className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors['billingAddress.zip'] ? 'is-invalid' : ''}`}
                    id="billingAddress.zip"
                    name="billingAddress.zip"
                    value={formData.billingAddress.zip}
                    onChange={handleInputChange}
                    placeholder="Enter zip code"
                  />
                  {formErrors['billingAddress.zip'] && <div className="invalid-feedback">{formErrors['billingAddress.zip']}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="billingAddress.country" className="form-label">Country</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors['billingAddress.country'] ? 'is-invalid' : ''}`}
                    id="billingAddress.country"
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                  />
                  {formErrors['billingAddress.country'] && <div className="invalid-feedback">{formErrors['billingAddress.country']}</div>}
                </div>
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
                <Productcard />
                <Footer />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbars />
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbars />
                <Checkout />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbars />
                <Contact />
                <Footer />
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
                <Footer />
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
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;