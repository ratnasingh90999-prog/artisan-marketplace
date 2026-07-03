import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all verified artisans
// @route   GET /api/artisans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const artisans = await User.find({ role: 'artisan', isVerified: true })
      .select('-password')
      .sort({ rating: -1 });
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get specific artisan details
// @route   GET /api/artisans/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const artisan = await User.findOne({ _id: req.params.id, role: 'artisan' })
      .select('-password');

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all products by a specific artisan
// @route   GET /api/artisans/:id/products
// @access  Public
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Follow/Unfollow an artisan
// @route   POST /api/artisans/:id/follow
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id);

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const userId = req.user._id;
    const isFollowing = artisan.followers.includes(userId);

    if (isFollowing) {
      // Unfollow
      artisan.followers = artisan.followers.filter(id => id.toString() !== userId.toString());
    } else {
      // Follow
      artisan.followers.push(userId);
    }

    artisan.followersCount = artisan.followers.length;
    await artisan.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      followersCount: artisan.followersCount,
      isFollowing: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get verification queue for admins
// @route   GET /api/artisans/admin/verification-queue
// @access  Private/Admin
router.get('/admin/verification-queue', protect, admin, async (req, res) => {
  try {
    const queue = await User.find({ role: 'artisan', isVerified: false })
      .select('-password')
      .sort({ createdAt: 1 });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify an artisan
// @route   PUT /api/artisans/admin/verify/:id
// @access  Private/Admin
router.put('/admin/verify/:id', protect, admin, async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id);

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    artisan.isVerified = true;
    await artisan.save();

    res.json({ message: 'Artisan verified successfully', artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
