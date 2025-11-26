const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const categories = [
  { name: 'Vegetables', slug: 'vegetables', icon: '🥬' },
  { name: 'Fruits', slug: 'fruits', icon: '🍎' },
  { name: 'Rice & Grains', slug: 'rice-grains', icon: '🌾' },
  { name: 'Spices', slug: 'spices', icon: '🌶️' },
  { name: 'Coconut Products', slug: 'coconut', icon: '🥥' },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@agrilink.lk',
  password: 'admin123',
  phone: '+94771111111',
  role: 'admin',
};

const sellerUsers = [
  {
    name: 'Nimal Perera',
    email: 'seller@agrilink.lk',
    password: 'seller123',
    phone: '+94773456789',
    role: 'seller',
    farmName: 'Highland Fresh Farms',
    district: 'Nuwara Eliya',
    address: 'Ramboda Road, Nuwara Eliya',
    bank: {
      accountName: 'Nimal Perera',
      accountNo: '1234567890',
      bankName: 'Bank of Ceylon',
      branch: 'Nuwara Eliya',
    },
  },
  {
    name: 'Kamal Silva',
    email: 'kamal@farmlink.lk',
    password: 'seller123',
    phone: '+94774567890',
    role: 'seller',
    farmName: 'Golden Harvest',
    district: 'Anuradhapura',
    address: 'Mihintale Road, Anuradhapura',
    bank: {
      accountName: 'Kamal Silva',
      accountNo: '9876543210',
      bankName: "People's Bank",
      branch: 'Anuradhapura',
    },
  },
];

const buyerUsers = [
  {
    name: 'Amara Silva',
    email: 'buyer@agrilink.lk',
    password: 'buyer123',
    phone: '+94771234567',
    role: 'buyer',
    district: 'Colombo',
    address: '123 Galle Road, Colombo 03',
  },
];

const agentUsers = [
  {
    name: 'Dinesh Rajapaksa',
    email: 'agent@agrilink.lk',
    password: 'agent123',
    phone: '+94778901234',
    role: 'agent',
    regions: ['Colombo', 'Gampaha', 'Kalutara'],
    officeContact: '+94112345678',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert users (use .save() so Mongoose pre('save') hooks run and passwords are hashed)
    const allUsers = [adminUser, ...sellerUsers, ...buyerUsers, ...agentUsers];
    const insertedUsers = [];
    for (const u of allUsers) {
      const user = new User(u);
      await user.save(); // triggers pre-save hashing in User model
      insertedUsers.push(user);
    }
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Insert sample products
    const sellerIds = insertedUsers.filter((u) => u.role === 'seller').map((u) => u._id);
    const categoryIds = insertedCategories.map((c) => c._id);

    const products = [
      {
        name: 'Fresh Tomatoes',
        category: categoryIds[0], // Vegetables
        description: 'Fresh organic tomatoes from highland farms',
        pricePerKg: 120,
        image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400',
        stockQty: 500,
        supplyType: 'small_scale',
        locationDistrict: 'Nuwara Eliya',
        sellerId: sellerIds[0],
        expiresOn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Red Onions',
        category: categoryIds[0], // Vegetables
        description: 'Premium quality red onions, bulk orders available',
        pricePerKg: 180,
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
        stockQty: 2000,
        supplyType: 'wholesale',
        locationDistrict: 'Anuradhapura',
        sellerId: sellerIds[1],
        expiresOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Bananas (Ambul)',
        category: categoryIds[1], // Fruits
        description: 'Fresh Ambul bananas, perfect for wholesale',
        pricePerKg: 90,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
        stockQty: 3000,
        supplyType: 'wholesale',
        locationDistrict: 'Kurunegala',
        sellerId: sellerIds[0],
        expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'White Rice (Samba)',
        category: categoryIds[2], // Rice & Grains
        description: 'Premium Samba rice, freshly harvested',
        pricePerKg: 150,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        stockQty: 5000,
        supplyType: 'wholesale',
        locationDistrict: 'Polonnaruwa',
        sellerId: sellerIds[1],
        expiresOn: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ];
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@agrilink.lk / admin123');
    console.log('Seller: seller@agrilink.lk / seller123');
    console.log('Buyer: buyer@agrilink.lk / buyer123');
    console.log('Agent: agent@agrilink.lk / agent123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
