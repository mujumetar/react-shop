require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
}).catch(err => console.error('❌ MongoDB connection failed:', err));

const db = mongoose.connection;
db.on('connected', () => console.log('✅ MongoDB connected successfully.'));
db.on('error', (err) => console.error('❌ MongoDB connection error:', err));
db.on('disconnected', () => console.log('⚠️ MongoDB disconnected.'));

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Mongoose Schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
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
});
const Product = mongoose.model('Product', productSchema);

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
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
  status: { type: String, default: 'Pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
});
const User = mongoose.model('User', userSchema);

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5175', 'https://dilkhush-api.vercel.app', 'http://localhost:5174', 'http://localhost:5173'] }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Admin Routes
const adminRouter = express.Router();
adminRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    if (!name || !slug || !category || !price || !stock) {
      return res.status(400).json({ error: 'All required fields must be provided' });
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
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

adminRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(400).json({ error: error.message });
  }
});

adminRouter.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.img_url = `/Uploads/${req.file.filename}`;
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: error.message });
  }
});

adminRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(400).json({ error: error.message });
  }
});
app.use('/admin', adminRouter);

// Public Product Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Contact Routes
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting us!',
      text: `Dear ${name},\n\nThank you for your message: "${message}". We will get back to you soon.\n\nBest regards,\nYour E-Commerce Team`,
    };
    await transporter.sendMail(mailOptions).catch(err => {
      console.error('Error sending contact email:', err);
      throw new Error('Failed to send confirmation email');
    });
    res.status(201).json({ message: 'Contact submitted successfully' });
  } catch (err) {
    console.error('Error submitting contact:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

app.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Order Routes
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/orders', async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const { customerName, customerEmail, customerPhone, shippingAddress, billingAddress, products, notes } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !products || !Array.isArray(products)) {
      console.error('Invalid request data:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      console.error('Invalid email format:', customerEmail);
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.country) {
      console.error('Invalid shipping address:', shippingAddress);
      return res.status(400).json({ error: 'Complete shipping address is required' });
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const productDetails = [];
    for (const item of products) {
      console.log('Checking product:', item.productId);
      const product = await Product.findById(item.productId);
      if (!product) {
        console.error('Product not found:', item.productId);
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        console.error(`Insufficient stock for ${product.name}: Stock=${product.stock}, Requested=${item.quantity}`);
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      productDetails.push({ product: product._id, quantity: item.quantity });
    }

    // Create order
    const newOrder = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      products: productDetails,
      totalAmount,
      status: 'Pending',
      notes,
    });
    console.log('Saving order:', newOrder);
    await newOrder.save();

    // Send confirmation email
    let productDetailsStr = '';
    for (const item of productDetails) {
      const product = await Product.findById(item.product);
      productDetailsStr += `${product.name} - Quantity: ${item.quantity} - Price: ₹${product.price}\n`;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Order Confirmation - Your Purchase Was Successful!',
      text: `Dear ${customerName},\n\nThank you for your purchase!\n\nOrder Details:\nOrder ID: ${newOrder._id}\nTotal Amount: ₹${totalAmount}\n\nProducts:\n${productDetailsStr}\nShipping Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nYour E-Commerce Team`,
    };
    await transporter.sendMail(mailOptions).catch(err => {
      console.error('Error sending order confirmation email:', err);
      throw new Error('Failed to send confirmation email');
    });

    // Deduct stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (err) {
    console.error('Error submitting order:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});