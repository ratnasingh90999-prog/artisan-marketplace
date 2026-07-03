import dns from 'dns'
dns.setServers(['1.1.1.1', '8.8.8.8']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Message from './models/Message.js';
import Order from './models/Order.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/artisan_marketplace';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Message.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing collections.');

    // 1. Seed Users (Admin, Artisans, Customers)
    const admin = await User.create({
      name: 'Aditi Sharma',
      email: 'admin@artisan.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    });

    const customer1 = await User.create({
      name: 'Rohan Mehta',
      email: 'buyer@artisan.com',
      password: 'password123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });

    const customer2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@artisan.com',
      password: 'password123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });

    // Seed Artisans
    const artisan1 = await User.create({
      name: 'Devappa Claycraft',
      email: 'devappa@artisan.com',
      password: 'password123',
      role: 'artisan',
      village: 'Channapatna, Karnataka',
      craftCategory: 'pottery',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1565192647048-f997ded87ab5?auto=format&fit=crop&w=1200&q=80',
      story: 'Devappa is a 5th-generation potter. In his small workshop, he uses local red clay and wood ash glazes. He seeks to preserve the organic texture and simple utility of traditional kitchenware while introducing modern shapes.',
      achievements: ['National Crafts Award 2021', 'Crafts Council Heritage Fellow'],
      rating: 4.9,
      isVerified: true,
      followersCount: 245,
    });

    const artisan2 = await User.create({
      name: 'Lata Devi Weaves',
      email: 'lata@artisan.com',
      password: 'password123',
      role: 'artisan',
      village: 'Pochampally, Telangana',
      craftCategory: 'handloom',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
      story: 'Lata Devi learned Ikat weaving from her grandmother. Using hand-operated looms and natural organic dyes, her creations represent months of careful preparation and dynamic visual geometry.',
      achievements: ['UNESCO Excellence Seal for Handicrafts', 'Best Women Artisan - state award'],
      rating: 4.8,
      isVerified: true,
      followersCount: 312,
    });

    const artisan3 = await User.create({
      name: 'Babu Lal Woodcarver',
      email: 'babulal@artisan.com',
      password: 'password123',
      role: 'artisan',
      village: 'Saharanpur, Uttar Pradesh',
      craftCategory: 'woodwork',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
      story: 'Babu Lal carves reclaimed teak wood and mango wood. His patterns reflect traditional Mughal architecture, focusing on intricate floral jaali (latticework) and tactile textures.',
      achievements: ['Pioneer Craftsman Recognition 2018'],
      rating: 4.7,
      isVerified: true,
      followersCount: 154,
    });

    const artisan4 = await User.create({
      name: 'Rambha Chitrakar',
      email: 'rambha@artisan.com',
      password: 'password123',
      role: 'artisan',
      village: 'Raghurajpur, Odisha',
      craftCategory: 'paintings',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&w=1200&q=80',
      story: 'Rambha preserves the heritage of Pattachitra scroll painting. Painting on cloth processed with chalk and tamarind seeds, she creates pigments from crushed seashells and local stones.',
      achievements: ['National Lalit Kala Akademi Award'],
      rating: 4.9,
      isVerified: true,
      followersCount: 420,
    });

    console.log('Seeded Users.');

    // 2. Seed Products
    const products = [
      {
        name: 'Terracotta Ash-Glazed Pitcher',
        description: 'A beautifully balanced pitcher hand-thrown using local terracotta clay. Features a rustic, ash-glazed finish that keeps water naturally cool.',
        story: 'Handcrafted on a kickwheel in Devappa’s garden workshop, this pitcher is modeled after 3rd-century vessels excavated nearby. The natural firing gives each pitcher a slightly unique charcoal shade.',
        price: 48.00,
        category: 'pottery',
        images: [
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan1._id,
        materials: ['Terracotta Red Clay', 'Wood Ash Glaze'],
        dimensions: '8" H x 6" W',
        inventory: 6,
      },
      {
        name: 'Fluted Earthy Serving Bowl',
        description: 'An elegant, organic clay serving bowl featuring fine hand-carved fluted grooves on the exterior.',
        story: 'Devappa designed this bowl to celebrate family gatherings. The clay is harvested from dry riverbeds, processed by hand, and pit-fired for 12 hours.',
        price: 36.00,
        category: 'pottery',
        images: [
          'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan1._id,
        materials: ['Riverbed Clay', 'Natural Ochre Dye'],
        dimensions: '10" Diameter x 4" Depth',
        inventory: 8,
      },
      {
        name: 'Hand-woven Pochampally Ikat Silk Saree',
        description: 'A luxurious, soft silk saree hand-woven using double Ikat dyeing techniques. Features striking geometric patterns and a golden zari border.',
        story: 'Taking over three weeks to set up on the handloom, Lata Devi ties and dyes each silk thread individually before weaving. The design represents geometric rain clouds, symbolizing prosperity.',
        price: 180.00,
        category: 'handloom',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan2._id,
        materials: ['Mulberry Silk', 'Natural Indigo Dye', 'Zari Threads'],
        dimensions: '6.5 Yards',
        inventory: 2,
      },
      {
        name: 'Indigo Dyed Linen Throw Blanket',
        description: 'A lightweight, soft linen throw block-printed with natural indigo plant dye. Perfect for organic homes.',
        story: 'Woven on Lata Devi’s traditional shuttle looms, this throw is dyed in a multi-decade old indigo vat. The slightly uneven dye layers tell the story of authentic fermentation.',
        price: 65.00,
        category: 'handloom',
        images: [
          'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan2._id,
        materials: ['Pure Flax Linen', 'Fermented Indigo Plant'],
        dimensions: '60" x 50"',
        inventory: 4,
      },
      {
        name: 'Carved Teak Lattice Storage Box',
        description: 'An exquisite storage chest crafted from reclaimed teak wood, featuring hand-carved floral lattice panels.',
        story: 'Babu Lal collected teak beams from discarded old houses to make this chest. The intricate carving details represent the Mughal patterns of his ancestral village.',
        price: 95.00,
        category: 'woodwork',
        images: [
          'https://images.unsplash.com/photo-1590486803833-ffc6f68d8b12?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan3._id,
        materials: ['Reclaimed Teak Wood', 'Natural Beeswax Polish'],
        dimensions: '12" L x 8" W x 6" H',
        inventory: 3,
      },
      {
        name: 'Hand-Turned Mango Wood Fruit Bowl',
        description: 'A large, heavy serving bowl highlighting the beautiful natural grain of mango wood.',
        story: 'Babu Lal turned this piece on a traditional manual lathe. The bark has been preserved along the rim, reflecting the natural organic shape of the branch.',
        price: 52.00,
        category: 'woodwork',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan3._id,
        materials: ['Mango Wood', 'Food-safe Mineral Oil'],
        dimensions: '12" W x 5" H',
        inventory: 7,
      },
      {
        name: 'Tree of Life Pattachitra Painting',
        description: 'An intricate painting depicting the Tree of Life with nesting birds and deer, painted on hand-processed cotton canvas.',
        story: 'Rambha spent 45 hours painting this piece under sunlight. She prepares the canvas by coating cloth with a paste of tamarind seeds and chalk, giving it a leather-like texture that endures for centuries.',
        price: 150.00,
        category: 'paintings',
        images: [
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan4._id,
        materials: ['Processed Cotton Canvas', 'Natural Stone Pigments', 'Shell Pigments'],
        dimensions: '18" x 24"',
        inventory: 1,
      },
      {
        name: 'Brass Filigree Medallion Necklace',
        description: 'An elegant statement necklace with a handcrafted brass filigree pendant suspended on cotton thread.',
        story: 'Handcrafted by our partner metal workers, this design incorporates traditional hollow-form wirework passed down through generations.',
        price: 75.00,
        category: 'jewelry',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
        ],
        artisan: artisan3._id,
        materials: ['Pure Brass', 'Waxed Cotton Cord'],
        dimensions: '2" Pendant, 18" Cord',
        inventory: 10,
      }
    ];

    const seededProducts = await Product.insertMany(products);
    console.log('Seeded Products.');

    // 3. Seed Reviews
    await Review.create({
      product: seededProducts[0]._id, // Terracotta Pitcher
      user: customer1._id,
      rating: 5,
      comment: 'Absolutely stunning craftsmanship. The water tastes slightly sweet and stays beautifully cool. It has become the centerpiece of my dining table.',
    });

    await Review.create({
      product: seededProducts[0]._id, // Terracotta Pitcher
      user: customer2._id,
      rating: 4,
      comment: 'Very solid and feels heavy. The ash glaze has lovely gradients. Shipping took a week but it was packed extremely securely in straw.',
    });

    await Review.create({
      product: seededProducts[2]._id, // Ikat Saree
      user: customer2._id,
      rating: 5,
      comment: 'A true heirloom piece. The silk feels heavy and luxurious, and the geometric precision is mind-blowing. Thank you Lata Devi!',
    });

    // Update Product statistics for seeded items
    for (const prod of seededProducts) {
      const reviews = await Review.find({ product: prod._id });
      if (reviews.length > 0) {
        prod.reviewsCount = reviews.length;
        prod.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await prod.save();
      }
    }
    console.log('Seeded Reviews and updated ratings.');

    // 4. Seed Messages
    await Message.create({
      sender: customer1._id,
      recipient: artisan1._id,
      text: 'Hello Devappa, I wanted to ask if you can customize the clay pitcher with a larger handle? I have large hands.',
      read: true,
    });

    await Message.create({
      sender: artisan1._id,
      recipient: customer1._id,
      text: 'Namaskar Rohan! Yes, I can certainly shape the next batch with a wider handle loop for you. It will take about 10 days to make and fire it.',
      read: false,
    });

    await Message.create({
      sender: customer2._id,
      recipient: artisan2._id,
      text: 'Hi Lata, is it possible to get the Indigo throw in a larger size for a king bed?',
      read: true,
    });

    console.log('Seeded Messages.');

    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
