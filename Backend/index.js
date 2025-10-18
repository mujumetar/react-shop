const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://dilkhush-kirana.vercel.app',
  'http://localhost:5173', // Allow local development
];


// CORS setup
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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


// Handle CORS preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  price: Number,
  stock: Number,
  description: String,
  img_url: String,
});
const Product = mongoose.model('Product', productSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/admin', async (req, res) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    let img_url = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(__dirname, 'Uploads', filename);
      await file.mv(filePath);
      img_url = `/Uploads/${filename}`;
    }
    const product = new Product({ name, slug, category, price, stock, description, img_url });
    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/admin/:id', async (req, res) => {
  try {
    const { name, slug, category, price, stock, description } = req.body;
    const updateData = { name, slug, category, price, stock, description };
    if (req.files && req.files.image) {
      const file = req.files.image;
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(__dirname, 'Uploads', filename);
      await file.mv(filePath);
      updateData.img_url = `/Uploads/${filename}`;
    }
    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/admin/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Contact message saved successfully' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
});

app.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, billingAddress, products, notes } = req.body;
    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    let totalAmount = 0;
    const orderProducts = products.map((p) => {
      const product = dbProducts.find((dbP) => dbP._id.toString() === p.productId);
      if (!product) throw new Error(`Product not found: ${p.productId}`);
      if (product.stock < p.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      totalAmount += product.price * p.quantity;
      return { productId: p.productId, quantity: p.quantity };
    });

    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
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
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, ${customerName}!</p>
        <p>Order ID: ${order._id.toString().slice(-8)}</p>
        <p>Total Amount: ₹${totalAmount}</p>
        <p>We will notify you once your order is shipped.</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error('Error submitting order:', err);
    res.status(500).json({ error: `Failed to create order: ${err.message}` });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));