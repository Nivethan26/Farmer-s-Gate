import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function verifyBuyerCleanup() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check all buyer users
    const allBuyers = await User.find({ role: 'buyer' }).select('email firstName lastName name');
    
    console.log(`\n📊 Total buyer users: ${allBuyers.length}\n`);
    
    // Check if any buyers still have name field
    const buyersWithName = allBuyers.filter(user => user.name !== undefined);
    
    if (buyersWithName.length > 0) {
      console.log(`❌ Found ${buyersWithName.length} buyer users that still have name field:`);
      buyersWithName.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email} | Name: "${user.name}"`);
      });
    } else {
      console.log('✅ All buyer users have been cleaned up - no name field found');
    }

    console.log('\n📋 Current buyer user structure:');
    allBuyers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} | FirstName: "${user.firstName || 'N/A'}" | LastName: "${user.lastName || 'N/A'}" | Name: ${user.name ? `"${user.name}"` : 'undefined'}`);
    });

    // Verify other roles still have name field where expected
    const nonBuyerUsers = await User.find({ role: { $ne: 'buyer' } }).select('role email name');
    console.log(`\n📊 Non-buyer users (should have name field): ${nonBuyerUsers.length}`);
    
    const nonBuyersWithoutName = nonBuyerUsers.filter(user => !user.name);
    if (nonBuyersWithoutName.length > 0) {
      console.log(`⚠️  Warning: ${nonBuyersWithoutName.length} non-buyer users are missing name field:`);
      nonBuyersWithoutName.forEach((user, index) => {
        console.log(`${index + 1}. Role: ${user.role} | Email: ${user.email} | Name: ${user.name || 'undefined'}`);
      });
    } else {
      console.log('✅ All non-buyer users have name field as expected');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the verification
verifyBuyerCleanup();