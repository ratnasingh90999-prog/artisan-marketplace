import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { protect, artisan } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all products with filters, search, and sorting
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, rating, sort } = req.query;

    let query = {};

    // Search keyword in name, description, or story
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { story: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let apiQuery = Product.find(query).populate('artisan', 'name village avatar rating isVerified');

    // Sorting
    if (sort) {
      if (sort === 'price_asc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      } else {
        apiQuery = apiQuery.sort({ createdAt: -1 }); // default: newest
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artisan', 'name village avatar story achievements rating coverImage isVerified followersCount');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name avatar');
    res.json({ product, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private/Artisan
router.post('/', protect, artisan, async (req, res) => {
  const { name, description, story, price, category, images, materials, dimensions, inventory } = req.body;

  try {
    const product = new Product({
      name,
      description,
      story,
      price,
      category,
      images: images || ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'],
      artisan: req.user._id,
      materials: materials || [],
      dimensions,
      inventory: inventory || 5,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update product listing
// @route   PUT /api/products/:id
// @access  Private/Artisan
router.put('/:id', protect, artisan, async (req, res) => {
  const { name, description, story, price, category, images, materials, dimensions, inventory, availability } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (product.artisan.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.story = story || product.story;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.images = images || product.images;
    product.materials = materials || product.materials;
    product.dimensions = dimensions || product.dimensions;
    product.inventory = inventory !== undefined ? inventory : product.inventory;
    product.availability = availability !== undefined ? availability : product.availability;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private/Artisan
router.delete('/:id', protect, artisan, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (product.artisan.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = new Review({
      product: req.params.id,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Recalculate average rating
    const reviews = await Review.find({ product: req.params.id });
    product.reviewsCount = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
