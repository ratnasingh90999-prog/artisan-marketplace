import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, artisan } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new order (Checkout)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  try {
    let totalAmount = 0;
    const orderItems = [];

    // Verify inventory and calculate prices
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (product.inventory < item.quantity) {
        return res.status(400).json({ message: `Insufficient inventory for ${product.name}` });
      }

      // Deduct inventory
      product.inventory -= item.quantity;
      if (product.inventory === 0) {
        product.availability = false;
      }
      await product.save();

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'paid', // Simulate successful payment
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get artisan orders (orders containing the artisan's products)
// @route   GET /api/orders/seller/orders
// @access  Private/Artisan
router.get('/seller/orders', protect, artisan, async (req, res) => {
  try {
    // Find all products by this artisan
    const products = await Product.find({ artisan: req.user._id });
    const productIds = products.map(p => p._id.toString());

    // Find orders that contain any of these products
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .populate('items.product', 'name price images artisan');

    // Filter items to show only what belongs to this artisan (optional, but good for UI clarity)
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => 
        item.product && item.product.artisan && item.product.artisan.toString() === req.user._id.toString()
      );
      return orderObj;
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify permission (buyer, seller, or admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Artisan
router.put('/:id/status', protect, artisan, async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
