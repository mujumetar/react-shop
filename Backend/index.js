// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const helmet = require('helmet');
const morgan = require('morgan');

// Create uploads dir if not exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// App init
const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Allowed origins (comma-separated env or defaults)
const defaultAllowed = [
  'https://dilkhush-kirana.vercel.app',
  'https://dilkhush-admin.vercel.app',
];
const envAllowed = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : [];
const ALLOWED_ORIGINS = [...defaultAllowed, ...envAllowed];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.match(/^http:\/\/localhost:\d+$/) ||
      origin === 'https://dilkhush-kirana.vercel.app' ||
      origin === 'https://dilkhush-admin.vercel.app') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
// app.use(cors({ origin: '*' }));
// Serve uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI is not set in environment variables');
  process.exit(1);
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
}).then(() => {
  console.log('✅ MongoDB connected successfully.');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
});

// Nodemailer transporter
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ EMAIL_USER or EMAIL_PASS is not set — email sending will fail.');
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter at startup (non-blocking)
transporter.verify()
  .then(() => console.log('✅ Email transporter verified.'))
  .catch(err => console.warn('⚠️ Email transporter verify failed:', err.message || err));

// Razorpay init
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️ Razorpay keys not set. Payment endpoints will fail.');
}
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ======= Schemas & Models =======
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  description: { type: String },
  img_url: { type: String },
  images: [{ type: String }],
  ratings: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String },
  }],
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
const Product = mongoose.model('Product', productSchema);

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
const Contact = mongoose.model('Contact', contactSchema);

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  billingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Paid, Shipped, Cancelled, etc.
  notes: { type: String },
  payment: {
    method: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
const Order = mongoose.model('Order', orderSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ideally hashed outside or before save
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  phone: { type: String },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });
const Blog = mongoose.model('Blog', blogSchema);

// ======= Multer Setup =======
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpeg|jpg|png|webp)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// ======= Utilities =======
function sendOrderConfirmationEmail(order, totalAmount) {
  if (!transporter) return Promise.resolve();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customerEmail,
    subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order, ${order.customerName}!</p>
      <p>Order ID: ${order._id.toString().slice(-8)}</p>
      <p>Total Amount: ₹${totalAmount}</p>
      <p>We will notify you once your order is shipped.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
}

// ======= Routes =======

// --- Product Admin ---
app.post('/admin/products', upload.single('image'), async (req, res, next) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    if (!name || !slug || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields: name, slug, category, price' });
    }

    const product = new Product({
      name,
      slug,
      category,
      price: Number(price),
      stock: Number(stock || 0),
      description,
      img_url: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(409).json({ error: 'Product slug already exists' });
    }
    next(err);
  }
});

app.get('/products', async (req, res, next) => {
  try {
    // Simple query params: ?category= & ?limit= & ?search=
    const q = {};
    if (req.query.category) q.category = req.query.category;
    if (req.query.search) q.name = { $regex: req.query.search, $options: 'i' };

    const limit = parseInt(req.query.limit, 10) || 100;
    const products = await Product.find(q).limit(limit);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.put('/admin/products/:id', upload.single('image'), async (req, res, next) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (description) updateData.description = description;
    if (req.file) updateData.img_url = `/uploads/${req.file.filename}`;
    updateData.updatedAt = Date.now();

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(409).json({ error: 'Product slug already exists' });
    }
    next(err);
  }
});

app.delete('/admin/products/:id', async (req, res, next) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// --- Contact ---
app.post('/contact', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Contact message saved successfully', contact });
  } catch (err) {
    next(err);
  }
});

app.get('/contact', async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

// --- Orders: create & list & single & update status ---
// NOTE: clients send `products: [{ productId, quantity }]`
app.post('/orders', async (req, res, next) => {
  try {
    const {
      customerName, customerEmail, customerPhone,
      shippingAddress, billingAddress, products, notes, paymentMethod,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const productIds = products.map(p => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    const orderProducts = products.map((p) => {
      const product = dbProducts.find(dbP => dbP._id.toString() === p.productId);
      if (!product) throw new Error(`Product not found: ${p.productId}`);
      if (product.stock < p.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      totalAmount += product.price * p.quantity;
      return { product: product._id, quantity: Number(p.quantity) };
    });

    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      products: orderProducts,
      totalAmount,
      notes,
      status: paymentMethod === 'offline' ? 'Pending' : 'Pending',
      payment: { method: paymentMethod || 'unknown' },
    });

    await order.save();

    // Update stock
    const bulkOps = products.map(p => ({
      updateOne: {
        filter: { _id: p.productId },
        update: { $inc: { stock: -Math.max(0, Number(p.quantity)) } },
      },
    }));
    if (bulkOps.length > 0) await Product.bulkWrite(bulkOps);

    // Send confirmation email (best-effort)
    try {
      await sendOrderConfirmationEmail(order, totalAmount);
    } catch (mailErr) {
      console.warn('⚠️ Failed to send order confirmation email:', mailErr.message || mailErr);
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id, totalAmount });
  } catch (err) {
    console.error('Error submitting order:', err);
    // Return user-friendly message but include err.message for debugging
    res.status(500).json({ error: `Failed to create order: ${err.message}` });
  }
});

app.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find().populate('products.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

app.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

app.put('/orders/:id', async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes) update.notes = notes;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// --- Razorpay Integration ---
// Create razorpay order (amount in rupees)
app.post('/orders/:id/razorpay/create', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // amount in paise
    const amountPaise = Math.round(order.totalAmount * 100);

    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: order._id.toString(),
      payment_capture: 1, // auto-capture
    };

    const razorOrder = await razorpay.orders.create(options);
    // Save razorpay order id on our order record (for later verification)
    order.payment = {
      ...order.payment,
      razorpayOrderId: razorOrder.id,
      method: 'razorpay',
    };
    await order.save();

    res.json({ razorOrder, order });
  } catch (err) {
    next(err);
  }
});

// Verify razorpay payment (client should POST payment_id, order_id, signature)
app.post('/orders/:id/razorpay/verify', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required verification fields' });
    }

    // Compute expected signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Mark order as paid
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'Paid';
    order.payment = {
      ...order.payment,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      method: 'razorpay',
    };
    await order.save();

    // send confirmation email (best-effort)
    try {
      await sendOrderConfirmationEmail(order, order.totalAmount);
    } catch (mailErr) {
      console.warn('⚠️ Failed to send payment confirmation email:', mailErr.message || mailErr);
    }

    res.json({ message: 'Payment verified and order marked as Paid', order });
  } catch (err) {
    next(err);
  }
});

// --- Blog routes ---
app.get('/blogs', async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

app.post('/admin/blogs', upload.single('image'), async (req, res, next) => {
  try {
    const { title, slug, content, author, tags } = req.body;
    if (!title || !slug || !content || !author) return res.status(400).json({ error: 'Missing fields' });

    const blog = new Blog({
      title,
      slug,
      content,
      author,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.length ? tags.split(',').map(t => t.trim()) : []),
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog added successfully', blog });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(409).json({ error: 'Blog slug already exists' });
    }
    next(err);
  }
});

app.put('/admin/blogs/:id', upload.single('image'), async (req, res, next) => {
  try {
    const { title, slug, content, author, tags } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (tags) {
      updateData.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);
    }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    updateData.updatedAt = Date.now();

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Blog not found' });

    res.json({ message: 'Blog updated successfully', blog: updated });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(409).json({ error: 'Blog slug already exists' });
    }
    next(err);
  }
});

app.delete('/admin/blogs/:id', async (req, res, next) => {
  try {
    const removed = await Blog.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
});

app.get('/blogs/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

// ======= Global error handler =======
app.use((err, req, res, next) => {
  console.error('Global error:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    // remove stack trace in production — exposed here for debugging
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
