import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Negotiation from './models/Negotiation.js';
import Category from './models/Category.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/famers-gate');

// Hash password function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Negotiation.deleteMany();
    await Category.deleteMany();

    // Import categories
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../frontend/src/data/categories.json'), 'utf-8')
    );
    await Category.insertMany(categoriesData);
    console.log('✅ Categories imported');

    // Import users
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../frontend/src/data/users.json'), 'utf-8')
    );

    const users = [];

    // Process buyers - Add more buyers
    const additionalBuyers = [
      {
        id: "buyer-3",
        name: "Kumari Fernando",
        firstName: "Kumari",
        lastName: "Fernando",
        email: "kumari@hotel.lk",
        nic: "198512345678",
        phone: "+94779876543",
        district: "Galle",
        address: "78 Beach Road, Galle",
        preferredCategories: ["cat-1", "cat-2", "cat-4"],
        createdAt: "2025-09-10T14:00:00Z"
      },
      {
        id: "buyer-4",
        name: "Rajesh Kumar",
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh@restaurant.lk",
        nic: "198723456789",
        phone: "+94780987654",
        district: "Jaffna",
        address: "45 Temple Road, Jaffna",
        preferredCategories: ["cat-1", "cat-3"],
        createdAt: "2025-09-15T16:00:00Z"
      },
      {
        id: "buyer-5",
        name: "Nisha Perera",
        firstName: "Nisha",
        lastName: "Perera",
        email: "nisha@cafe.lk",
        nic: "199034567890",
        phone: "+94782098765",
        district: "Matara",
        address: "12 Hill Street, Matara",
        preferredCategories: ["cat-2", "cat-4"],
        createdAt: "2025-09-20T18:00:00Z"
      }
    ];

    for (const buyer of [...usersData.buyers, ...additionalBuyers]) {
      const hashedPassword = await hashPassword('password123');
      users.push({
        role: 'buyer',
        name: buyer.name,
        firstName: buyer.firstName,
        lastName: buyer.lastName,
        email: buyer.email,
        password: hashedPassword,
        phone: buyer.phone,
        nic: buyer.nic,
        district: buyer.district,
        address: buyer.address,
        preferredCategories: buyer.preferredCategories,
        status: 'active',
        createdAt: new Date(buyer.createdAt),
      });
    }

    // Process sellers - Add more sellers
    const additionalSellers = [
      {
        id: "seller-6",
        name: "Priyantha Silva",
        email: "priyantha@organic.lk",
        phone: "+94783109876",
        farmName: "Organic Valley",
        district: "Badulla",
        address: "89 Tea Estate Road, Badulla",
        bank: {
          accountName: "Priyantha Silva",
          accountNo: "44445555666",
          bankName: "People's Bank",
          branch: "Badulla"
        },
        status: "active",
        createdAt: "2025-09-25T20:00:00Z"
      },
      {
        id: "seller-7",
        name: "Malini Jayasinghe",
        email: "malini@spicegarden.lk",
        phone: "+94784210987",
        farmName: "Spice Garden",
        district: "Kegalle",
        address: "67 Spice Road, Kegalle",
        bank: {
          accountName: "Malini Jayasinghe",
          accountNo: "77778888999",
          bankName: "Commercial Bank",
          branch: "Kegalle"
        },
        status: "active",
        createdAt: "2025-10-01T22:00:00Z"
      },
      {
        id: "seller-8",
        name: "Saman Kumara",
        email: "saman@fruitfarm.lk",
        phone: "+94785321098",
        farmName: "Tropical Fruits",
        district: "Hambantota",
        address: "34 Fruit Lane, Hambantota",
        bank: {
          accountName: "Saman Kumara",
          accountNo: "11112222333",
          bankName: "Sampath Bank",
          branch: "Hambantota"
        },
        status: "pending",
        createdAt: "2025-10-05T08:00:00Z"
      }
    ];

    for (const seller of [...usersData.sellers, ...additionalSellers]) {
      const hashedPassword = await hashPassword('password123');
      users.push({
        role: 'seller',
        name: seller.name,
        email: seller.email,
        password: hashedPassword,
        phone: seller.phone,
        farmName: seller.farmName,
        district: seller.district,
        address: seller.address,
        bank: seller.bank,
        status: seller.status,
        createdAt: new Date(seller.createdAt),
      });
    }

    // Process agents - Add more agents
    const additionalAgents = [
      {
        id: "agent-4",
        name: "Kumari Fernando",
        email: "kumari@agent.lk",
        phone: "+94786432109",
        regions: ["Gampaha", "Colombo"],
        officeContact: "+94112345678",
        status: "active",
        createdAt: "2025-09-20T14:00:00Z"
      },
      {
        id: "agent-5",
        name: "Rohan Perera",
        email: "rohan@agent.lk",
        phone: "+94787543210",
        regions: ["Kurunegala", "Puttalam"],
        officeContact: "+94372234567",
        status: "active",
        createdAt: "2025-09-28T16:00:00Z"
      },
      {
        id: "agent-6",
        name: "Anura Bandara",
        email: "anura@agent.lk",
        phone: "+94788654321",
        regions: ["Anuradhapura", "Polonnaruwa"],
        officeContact: "+94252234567",
        status: "pending",
        createdAt: "2025-10-03T10:00:00Z"
      }
    ];

    for (const agent of [...usersData.agents, ...additionalAgents]) {
      const hashedPassword = await hashPassword('password123');
      users.push({
        role: 'agent',
        name: agent.name,
        email: agent.email,
        password: hashedPassword,
        phone: agent.phone,
        regions: agent.regions,
        officeContact: agent.officeContact,
        status: agent.status,
        createdAt: new Date(agent.createdAt),
      });
    }

    // Process admins
    for (const admin of usersData.admins) {
      const hashedPassword = await hashPassword('password123');
      users.push({
        role: 'admin',
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        phone: admin.phone,
        permissions: admin.permissions,
        status: 'active',
        createdAt: new Date(admin.createdAt),
      });
    }

    await User.insertMany(users);
    console.log('✅ Users imported');

    // Import products
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../frontend/src/data/products.json'), 'utf-8')
    );
    await Product.insertMany(productsData);
    console.log('✅ Products imported');

    // Import orders
    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../frontend/src/data/orders.json'), 'utf-8')
    );

    // Populate missing seller info in orders
    const productsMap = {};
    const products = await Product.find({});
    products.forEach(product => {
      productsMap[product._id] = product;
    });

    const processedOrders = ordersData.map(order => ({
      ...order,
      items: order.items.map(item => {
        if (item.sellerId && item.sellerName) {
          return item;
        }
        // Find product to get seller info
        const product = products.find(p => p._id.toString() === item.productId || p.name === item.productName);
        if (product) {
          return {
            ...item,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
          };
        }
        return item;
      }),
    }));

    await Order.insertMany(processedOrders);
    console.log('✅ Orders imported');

    // Import negotiations
    const negotiationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../frontend/src/data/negotiations.json'), 'utf-8')
    );
    await Negotiation.insertMany(negotiationsData);
    console.log('✅ Negotiations imported');

    console.log('🎉 All data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Negotiation.deleteMany();
    await Category.deleteMany();

    console.log('🗑️  Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}