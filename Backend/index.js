require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

// Create uploads dir if not exists
const UPLOAD_DIR = path.join(__dirname, 'Uploads');
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

// Allowed origins
const ALLOWED_ORIGINS = [
  'https://dilkhush-kirana.vercel.app',
  'https://dilkhush-admin.vercel.app',
  'https://dilkhush-api.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Serve uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
}).then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Razorpay init
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Schemas
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
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
const Order = mongoose.model('Order', orderSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
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
  comments: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { versionKey: false });
const Blog = mongoose.model('Blog', blogSchema);

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Validation middleware for comment submission
const validateComment = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
];

// Utility: Send Order Confirmation Email
const sendOrderConfirmationEmail = async (order, totalAmount) => {
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
  await transporter.sendMail(mailOptions);
};

// Routes

// === Products ===
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/admin/products', upload.single('image'), async (req, res) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    if (!name || !slug || !category || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const product = new Product({
      name,
      slug,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      img_url: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/admin/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    const updateData = { name, slug, category, price: Number(price), stock: Number(stock), description };
    if (req.file) updateData.img_url = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/admin/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// === Contacts ===
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Contact message saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact message' });
  }
});

app.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.put('/admin/contacts/:id', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { name, email, message }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact updated successfully', contact });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/admin/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// === Orders ===
app.post('/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, billingAddress, products, notes } = req.body;
    const productIds = products.map(p => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    let totalAmount = 0;
    const orderProducts = products.map((p) => {
      const product = dbProducts.find((dbP) => dbP._id.toString() === p.productId);
      if (!product) throw new Error(`Product not found: ${p.productId}`);
      if (product.stock < p.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      totalAmount += product.price * p.quantity;
      return { product: product._id, quantity: p.quantity };
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
    });
    await order.save();

    // Update stock
    for (const p of products) {
      await Product.findByIdAndUpdate(p.productId, { $inc: { stock: -p.quantity } });
    }

    // Send email
    await sendOrderConfirmationEmail(order, totalAmount);

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error('Error submitting order:', err);
    res.status(500).json({ error: `Failed to create order: ${err.message}` });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.put('/admin/orders/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/admin/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// === Blogs ===
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

app.post('/admin/blogs', upload.single('image'), async (req, res) => {
  try {
    const { title, slug, content, author, tags } = req.body;
    if (!title || !slug || !content || !author) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const blog = new Blog({
      title,
      slug,
      content,
      author,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await blog.save();
    res.status(201).json({ message: 'Blog added successfully', blog });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to add blog' });
  }
});

app.put('/admin/blogs/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, slug, content, author, tags } = req.body;
    const updateData = { title, slug, content, author, tags: tags ? tags.split(',').map(tag => tag.trim()) : [] };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    updateData.updatedAt = Date.now();
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.delete('/admin/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// === Blog Comments ===
app.get('/blogs/:id/comments', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, 'comments').lean();
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog.comments || []);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/blogs/:id/comments', validateComment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, comment, createdAt } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const newComment = {
      name,
      email,
      comment,
      createdAt: createdAt || new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ _id: blog.comments[blog.comments.length - 1]._id });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// === Admin Authentication ===
app.post('/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'admin' });
    await user.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// === Razorpay Routes ===
app.post('/orders/:id/razorpay/create', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const options = {
      amount: Math.round(order.totalAmount * 100), // paise
      currency: 'INR',
      receipt: `receipt#${order._id}`,
    };
    const razorOrder = await razorpay.orders.create(options);
    order.razorpayOrderId = razorOrder.id;
    await order.save();
    res.json(razorOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

app.post('/orders/:id/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSignature === razorpay_signature) {
      order.status = 'Paid';
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});