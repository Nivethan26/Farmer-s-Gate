import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const checkSellers = async () => {
  try {
    await connectDB();
    
    console.log('Checking sellers in database...');
    
    const sellers = await User.find({ role: 'seller' });
    console.log(`Found ${sellers.length} sellers:`);
    
    sellers.forEach((seller, index) => {
      console.log(`${index + 1}. ID: ${seller._id}`);
      console.log(`   Name: ${seller.name || `${seller.firstName} ${seller.lastName}`}`);
      console.log(`   Email: ${seller.email}`);
      console.log(`   Phone: ${seller.phone}`);
      console.log('---');
    });
    
    if (sellers.length === 0) {
      console.log('No sellers found in database!');
      console.log('You may need to seed the database with seller data.');
    }
    
  } catch (error) {
    console.error('Error checking sellers:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkSellers();