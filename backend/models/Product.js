import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  story: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['pottery', 'woodwork', 'handloom', 'jewelry', 'paintings', 'bamboo', 'leather', 'metal_crafts', 'other'],
  },
  images: [{
    type: String,
    default: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80']
  }],
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  materials: [{
    type: String,
  }],
  dimensions: {
    type: String,
  },
  inventory: {
    type: Number,
    required: true,
    default: 5,
    min: 0,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
